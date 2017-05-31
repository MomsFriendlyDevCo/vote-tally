angular.module('app', [
	'angular-bs-tooltip',
	'angular-ui-vote-tally',
])
	.controller('demoCtrl', function($scope, VoteTally) {
		$scope.config = {
			total: 100,
			approve: 35,
			reject: 10,
			abstain: 5,
			method: 'simpleMajority',
			summary: true,
			tooltips: 'hover',
		};
		$scope.methods = VoteTally.methods;
		$scope.active = {
			waiting: 50, // Participants not yet voted
		};

		// .methodDescription {{{
		$scope.methodDescription;
		$scope.$watch('config.method', function() {
			$scope.methodDescription = $scope.methods.find(m => m.id == $scope.config.method).description;
		});
		// }}}

		// Watch voting numbers and totals {{{
		$scope.$watch('config', function() {
			if (!$scope.config || ($scope.active.waiting && $scope.active.waiting == 0)) return;
			$scope.active.waiting = $scope.config.total - $scope.config.approve - $scope.config.reject - $scope.config.abstain;

			// Specify max no. of further votes that can be made for each side - initially derived from total - waiting
			$scope.active.maxApprove = $scope.config.approve + $scope.active.waiting;
			$scope.active.maxReject = $scope.config.reject + $scope.active.waiting;
			$scope.active.maxAbstain = $scope.config.abstain + $scope.active.waiting;
		}, true);
		// }}}

		$scope.log = msg => console.log(msg);
	})
