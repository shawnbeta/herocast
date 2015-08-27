describe('MediaService', function(){
	
	var httpBackend, subscriptionService, mock, HelperService;
	
	mock = [
		{
			title: 'Forcecast',
			description: 'This guy talks alot'
		},
		{
			title: 'Shawn on Star Trek',
			description: 'This guy talks alot'
		},
		{
			title: 'No Agenda',
			description: 'This guy talks alot'
		}
	];
		
	
	beforeEach(function(){
		module('hcMedia');
		module('hcUtilities');
	}); 
	
	beforeEach(inject(function(_MediaService_,  $httpBackend, _Subscription_){
		Subscription = _Subscription_;
		MediaService = _MediaService_;
		httpBackend = $httpBackend;
	}));
	
	afterEach(function() {
     httpBackend.verifyNoOutstandingExpectation();
     httpBackend.verifyNoOutstandingRequest();
   });
	
	it('should have 3 objects in mock rsp object', function(){
		httpBackend.expectGET('api/?entity=app&action=bulk').respond(mock);
		var returnedPromise = MediaService.fetchAll();
		var result;
	    returnedPromise.then(function(response) {
	      result = response;
	    });
     	httpBackend.flush();
		expect(result.data.length).toBe(3);
	}); 
	    
 
	  
});
