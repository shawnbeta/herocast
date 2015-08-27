describe('SubscriptionController', function(){
	
	var $httpBackend, SubscriptionService, $rootScope, scope, $location, createController;
	
	beforeEach(function(){
		module('hcMedia');
		module('hcUtilities');
	}); 
	/*
	beforeEach(inject(function( $injector, _$location_){
		// Get hold of a scope (i.e. the root scope)
	     $rootScope = $injector.get('$rootScope');
	     scope = $rootScope.$new();
	     // The $controller service is used to create instances of controllers
	     var $controller = $injector.get('$controller');
		$location = _$location_;
		createController = function(){
			return $controller('SubscriptionController', {
				'$scope': $rootScope,
			});
		};
		 
	}));
	 
	
	it('should make an active path', function(){
		
		var controller = createController();
		$location.path('/subscriptions');
        expect($location.path()).toBe('/subscriptions');
		expect($rootScope.viewTitle).toBe('Subscriptions');

	});*/
	
});
