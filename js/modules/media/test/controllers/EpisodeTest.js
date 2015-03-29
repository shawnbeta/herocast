describe('EpisodeController', function(){
	
	var scope, $location, createController;
	
	beforeEach(function(){
		module('hcMedia');
	}); 
	
	/*beforeEach(inject(function($rootScope, $controller, _$location_){
		scope = $rootScope.$new();
		$location = _$location_;
		createController = function(){
			return $controller('EpisodeController', {
				'$scope': scope
			});
		};
		
	}));
	
	
	it('should make an active path', function(){
		
		var controller = createController();
		$location.path('/episodes');
        expect($location.path()).toBe('/episodes');
        scope.makeTitle();
		expect(scope.viewTitle).toBe('Episodes');
		 
		//$location.path('/subscriptions');
		//expect($location.path()).toBe('/subscriptions');
	});*/
	
});
