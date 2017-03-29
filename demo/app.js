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
			method: '50/50',
			summary: true,
			tooltips: 'hover',
		};
		$scope.methods = VoteTally.methods;
	})
