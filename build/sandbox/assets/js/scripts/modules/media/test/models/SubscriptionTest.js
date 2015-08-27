describe('Subscription', function(){
	
	var httpBackend, mock;
	
	mock = {
			title: 'Forcecast',
			description: 'This guy talks alot'
		};
		
	
	beforeEach(function(){
		module('hcMedia');
		module('hcUtilities');
	}); 
	
	beforeEach(inject(function(_Subscription_, _HelperService_){
		Subscription = _Subscription_;
		HelperService = _HelperService_;
	}));
	
   
   it('should be models', function(){
   	var h = new HelperService();
   	var s = new Subscription();
   	var subscription = s.buildModel(mock, h);
   	expect(subscription.title).toEqual('Forcecast'); 
	});
	
	    
 
	 
});
