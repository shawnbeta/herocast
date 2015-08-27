hcMedia.service('DepartureService', [
    'PersistenceService', '_', '$rootScope', '$http',
function(PersistenceService, _, $rootScope, $http) {
    
    //$rootScope.departureCollection = $rootScope.departureCollection || {};
    var persistService = persistService || new PersistenceService();

    var DepartureService = function() {
    };
    
    DepartureService.prototype.initialize = function(){
        
        var self = this;
        if(!this.loadCollection){
            //console.log('no collections exist');
            return;
        }
        // If departures exist, go ahead and
        // load them into memory.
        var departureCollection = this.loadCollection();
        //console.log(departureCollection);
        this.setMemory(departureCollection);
        
        // Test the connection to see if 
        // the app has access to the api
        var connection = this.trafficCheck();
        
        
        connection.then(function(rsp){
            //console.log(rsp);
            if(rsp.data.success){
                var rqst = self.createRequest(departureCollection);
                var result = self.pushRemote(rqst);
                result.then(function(rsp){
                    //console.log(rsp);
                    if(rsp.data.success);
                        self.remove(departureCollection);
                });
                    
            }
        });
        
            },
    
    DepartureService.prototype.remove = function(departureCollection){
        
        // Erase from localStorage
        _.each(departureCollection, function(element, iteration){
            //console.log(element);
            //console.log(iteration);
            localStorage.removeItem(element);
        });
        // Remove the Departure Collection
        localStorage.removeItem('DepartureCollection');
        // Clear out of memory
        delete $rootScope.departureCollection;
    },
    
    DepartureService.prototype.trafficCheck = function(){
      return $http.get('api/?entity=app&action=test')
      .success(function(data){
          if(data.success){
              return true;
              //return false;
          }else{
              return false;
          }
      })
      .error(function(data){
          //console.log('whatever');
      });
        
      
    },
    
    DepartureService.prototype.createRequest = function(departureCollection){
        var rqst = [];
            //console.log(departureCollection);

        _.each(departureCollection, function(element){
            var ticket = localStorage.getItem(element);
            rqst.push(ticket);
        });
        return rqst;
    },
        
    DepartureService.prototype.pushRemote = function(departureCollection){
        var stringVal = encodeURIComponent(departureCollection);
        //console.log(stringVal);
      return $http.get('api/?entity=app&action=departures&val='
       + JSON.stringify(departureCollection))
      .success(function(rsp){
          //console.log(rsp);
          if(rsp.success)
              return true;
          return false;
          
      });
    },
                        
    DepartureService.prototype.setMemory = function(departureCollection){
        $rootScope.departureCollection = departureCollection;
    };
    
    DepartureService.prototype.loadCollection = function(){
        if(localStorage.getItem('DepartureCollection')){
            var string = localStorage.getItem('DepartureCollection');
            var jd = JSON.parse(string);
            console.log(jd);
            return jd;
        }
        return false;
    },

    DepartureService.prototype.makeTicket = function(data, model) {
       
        var departureCollection = 
            persistService.loadData('DepartureCollection') || [];
            
        // Create the id from the model.
        // Departures belong to models (so to speak).
        var id = 'Departure_' + model.id;
        
        departureCollection.push(id);
                
        var dcString = JSON.stringify(_.uniq(departureCollection));
        localStorage.setItem('DepartureCollection', dcString);

        // Get the existing localStorage item if possible
        if (!localStorage.getItem(id)) {
            var stringReport = JSON.stringify(data);
            return localStorage.setItem(id, stringReport);
        } else {
            var ticket = persistService.loadData(id);            
            if(ticket.target === data.target){
                    ticket = data;
                };
            var stringTicket = JSON.stringify(ticket);
            return localStorage.setItem(id, stringTicket);
        }
    };
    return DepartureService;
}]);
