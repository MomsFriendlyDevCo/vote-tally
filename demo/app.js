angular.module('app', [
	'angular-bs-tooltip',
	'angular-ui-vote-tally',
])
	.controller('demoCtrl', function($scope, VoteTally) {
		$scope.config = {
			total: 100,
			approve: 30,
			reject: 10,
			abstain: 5,
			method: 'simpleMajority',
			summary: true,
			tooltips: 'hover',
		};
		$scope.methods = VoteTally.methods;
	})
