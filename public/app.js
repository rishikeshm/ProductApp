angular.module('productsApp', [
		'ui.router',
		'ui.bootstrap',
		'home',
		'edit',
		'common'
	])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/home');

			$stateProvider
				.state('home', {
					templateUrl: './modules/home/views/home.html',
					controller: 'HomeCtrl',
					url: '/home',
					title: 'Home'
				})
				.state('edit', {
					templateUrl: 'modules/edit/views/edit.html',
					controller: 'EditCtrl',
					url: '/edit',
					title: 'Edit'
				});
		}
	])
	.run(['$rootScope', '$state', function($rootScope, $state){
		$rootScope.$state = $state;
		$rootScope.$on('$stateChangeSuccess', function(event, toState){
			$rootScope.title = toState.title;
		})
	}]);