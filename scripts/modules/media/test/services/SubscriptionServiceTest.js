describe('SubscriptionService', function() {

    var httpBackend, mockery;

    beforeEach(function() {
        module('hcMedia');
        module('hcUtilities');
        module('hcVendors');
    });

    beforeEach(inject(function(_SubscriptionService_, $httpBackend, _Subscription_) {
        Subscription = _Subscription_;
        SubscriptionService = _SubscriptionService_;
        httpBackend = $httpBackend;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // add()
    it('should add new subscription', function() {
        var src, subscriptionType = 'test';
        var success = {
            success : true
        };
        httpBackend.expectGET('api/?entity=subscription&action=add&src=' + src + '&subscriptionType=' + subscriptionType).respond(success);
        var returnedPromise = SubscriptionService.add(src, subscriptionType);
        var result;
        returnedPromise.then(function(response) {
            result = response;
        });
        httpBackend.flush();
        expect(result.data.success).toBe(true);
    });

    // TESTING: insertNewMedia()
    it('should add new models to existing array', function() {

        var rsSubscriptions = [{
            id : 1,
            img : '222'
        }, {
            id : 2,
            img : '222'
        }, {
            id : 3,
            img : '222'
        }];
        var rsEpisodes = [{
            id : 1,
            img : '222'
        }, {
            id : 2,
            img : '222'
        }, {
            id : 3,
            img : '222'
        }];

        var responseSubscription = {
            id : 1,
            img : '222'
        };
        var responseEpisodes = [{
            id : 1,
            img : '222',
            pub_date : '1414946800000'
        }, {
            id : 2,
            img : '222',
            pub_date : '1414923800000'            
        }, {
            id : 3,
            img : '222',
            pub_date : '1414918800000'            
        }];
        
        var edpc = [
            {"9306":1414918800000},
            {"9307":1414923800000},
            {"9308":1414946800000},
        ];        
        

        localStorage.setItem('EPISODE_PUB_DATE_COLLECTION', JSON.stringify(edpc));
        
        var data = [];
        data['episodes'] = responseEpisodes;
        data['subscription'] = responseSubscription;

        var rsp = SubscriptionService.insertNewMedia(rsSubscriptions, rsEpisodes, data);

        expect(_.size(rsp.subscriptions)).toEqual(3);
        expect(_.size(rsp.episodes)).toEqual(4);

    });

    // load()
    it('will load subscriptions from localStorage', function() {

        // Mock models
        var s1 = {
            id : 1,
            title : 'Shawn on Star Trek'
        };
        var s2 = {
            id : 2,
            title : 'Forcecast'
        };

        // Set items in localStorage
        localStorage.setItem('s1', JSON.stringify(s1));
        localStorage.setItem('s2', JSON.stringify(s2));

        var subscriptionCollection = [1, 2];

        var rsp = SubscriptionService.load(subscriptionCollection);

        expect(_.size(rsp)).toBe(2);
        expect(_.pluck(rsp, 'title')).toContain('Shawn on Star Trek');
        expect(_.pluck(rsp, 'title')).toContain('Forcecast');
    });

    // makeSubscription()
    it('returns a subscription with valid fields', function() {

        var subscription = {
            id : 1,
            title : 'MockTitle',
            description : 'Mock description is where the text goes'
        };

        var subscription = SubscriptionService.makeSubscription(subscription);
        // this makes sure a subscription obj was returned
        // by checking the _id prefix against the string.
        expect(subscription.title).toEqual('MockTitle');
        expect(subscription.description).toEqual('Mock description is where the text goes');
    });

    // executeBulkRetrieval()
    it('should return subscription model objects', function() {

        var s1 = {
            id : 1
        };
        var s2 = {
            id : 2
        }; 

        var subscriptions = [s1, s2];

        var rsp = SubscriptionService.executeBulkRetrieval(subscriptions);
        expect(_.size(rsp)).toEqual(2);

    });

    // testing: assembleBulkModels()
    it('should return three subscription model objects', function() {
        var s1 = {id: 1};
        var s2 = {id: 2};
        var s3 = {id: 3};
        
        var sc = [s1, s2, s3];
        
        var subscriptionCollection = SubscriptionService.assembleBulkModels(sc);
        expect(_.size(subscriptionCollection)).toBe(3);
    });

    // removeSubscription()
    it('should completely remove subscription object', function(){

       // Subscription object
       var subscription = {id: 1};
      
       var rsSubscriptions = []; 
       
       rsSubscriptions[1] = {id: 1};
       rsSubscriptions[2] = {id: 2};
       rsSubscriptions[3] = {id: 3};
       
       var sec = [1, 3];
       
       var rsEpisodes = [];
       
       rsEpisodes[1] = {id: 1, subscription_id: 1};
       rsEpisodes[2] = {id: 2, subscription_id: 2};
       rsEpisodes[3] = {id: 3, subscription_id: 1};
              
       // Persist the model to localStorage
       localStorage.setItem('sec1', JSON.stringify(sec));       
       localStorage.setItem('s1', JSON.stringify(subscription));       
       localStorage.setItem('e1', JSON.stringify(rsEpisodes[0]));       
       localStorage.setItem('e2', JSON.stringify(rsEpisodes[1]));       
       localStorage.setItem('e3', JSON.stringify(rsEpisodes[2]));       
     
       var rsp = SubscriptionService.removeSubscription(
                    subscription, rsSubscriptions, rsEpisodes);
                    
       expect(_.size(rsp.subscriptions)).toEqual(2);
       expect(_.size(rsp.episodes)).toEqual(1);
    });
    
    // removeFromMemory()
    it('should remove the subscription from rootScope', function(){
       
       var rsSubscriptions = [];       
       rsSubscriptions[1] = {id: 1};
       rsSubscriptions[2] = {id: 2};
       rsSubscriptions[3] = {id: 3};
       rsSubscriptions[4] = {id: 4};
       rsSubscriptions[5] = {id: 5};
       
       var subscription = {id:1};
       var rsp = SubscriptionService.removeFromMemory(subscription, rsSubscriptions);
       expect(_.size(rsp)).toEqual(4);
    });

    //removeRemote()
    it('should remove subscription from server', function() {
        var model = {
            id : 10
        };
        var success = {success:true};
        var url = 'api/?entity=subscription&action=delete&id=' + model.id;
        httpBackend.expectGET(url).respond(success);
        var returnedPromise = SubscriptionService.removeRemote(model);
        var result;
        returnedPromise.then(function(response) {
            result = response;
        });
        httpBackend.flush();
        expect(result.data.success).toBe(true);
    });

    // updateLocal()
    it('will persist the update to localStorage', function(){
       var subscription = {id: 1, auto_download: 0};
       expect(subscription.auto_download).toEqual(0);
       subscription.auto_download = 1;
       SubscriptionService.updateLocal(subscription);
       expect(subscription.auto_download).toEqual(1);
    });

    //updateDownloadRemote()
    it('will update subscription auto download option', function() {
        var success = {success: true};
        var model = {
            id : 10,
            auto_download : 1
        };
        var url = 'api/?entity=subscription&action=update&val=' + 
            model.auto_download + '&id=' + model.id;
        httpBackend.expectGET(url).respond(success);
        var returnedPromise = SubscriptionService.updateDownloadRemote(model);
        var result;
        returnedPromise.then(function(response) {
            result = response;
        });
        httpBackend.flush();
        expect(result.data.success).toBe(true);
    });

    // testing: persistBulkModels()
    it('should save in localStorage', function() {
        var subscriptions = [];
        subscriptions[1] = {id:1};
        subscriptions[2] = {id:2};
        subscriptions[3] = {id:3};
        subscriptions[4] = {id:4};
        
        SubscriptionService.persistBulkModels(subscriptions);
        
        var s1 = localStorage.getItem('s1');
        var s2 = localStorage.getItem('s2');
        var s3 = localStorage.getItem('s3');
        var s4 = localStorage.getItem('s4');
        
        expect(s1).not.toBeNull();
        expect(s2).not.toBeNull();
        expect(s3).not.toBeNull();
        expect(s4).not.toBeNull();
    });

    // persistCollection()
    it('should save the subscription collection to localStorage', function(){
       var subscriptionCollection = [];
       subscriptionCollection[1] = {id: 1};
       subscriptionCollection[2] = {id: 2};
       subscriptionCollection[3] = {id: 3};
       SubscriptionService.persistCollection(subscriptionCollection);
       var rsp = JSON.parse(localStorage.getItem('SubscriptionCollection'));
       expect(_.size(rsp)).toEqual(3);
    });



});
