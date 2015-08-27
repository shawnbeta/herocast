hcUtilities.service('SubscriptionMockService', [
    'PersistenceService', 
    function(PersistenceService){

    var SubscriptionMockService = function(){};
    var persistenceService = new PersistenceService();
    
    SubscriptionMockService.prototype.mockArray = function(){
        
        return [
        {   
            "id": "1",
            "title": "Forcecast",
            "description": "This guy talks alot",
            "src": "http://website.com",
            "img": "http://image.com",
            "subscription_type": 'audio',
            "home_page": 'http://www.frizzmop.com',
            "auto_download": '0',
            "create_date": '1425519821',
            "modified_date": '1425519821'          
        },
        {
            "id": "2",
            "title": "Shawn on Star Trek",
            "description": "This guy talks alot",
            "src": "http://website.com",
            "img": "http://image.com",
            "subscription_type": 'audio',
            "home_page": 'http://www.frizzmop.com',
            "auto_download": '0',
            "create_date": '1425519821',
            "modified_date": '1425519821'       
        }, 
        {
            "id": "3",
            "title": "No Agenda",
            "description": "This guy talks alot",
            "src": "http://website.com",
            "img": "http://image.com",
            "subscription_type": 'audio',
            "home_page": 'http://www.frizzmop.com',
            "auto_download": '0',
            "create_date": '1425519821',
            "modified_date": '1425519821'     
        }
    ];
  
    }; 

    SubscriptionMockService.prototype.mockObject = function(){
        return  {
            "id": "1",
            "title": "MockTitle",
            "description": "Mock description is where the text goes",
            "src": "http://website.com",
            "img": "http://image.com",
            "subscription_type": 'audio',
            "home_page": 'http://www.frizzmop.com',
            "auto_download": '0',
            "create_date": '1425519821',
            "modified_date": '1425519821'             
        };
    };
     
    SubscriptionMockService.prototype.mockSuccess = function(){
        return { success: true};
    };
     
    SubscriptionMockService.prototype.mockLocalStorage = function(){
        var mockEpisodes = this.mockArray();
        mockCollection = [];
        _.each(mockEpisodes, function(episode, i){
            mockCollection.push(episode.id);
            localStorage.setItem('s' + episode.id, JSON.stringify(episode)); 
        });
        localStorage.setItem('TEST_COLLECTION', JSON.stringify(mockCollection));
    };  
    
    SubscriptionMockService.prototype.loadMockCollection = function(){
        return persistenceService.loadData('TEST_COLLECTION');
    };
     
    SubscriptionMockService.prototype.loadMockObject = function(mockCollectionObj){
        //console.log(mockCollectionObj);
        var mockLocalStorageString = _.first(mockCollectionObj);
        return persistenceService.loadData(mockLocalStorageString);
    };
     
    SubscriptionMockService.prototype.mockAssembeled = function(es){
        var mockEpisodes = this.mockArray();
        return es.assembleBulkModels(mockEpisodes);
    };
    
         
    return SubscriptionMockService;
}]); 
 