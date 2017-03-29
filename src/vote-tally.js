angular
	.module('angular-ui-vote-tally', [])
	.service('VoteTally', function() {
		return {
			// INSERT MAIN LIBRARY //
		};
	})
	.component('voteTally', {
		bindings: {
			total: '<',
			approve: '<',
			reject: '<',
			abstain: '<',
			summary: '<',
			method: '@',
			tooltips: '<',
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
			$scope.$watchGroup(['$ctrl.method', '$ctrl.approve', '$ctrl.reject', '$ctrl.abstain'], ()=> {
				var ratio = VoteTally.getWinLose({
					method: $ctrl.method || '50/50',
					total: $ctrl.total,
					abstain: $ctrl.abstain,
				});

				$ctrl.settings.approve.target = ratio.toWin;
				$ctrl.settings.reject.target = ratio.toLose;
				$ctrl.settings.target.width = ratio.toWin / $ctrl.total * 100;
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
		},
		template: `
			<div class="vote-tally">
				<div class="progress">
					<div ng-class="$ctrl.settings.approve.class" style="width: {{$ctrl.settings.approve.width}}%" tooltip="{{$ctrl.approve}} in favour" tooltip-show="$ctrl.tooltips=='always' ? true : $ctrl.tooltips=='never' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>
					<div ng-class="$ctrl.settings.abstain.class" style="width: {{$ctrl.settings.abstain.width}}%" tooltip="{{$ctrl.abstain}} abstain" tooltip-show="$ctrl.tooltips=='always' ? true : $ctrl.tooltips=='never' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>
					<div ng-class="$ctrl.settings.reject.class" style="width: {{$ctrl.settings.reject.width}}%" tooltip="{{$ctrl.reject}} reject" tooltip-show="$ctrl.tooltips=='always' ? true : $ctrl.tooltips=='never' ? false : null" tooltip-position="bottom" tooltip-tether="100"></div>
					<div class="vote-tally-target" style="width: {{$ctrl.settings.target.width}}%">
						<div class="vote-tally-target-arrow-down"></div>
						<div class="vote-tally-target-arrow-up"></div>
					</div>
				</div>
				<div ng-if="$ctrl.summary" class="container row">
					<div class="col-xs-3 text-center">
						<div ng-class="$ctrl.settings.approve.summaryClass">{{$ctrl.approve}} / {{$ctrl.settings.approve.target}} to pass</div>
					</div>
					<div class="col-xs-3 text-center">
						<div ng-class="$ctrl.settings.reject.summaryClass">{{$ctrl.reject}} / {{$ctrl.settings.reject.target}} to reject</div>
					</div>
					<div class="col-xs-3 text-center">
						<div ng-class="$ctrl.settings.waiting.summaryClass">{{$ctrl.settings.waiting.count}} to vote</div>
					</div>
					<div class="col-xs-3 text-center">
						<div ng-class="$ctrl.settings.abstain.summaryClass">{{$ctrl.abstain}} abstaining</div>
					</div>
				</div>
			</div>
		`,
	});
