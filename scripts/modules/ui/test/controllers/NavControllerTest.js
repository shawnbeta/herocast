describe('NavController', function() {
    var scope, $location, createController;

	beforeEach(function(){
        module('hcApp');
        module('ngSanitize');
	});

    beforeEach(inject(function ($rootScope, $controller, _$location_) {
        $location = _$location_;
        scope = $rootScope.$new();

        createController = function() {
            return $controller('NavController', {
                '$scope': scope
            });
        };
    })); 

	
	// This test was only for the learning. Can be removed whenever.
    it('should have a method to check if the path is active', function() {
        var controller = createController();
        $location.path('/#/episodes');
        expect($location.path()).toBe('/#/episodes');
        $location.path('/#/subscriptions');
        expect($location.path()).toBe('/#/subscriptions');
        $location.path('/#/settings');
        expect($location.path()).toBe('/#/settings');        
        
    });
});