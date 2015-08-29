hcMedia.factory('MediaService', function($http){
  return {
  	  	
    fetchAll: function(){
      return $http.get('api/?entity=app&action=bulk');
    },
    
    purge: function(){
      return $http.get('api/?entity=app&action=purge');
    },
    
    fetchNew: function(lu){
        return $http.get('api/?entity=app&action=get-new-episodes&last-update=lu');
    }
    
    
  };
}); 


  