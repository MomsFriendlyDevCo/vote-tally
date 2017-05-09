angular
	.module('angular-ui-vote-tally', [])
	.service('VoteTally', function() {
		return {
			// INSERT MAIN LIBRARY //
		};
	})
	.component('voteTally', {
		bindings: {
			method: '<',
			total: '<',
			approve: '<',
			reject: '<',
			abstain: '<',
			summary: '<',
			tooltips: '<',
			onClickPass: '&?',
			onClickReject: '&?',
			onClickWaiting: '&?',
			onClickAbstain: '&?',
		},
		controller: function($scope, VoteTally) {
			var $ctrl = this;
			$ctrl.settings = {
				approve: {
					class: 'progress-bar progress-bar-success',
					summaryClass: 'alert alert-success',
					width: 0, // Calculated
					target: 0, // Calculated
				},
				reject: {
					class: 'progress-bar progress-bar-danger pull-right',
					summaryClass: 'alert alert-danger',
					width: 0, // Calculated
					target: 0, // Calculated
				},
				abstain: {
					class: 'progress-bar progress-bar-default pull-right',
					summaryClass: 'alert alert-default',
					width: 0, // Calculated
				},
				waiting: { // Meta class for votes we are waiting on (derived from total - votes)
					summaryClass: 'alert alert-info',
					width: 0, // Calculated
					count: 0, // Calculated
				},
				target: { // Meta class for the target element
					width: 0, // Calculated
				},
			};

			// Recalculate targets based on method + changes {{{
			$scope.winner;
			$scope.$watchGroup(['$ctrl.method', '$ctrl.approve', '$ctrl.reject', '$ctrl.abstain'], ()=> {
				var ratio = VoteTally.getWinLose({
					method: $ctrl.method || 'simpleMajority',
					total: $ctrl.total,
					abstain: $ctrl.abstain,
				});

				$ctrl.settings.approve.target = ratio.toWin;
				$ctrl.settings.reject.target = ratio.toLose;
				$ctrl.settings.target.width = ratio.toWin / $ctrl.total * 100;

				$scope.winner = $ctrl.approve >= ratio.toWin ? 'approve'
					: $ctrl.reject >= ratio.toLose ? 'reject'
					: null;
			});
			// }}}

			// Recalculate widths on changes {{{
			$scope.$watchGroup(['$ctrl.total', '$ctrl.approve'], ()=> $ctrl.settings.approve.width = $ctrl.approve / $ctrl.total * 100);
			$scope.$watchGroup(['$ctrl.total', '$ctrl.reject'], ()=> $ctrl.settings.reject.width = $ctrl.reject / $ctrl.total * 100);
			$scope.$watchGroup(['$ctrl.total', '$ctrl.abstain'], ()=> $ctrl.settings.abstain.width = $ctrl.abstain / $ctrl.total * 100);

			$scope.$watchGroup(['$ctrl.total', '$ctrl.approve', '$ctrl.reject', '$ctrl.abstain'], ()=> {
				$ctrl.settings.waiting.count = $ctrl.total - $ctrl.approve - $ctrl.reject - $ctrl.abstain;
				$ctrl.settings.waiting.width = $ctrl.settings.waiting.count / $ctrl.total * 100;
			});
			// }}}

			// Handle events {{{
			$ctrl.fire = handle => {
				if (!$ctrl[handle]) return; // No handler
				$ctrl[handle]();
			};
			// }}}
		},
		template: `
			<div class="vote-tally" ng-class="{'vote-tally-winner-approve': winner == 'approve', 'vote-tally-winner-reject': winner == 'reject'}">
				<div class="progress">
					<div ng-click="$ctrl.fire('onClickPass')" ng-class="$ctrl.settings.approve.class" style="width: {{$ctrl.settings.approve.width}}%; {{$ctrl.onClickPass && 'cursor: pointer'}}" tooltip="{{$ctrl.approve}} in favour" tooltip-show="$ctrl.tooltips=='always' ? true : $ctrl.tooltips=='never' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>
					<div ng-click="$ctrl.fire('onClickAbstain')" ng-class="$ctrl.settings.abstain.class" style="width: {{$ctrl.settings.abstain.width}}%; {{$ctrl.onClickAbstain && 'cursor: pointer'}}" tooltip="{{$ctrl.abstain}} abstain" tooltip-show="$ctrl.tooltips=='always' ? true : $ctrl.tooltips=='never' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>
					<div ng-click="$ctrl.fire('onClickReject')" ng-class="$ctrl.settings.reject.class" style="width: {{$ctrl.settings.reject.width}}%; {{$ctrl.onClickReject && 'cursor: pointer'}}" tooltip="{{$ctrl.reject}} reject" tooltip-show="$ctrl.tooltips=='always' ? true : $ctrl.tooltips=='never' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>
					<div class="vote-tally-target" style="width: {{$ctrl.settings.target.width}}%">
						<div class="vote-tally-target-arrow-down"></div>
						<div class="vote-tally-target-arrow-up"></div>
					</div>
				</div>
				<div ng-if="$ctrl.summary" class="container row">
					<div ng-click="$ctrl.fire('onClickPass')" class="col-xs-3 text-center" style="{{$ctrl.onClickPass && 'cursor: pointer'}}">
						<div ng-class="$ctrl.settings.approve.summaryClass">{{$ctrl.approve}} / {{$ctrl.settings.approve.target}} to pass</div>
					</div>
					<div ng-click="$ctrl.fire('onClickReject')" class="col-xs-3 text-center" style="{{$ctrl.onClickReject && 'cursor: pointer'}}">
						<div ng-class="$ctrl.settings.reject.summaryClass">{{$ctrl.reject}} / {{$ctrl.settings.reject.target}} to reject</div>
					</div>
					<div ng-click="$ctrl.fire('onClickWaiting')" class="col-xs-3 text-center" style="{{$ctrl.onClickWaiting && 'cursor: pointer'}}">
						<div ng-class="$ctrl.settings.waiting.summaryClass">{{$ctrl.settings.waiting.count}} to vote</div>
					</div>
					<div ng-click="$ctrl.fire('onClickAbstain')" class="col-xs-3 text-center" style="{{$ctrl.onClickAbstain && 'cursor: pointer'}}">
						<div ng-class="$ctrl.settings.abstain.summaryClass">{{$ctrl.abstain}} abstaining</div>
					</div>
				</div>
			</div>
		`,
	});
