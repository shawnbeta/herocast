hcUtilities.service('HelperService', function(){

	var HelperService = function(){};
	
	HelperService.prototype.generateSuffix = function(data, helper){
		
		
		var text = "";
		var count = 12;
	    var possible = 
	    	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	    for( var i=0; i < count; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	        
	    return text;
	}; 
	
	// Function to return json data from
	// localStorage string.

	
	HelperService.prototype.spillBeans = function(element, iteration, list){
      console.log('element');  
      console.log(element);  
      console.log('iteration');  
      console.log(iteration);  
      console.log('list');  
      console.log(list);  
	};
	 
	return HelperService;
}); 
 
/*hcUtilities.factory('HelperService', function($http){
  return {
  	 
    generateSuffix: function(){
		var text = "";
		var count = 12;
	    var possible = 
	    	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	    for( var i=0; i < count; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	        
	    return text; 
    }
    
  }; 
}); */
