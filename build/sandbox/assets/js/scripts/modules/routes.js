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
    .when('/add', {
        controller : 'SubscriptionController',
        templateUrl : 'assets/js/scripts/modules/media/templates/add.html'
    })  	
	.when('/settings', {
		controller : 'SettingsController',
		templateUrl : 'assets/js/scripts/modules/app/templates/settings.html'
	})		
	.otherwise({
		redirectTo : '/'
	});
}]); 