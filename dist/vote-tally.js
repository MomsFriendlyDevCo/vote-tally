'use strict';

angular.module('angular-ui-vote-tally', []).service('VoteTally', function () {
	return {
		/**
  * Collection of supported voting methods
  * @var {array}
  */
		methods: [{
			id: 'simpleMajority',
			title: 'Simple Majority',
			description: '50% + 1 wins'
		}, {
			id: '2/3rds',
			title: 'Two-thirds majority',
			description: 'FIXME'
		}, {
			id: '3/5ths',
			title: 'Three-fifths majority',
			description: 'FIXME'
		}, {
			id: 'unsc',
			title: 'UN Security Council (9/14ths)',
			description: 'Abstentions do not count during calculation'
		}, {
			id: 'unanimous',
			title: 'Unanimous',
			description: 'All votes must be in favour, none must reject to pass'
		}],

		/**
  * Calculate Win/Lose ratios for various voting types
  * @param {Object} options Options to use
  * @param {string} options.method The vote method to use (see code for valid types)
  * @param {number} options.total The total number of votes
  * @param {number} options.abstain Optional number of the number of abstentions
  * @return {Object} New structure containing voters, toWin, toLose
  */
		getWinLose: function getWinLose(options) {
			var realTotal = options.total - (options.abstain || 0);
			switch (options.method) {
				case '2/3rds':
					if (realTotal == 0) return { toWin: 0, toLose: 0, voters: 0 };
					if (realTotal == 1) return { toWin: 1, toLose: 1, voters: 1 };
					if (realTotal == 2) return { toWin: 2, toLose: 1, voters: 2 };

					var third = Math.floor(realTotal / 3);
					return {
						toWin: third * 2,
						toLose: third * 1 + 1,
						voters: realTotal
					};
					break;
				case '3/5ths':
					if (realTotal == 0) return { toWin: 0, toLose: 0, voters: 0 };
					if (realTotal == 1) return { toWin: 1, toLose: 1, voters: 1 };
					if (realTotal == 2) return { toWin: 2, toLose: 1, voters: 2 };
					if (realTotal == 3) return { toWin: 3, toLose: 1, voters: 3 };
					if (realTotal == 4) return { toWin: 3, toLose: 2, voters: 4 };

					var fifth = Math.ceil(realTotal / 5);
					return {
						toWin: fifth * 3 + 1,
						toLose: fifth * 2,
						voters: realTotal
					};
					break;
				case 'unsc':
					realTotal = options.total; // Abstentions are ignored in the UNSC. Total SHOULD also be 14 but we're going to allow for more here

					var segment = Math.ceil(realTotal / 14);
					return {
						toWin: segment * 9,
						toLose: segment * 5,
						voters: realTotal
					};
					break;
				case 'unanimous':
					if (realTotal == 0) return { toWin: 0, toLose: 0, voters: 0 };

					return {
						toWin: realTotal,
						toLose: 1,
						voters: realTotal
					};
					break;
				case 'simpleMajority':
					if (realTotal == 0) return { toWin: 0, toLose: 0, voters: 0 };
					if (realTotal == 1) return { toWin: 1, toLose: 1, voters: 1 };

					return {
						toWin: Math.ceil(realTotal / 2) + 1,
						toLose: Math.ceil(realTotal / 2),
						voters: realTotal
					};
					break;
				default:
					throw new Error('Unknown vote method: ' + options.method);
			}
		}
	};
}).component('voteTally', {
	bindings: {
		method: '<',
		total: '<',
		approve: '<',
		reject: '<',
		abstain: '<',
		summary: '<',
		tooltips: '<'
	},
	controller: ["$scope", "VoteTally", function controller($scope, VoteTally) {
		var $ctrl = this;
		$ctrl.settings = {
			approve: {
				class: 'progress-bar progress-bar-success',
				summaryClass: 'alert alert-success',
				width: 0, // Calculated
				target: 0 },
			reject: {
				class: 'progress-bar progress-bar-danger pull-right',
				summaryClass: 'alert alert-danger',
				width: 0, // Calculated
				target: 0 },
			abstain: {
				class: 'progress-bar progress-bar-default pull-right',
				summaryClass: 'alert alert-default',
				width: 0 },
			waiting: { // Meta class for votes we are waiting on (derived from total - votes)
				summaryClass: 'alert alert-info',
				width: 0, // Calculated
				count: 0 },
			target: { // Meta class for the target element
				width: 0 }
		};

		// Recalculate targets based on method + changes {{{
		$scope.winner;
		$scope.$watchGroup(['$ctrl.method', '$ctrl.approve', '$ctrl.reject', '$ctrl.abstain'], function () {
			var ratio = VoteTally.getWinLose({
				method: $ctrl.method || 'simpleMajority',
				total: $ctrl.total,
				abstain: $ctrl.abstain
			});

			$ctrl.settings.approve.target = ratio.toWin;
			$ctrl.settings.reject.target = ratio.toLose;
			$ctrl.settings.target.width = ratio.toWin / $ctrl.total * 100;

			$scope.winner = $ctrl.approve >= ratio.toWin ? 'approve' : $ctrl.reject >= ratio.toLose ? 'reject' : null;
		});
		// }}}

		// Recalculate widths on changes {{{
		$scope.$watchGroup(['$ctrl.total', '$ctrl.approve'], function () {
			return $ctrl.settings.approve.width = $ctrl.approve / $ctrl.total * 100;
		});
		$scope.$watchGroup(['$ctrl.total', '$ctrl.reject'], function () {
			return $ctrl.settings.reject.width = $ctrl.reject / $ctrl.total * 100;
		});
		$scope.$watchGroup(['$ctrl.total', '$ctrl.abstain'], function () {
			return $ctrl.settings.abstain.width = $ctrl.abstain / $ctrl.total * 100;
		});

		$scope.$watchGroup(['$ctrl.total', '$ctrl.approve', '$ctrl.reject', '$ctrl.abstain'], function () {
			$ctrl.settings.waiting.count = $ctrl.total - $ctrl.approve - $ctrl.reject - $ctrl.abstain;
			$ctrl.settings.waiting.width = $ctrl.settings.waiting.count / $ctrl.total * 100;
		});
		// }}}
	}],
	template: '\n\t\t\t<div class="vote-tally" ng-class="{\'vote-tally-winner-approve\': winner == \'approve\', \'vote-tally-winner-reject\': winner == \'reject\'}">\n\t\t\t\t<div class="progress">\n\t\t\t\t\t<div ng-class="$ctrl.settings.approve.class" style="width: {{$ctrl.settings.approve.width}}%" tooltip="{{$ctrl.approve}} in favour" tooltip-show="$ctrl.tooltips==\'always\' ? true : $ctrl.tooltips==\'never\' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>\n\t\t\t\t\t<div ng-class="$ctrl.settings.abstain.class" style="width: {{$ctrl.settings.abstain.width}}%" tooltip="{{$ctrl.abstain}} abstain" tooltip-show="$ctrl.tooltips==\'always\' ? true : $ctrl.tooltips==\'never\' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>\n\t\t\t\t\t<div ng-class="$ctrl.settings.reject.class" style="width: {{$ctrl.settings.reject.width}}%" tooltip="{{$ctrl.reject}} reject" tooltip-show="$ctrl.tooltips==\'always\' ? true : $ctrl.tooltips==\'never\' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>\n\t\t\t\t\t<div class="vote-tally-target" style="width: {{$ctrl.settings.target.width}}%">\n\t\t\t\t\t\t<div class="vote-tally-target-arrow-down"></div>\n\t\t\t\t\t\t<div class="vote-tally-target-arrow-up"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div ng-if="$ctrl.summary" class="container row">\n\t\t\t\t\t<div class="col-xs-3 text-center">\n\t\t\t\t\t\t<div ng-class="$ctrl.settings.approve.summaryClass">{{$ctrl.approve}} / {{$ctrl.settings.approve.target}} to pass</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="col-xs-3 text-center">\n\t\t\t\t\t\t<div ng-class="$ctrl.settings.reject.summaryClass">{{$ctrl.reject}} / {{$ctrl.settings.reject.target}} to reject</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="col-xs-3 text-center">\n\t\t\t\t\t\t<div ng-class="$ctrl.settings.waiting.summaryClass">{{$ctrl.settings.waiting.count}} to vote</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="col-xs-3 text-center">\n\t\t\t\t\t\t<div ng-class="$ctrl.settings.abstain.summaryClass">{{$ctrl.abstain}} abstaining</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t'
});