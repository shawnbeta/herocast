hcMedia.factory('MediaService', ['$http',
  function($http){
  return {
  	  	
    fetchAll: function(){
      return $http.get('api/index.php?entity=app&action=bulk');
    },
    
    purge: function(){
      return $http.get('api/index.php?entity=app&action=purge');
    },
    
    fetchNew: function(lu){
        return $http.get('api/index.php?entity=app&action=get-new-episodes&last-update=lu');
    }
    
    
  };
}]);


  