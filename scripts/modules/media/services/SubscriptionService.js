hcMedia.factory('SubscriptionService', [
    '$http', 'Subscription', 'EpisodeService', 
    'DepartureService', '$rootScope', 'PersistenceService',
    function($http, Subscription, EpisodeService, 
    DepartureService, $rootScope, PersistenceService) {
    var ps = ps || new PersistenceService();
    var departureService = new DepartureService();
    return {

        initializeManager: function(setSubscriptionManager, subscriptions){
            var submgr = this.SubscriptionManager();
            submgr.subscriptions = subscriptions;
            setSubscriptionManager(submgr);
        },

        SubscriptionManager: function(){
          return {
              subscriptions: [],
              addView: 0
          }

        },




        
        // Test running
        // 
        // @params: String src: url or youtube channel ID,
        //          String subscriptionType: audio or video
        // @return: Promise of JSON Data from server. 
        add : function(src, subscriptionType) {
            var url = 'api/index.php?entity=subscription&action=add&src=' + src + '&subscriptionType=' + subscriptionType;

            return $http.get(url).success(function(data, status, headers, config) {
                return data;

            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        },
        
        // This updates all the models and collections
        // in the app with the new data.
        // TESTING
        // @params: Array rsSubscripitons collection of subscription object models,
        //          Array rsEpisodes: collection of episode object models.
        //          Array data: collection of subscription and episode
        //          json formatted object typically from server response.
        // @return: Array rsp: contains two arrays episode object models and 
        //          subscription object models.
        insertNewMedia : function(rsSubscriptions, rsEpisodes, data) {
            var rsp = [];
            var subscriptionCollection = 
                ps.loadData('SubscriptionCollection') || [];
            var subscription = this.makeSubscription(data.subscription);
            
            subscriptionCollection.push(subscription.id);
            ps.save('SubscriptionCollection', subscriptionCollection);
            ps.save('s' + subscription.id, subscription);
            
            // Now add to memory
            rsSubscriptions[subscription.id] = subscription;
            // Episodes
            // Make the model object
            var episodes = EpisodeService.assembleBulkModels(data.episodes, rsSubscriptions);
            // Save each episode in localStorage
            var rsp = EpisodeService.persistBulkModels(episodes);
            
            var epdc = ps.loadData('EPISODE_PUB_DATE_COLLECTION');
                        
            var updatedEpdc = EpisodeService.addToEPDC(epdc, rsp.epdc);
            
            // Persist the updated epdc to localStorage
            ps.save('EPISODE_PUB_DATE_COLLECTION', updatedEpdc);
            
            // Save the subscription episode collection in localStorage
            EpisodeService.persistSEC(rsp.sec, subscription, subscription.id);
            // Add to memory
            rsp['episodes'] = EpisodeService.addToMemory(rsEpisodes, episodes);
            rsp['subscriptions'] = rsSubscriptions;
            // Wrap things up by saving the episodeCollection
            EpisodeService.persistBulkCollection(rsp['episodes']);
            return rsp;
        },

        // Test running
        // Loads subscriptions from localStorage
        // @params: Array subscriptionCollection: collection of all subscription ids.
        // @return: Array subscription: collection of subscription object models.
        load : function(subscriptionCollection) {
            var subscriptions = {};
            var self = this;
            // Iterate over the collection object
            _.each(subscriptionCollection, function(element) {
                var model = ps.loadData('s' + element);
                model = self.makeSubscription(model);
                subscriptions[element] = model;
            });
            return subscriptions;
        },

        // Test running
        // Create a fresh model object.
        // @param: JSON Object: a single json object
        // @return: Subscription Model Object
        makeSubscription : function(data) {
            var subscription = new Subscription(data);
            var self = this;
            subscription.updateAutoDownload = function(model) {
                self.updateLocal(model);
                self.updateDownloadRemote(model);
            };
            subscription.remove = function(model, rsSubscriptions, rsEpisodes) {
                return self.removeSubscription(model, rsSubscriptions, rsEpisodes);
            };
            return subscription;
        },

        // Test running
        // Create a fresh model object.
        // @params: Array subscriptions: a collection of json objects
        // @return: Array subscriptionObjCollection: a collection 
        //          of Subscription object models
        executeBulkRetrieval : function(subscriptions) {
            // Build the models
            var subscriptionObjCollection = this.assembleBulkModels(subscriptions);
            // Save each of the new models
            this.persistBulkModels(subscriptionObjCollection);
            // Save the subscription collection
            this.persistCollection(subscriptionObjCollection);
            // Send back the subscriptions
            return subscriptionObjCollection;
        },

        // Test running
        // Create subscription object model for each of the items
        // in the collection.
        // @params: Collection of JSON objects
        // @return: Array rsp: A collection of subscription model objects.
        assembleBulkModels : function(subscriptionCollection) {
            var rsp = {};
            var self = this;
            _.each(subscriptionCollection, function(subscription) {
                var subscription = self.makeSubscription(subscription);
                rsp[subscription.id] = subscription;
            });
            return rsp;
        },

        // A chain of commands to remove the subscription
        // from memory, localStorage and remote.
        // Testing
        // @params: Subscription model object,
        //          Array rsSubscriptions: all current subscription object models,
        //          Array rsEpisodes: all current episode object models.
        removeSubscription : function(subscription, rsSubscriptions, rsEpisodes) {
            var rsp = [];
            var subscriptions = this.removeFromMemory(subscription, rsSubscriptions);
            // Persist the updated collection to localStorage
            this.persistCollection(subscriptions);
            // Remove the model form localStorage
            localStorage.removeItem('s' + subscription.id);
            // Remove related episodes
            //sec = this.removeSubscriptionEpisodes(subscription, rsEpisodes);
            sec = ps.loadData('sec' + subscription.id);
            EpisodeService.removeFromLocalStorage(sec);
            episodes = EpisodeService.removeFromMemory(rsEpisodes, sec);
            // Remove the subscription episode collection from localStorage
            localStorage.removeItem('sec' + subscription.id);
            // Save the new episode collection
            EpisodeService.persistBulkCollection(episodes);
            // Remove episodes from Episode Date Collection
            var epdc = ps.loadData('EPISODE_PUB_DATE_COLLECTION');
            var revisedCollection = EpisodeService.removeFromEPDC(epdc, sec);
            ps.save('EPISODE_PUB_DATE_COLLECTION', revisedCollection);
            rsp['episodes'] = episodes;
            rsp['subscriptions'] = subscriptions;
            return rsp;
        },

        // Remove the subscription object from rootScope
        // TESTING
        // @params: Subscription subscription object model, 
        //          Array rsSubscriptions: current subscriptions.
        removeFromMemory : function(subscription, rsSubscriptions) {
            return _.omit(rsSubscriptions, subscription.id);
        },

        // Send a request to remove the subscription from remote storage
        // TESTING
        // @params: Subscription subscription object model.
        // @return: Promise indicating success or failure.
        removeRemote : function(subscription) {
            var url = 'api/index.php?entity=subscription&action=delete&id=' + subscription.id;
            return $http.get(url).success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                if (!data.success) {
                    var rpt = {
                        entity : 'subscription',
                        action : 'delete',
                        id : subscription.id
                    };

                    departureService.makeTicket(rpt, subscription);
                epdc};
            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        },

        // Persist model modifications to localStorage
        // TESTING
        // @params: Subscription object model.
        updateLocal : function(subscription) {
            ps.updateModel('s' + subscription.id, subscription);
        },

        // Persist the subscription model modification to remote storage.
        // TESTING
        // @params: Subscription object model.
        // @return: Promise indicating success/failure
        updateDownloadRemote : function(subscription) {
            var url = 'api/index.php?entity=subscription&action=update&val=' +
                subscription.auto_download + '&id=' + subscription.id;
            return $http.get(url).success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                if (!data.success) {
                    var rpt = {
                        entity : 'subscription',
                        action : 'update',
                        target : 'download',
                        val : subscription.auto_download,
                        id : subscription.id
                    };

                    departureService.makeTicket(rpt, subscription);
                };
            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        },

        // Iterate through the collection of subscription objects
        // persisting each to local storage.
        // @params: Array of subscription model objects.
        persistBulkModels : function(subscriptions) {
            _.each(subscriptions, function(subscription, index, list) {
                ps.save('s' + index, subscription);
            });
        },

        // Persist the subscription collection to localStorage.
        // @params: Array of subscrition objects.
        persistCollection : function(collection) {
            ps.save('SubscriptionCollection', _.keys(collection));
        }
    };
}]);

