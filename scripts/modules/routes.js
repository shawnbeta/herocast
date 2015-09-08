
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

.when('/subscriptions', {
controller : 'SubscriptionController',
templateUrl : 'assets/js/scripts/modules/media/templates/subscriptions.html'
})

.when('/add', {
controller : 'SubscriptionController',
templateUrl : 'assets/js/scripts/modules/media/templates/add.html'
})

.when('/about', {
controller : 'SubscriptionController',
templateUrl : 'assets/js/scripts/modules/app/templates/about.html'
})

.when('/settings', {
controller : 'SettingsController',
templateUrl : 'assets/js/scripts/modules/app/templates/settings.html'
})

.otherwise({
redirectTo : '/'
});
}]);

