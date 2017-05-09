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

		// .methodDescription {{{
		$scope.methodDescription;
		$scope.$watch('config.method', function() {
			$scope.methodDescription = $scope.methods.find(m => m.id == $scope.config.method).description;
		});
		// }}}

		$scope.log = msg => console.log(msg);
	})
