hcApp.config(['$routeProvider',

function($routeProvider) {
	$routeProvider
	.when('/', {
		controller : 'EpisodeController',
		templateUrl : 'assets/js/scripts/modules/media/templates/episodes.html'
	})
	.when('/episodes', {
		controller : 'EpisodeController',
		templateUrl : 'assets/js/scripts/modules/media/templates/episodes.html'
	})
		.when('/video-player/:id', {
			controller : 'PlayerController',
			templateUrl : 'assets/js/scripts/modules/player/templates/video.html'
		})
		.when('/subscriptions', {
		controller : 'SubscriptionController',
		templateUrl : 'assets/js/scripts/modules/media/templates/subscriptions.html'
	})
    .when('/search', {
        controller : 'SearchController',
        templateUrl : 'assets/js/scripts/modules/media/templates/search.html'
    })  	
	.when('/settings', {
		controller : 'SettingsController',
		templateUrl : 'assets/js/scripts/modules/app/templates/settings.html'
	})		
	.otherwise({
		redirectTo : '/'
	});
}]); 