hcApp.config(['$routeProvider',

function($routeProvider) {
	$routeProvider
	.when('/', {
		controller : 'EpisodeController',
		templateUrl : 'js/modules/media/templates/episodes.html'
	})
	.when('/episodes', {
		controller : 'EpisodeController',
		templateUrl : 'js/modules/media/templates/episodes.html'
	})	
	.when('/subscriptions', {
		controller : 'SubscriptionController',
		templateUrl : 'js/modules/media/templates/subscriptions.html'
	})
    .when('/search', {
        controller : 'SearchController',
        templateUrl : 'js/modules/media/templates/search.html'
    })  	
	.when('/settings', {
		controller : 'SettingsController',
		templateUrl : 'js/modules/app/templates/settings.html'
	})		
	.otherwise({
		redirectTo : '/'
	});
}]); 