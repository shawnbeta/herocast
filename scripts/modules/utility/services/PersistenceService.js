hcUtilities.factory('PersistenceService', function(){

	var PersistenceService = function(){};
	
	PersistenceService.prototype.save = function(id, model){
        localStorage.setItem(id, JSON.stringify(model));
    };
    	
    PersistenceService.prototype.loadData = function(_id){
      var stringData = localStorage.getItem(_id);
      return JSON.parse(stringData);
    };
    
    PersistenceService.prototype.updateModel = function(id, model){
        // Simple. Just overwrite the existing model string.
      localStorage.setItem(id, JSON.stringify(model));
    };    
    
	return PersistenceService;
});

 
 