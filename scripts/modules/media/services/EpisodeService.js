hcMedia.factory('EpisodeService', ['PersistenceService', 'Episode', '$http', '$rootScope',
function(PersistenceService, Episode, $http, $rootScope) {

    var persistService = persistService || new PersistenceService();

    var lifespan = 30;

    //var soc;

    return {

        expandedDescriptions : [],



        collapseDescription: function(id){
            // remove the id from the array.
            _.reject(this.expandedDescriptions, id);
            // collapse the teaser
            this.adjustTeaserHeight('100px', id);
        },

        adjustTeaserHeight: function(height, id){
            jQuery('.teaser id_' + id).animate({
                'height': height
            });
        },

        // Loads episodes from localStorage
        // test running
        // @param: Array of Episode IDs
        // @return: Object array of Episodes
        load : function(episodeCollection) {
            // Create an object to hold the models
            var episodes = {};
            var self = this;
            // Iterate over each object
            _.each(episodeCollection, function(element, it, list) {
                var model = persistService.loadData('e' + element);
                model = self.makeEpisode(model);          
                episodes[element] = model;
            });
            return episodes;
        },

        isExpanded: function(id){
            console.log(_.contains(this.expandedDescriptions, id ));
            return _.contains(this.expandedDescriptions, id );
        },

        // Create a fresh model.
        // test running
        // @param:  Collection of JSON episode objects,
        //          Collection of Subscription object models
        // @return: A single episode object model.
        makeEpisode : function(episodeJSONObj, subscriptionObjCollection) {
            var episode = new Episode(episodeJSONObj, subscriptionObjCollection);
            return episode;
        }, 

        // Add new episodes to existing episode collection.
        // Test running
        // @params: Array of current episode object models,
        //          array of new episode object models.
        // @return: An updated array of all current episode 
        //          object models. 
        addToMemory : function(currentEpisodes, episodes) {
            _.each(episodes, function(e, i, l) {
                currentEpisodes[i] = e;
            });
            return currentEpisodes;
        },

        // Update a episode field in memory
        updateMemory: function(episode, field, value){
            return episode[field] = value;
        },

        /*
         * Responsible for running bulk functions
         */
        executeBulkRetrieval : function(subscriptionObjCollection, episodesJSON) {

            // Create a collection of Episode Models
            var episodeObjCollection = this.assembleBulkModels(episodesJSON, subscriptionObjCollection);

            // Save each of the episode models
            var rsp = this.persistBulkModels(episodeObjCollection);
            
            // Save the array of episode pubdates.
            this.persistBulkEPDC(rsp.epdc);

            // Save the array of subscription[episodes] collections
            this.persistBulkSEC(subscriptionObjCollection, rsp.sec);
            // Save the episode collection
            this.persistBulkCollection(episodeObjCollection);
            return episodeObjCollection;
        },

        // test running
        // @params: Episode objects in JSON format, Subscription object models
        // @returns: An array of episodes object models.
        assembleBulkModels : function(episodesJSON, subscriptionObjCollection) {
            //console.log(subscriptionObjCollection);
            //console.log(episodesJSON);
            var rsp = {};
            var self = this;
            _.each(episodesJSON, function(episodeJSONObj) {
                var episode = self.makeEpisode(episodeJSONObj, subscriptionObjCollection);
                rsp[episode.id] = episode;
            });
            return rsp;
        },

        // test running
        // @params: Collection of Episode Objects
        // OUT: Collection of Episode ids
        persistBulkModels : function(episodes) {
            var sec = {};
            var epdc = {}; // Episode pubdata collection
            _.each(episodes, function(episode, id, list) {
                var subID = episode.subscription_id;
                var id = episode.id;
                if (!sec[subID]){
                    sec[subID] = [];
                }
                epdc[id] = episode.pub_date;
                sec[subID].push(JSON.stringify(episode.id));
                persistService.save('e' + episode.id, episode);
            });

            var rsp = { sec: sec, epdc: epdc};
            return rsp;
        }, 

        // Iterate over new subscription to save each 
        // subscripiton episode collection in localStorage
        // TESTING
        // @params: Array of subscription models objects,
        //          an array of SEC arrays.
        persistBulkSEC : function(subscriptions, sec) {
            console.log(sec);
            console.log(subscriptions);

            var self = this;
            _.each(subscriptions, function(subscription) {
                self.persistSEC(sec, subscription);
            });
        },
        
        // Save an individual Subscription Episode Collection in localStorage
        // TESTING BY PROXY from persistBulkSEC()
        persistSEC : function(sec, subscription) {
            console.log(subscription);
            console.log(sec);
            persistService.save('sec' + subscription.id, sec[subscription.id]);
        },
        
        // Save the episode pub_date collection to localStorage
        // TESTING
        // @params: Object collection of id/pub_date key/vals.
        persistBulkEPDC : function(epdc) {
            persistService.save('EPISODE_PUB_DATE_COLLECTION', epdc);
        },
        
        addToEPDC: function(epdc, newEpisodesEpdc){
            _.each(newEpisodesEpdc, function(e, i){
               epdc[i] = e;
            });
            
            return epdc;
        },
        
        // Save the bulk collection of episode keys in localStorage
        // TESTING
        // @params: Object of episode object methods for keys
        persistBulkCollection : function(episodes) {
            persistService.save('EpisodeCollection', _.keys(episodes));
        },

        // Send update request to remote server. Save to departure on fail.
        // TESTING
        // @params: working model, the field to be update, the modified value.
        // @return: Asyc promise 
        updateRemote : function(model, field, val) {
            // Update server
            var url = 'api/index.php?entity=episode&action=update' +
                '&field=' + field + '&val=' + val + '&id=' + model.id;
            return $http.get(url).success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                if (!data.success) {
                    var rpt = {
                        entity : 'episode',
                        action : 'update',
                        field : field,
                        val : JSON.stringify(val),
                        id : JSON.stringify(model.id)
                    };
                    departureService.makeTicket(rpt, model);
                };
            }).error(function(data, status, headers, config) {
                //console.log(data);
                //console.log(status);
                //console.log(headers);
                //console.log(config);
            });

        },

        // Persist episode in localStorage after changes
        // TESTING
        // @params: working episode model
        updateLocal : function(episode) {
            persistService.updateModel('e' + episode.id, episode);
        },

        // Iterate through all the episodes by loading each model
        // then check to see if episode is old if so add the id 
        // to the collection and omit then return the new array of ids

        gatherOld : function(ec) {
            var oldEpisodes = {};
            var date = new Date();
            date.setDate(date.getDate() - lifespan);
            var timeAgo = Math.floor(date);
            //timeAgo = 1426723260;

            var epdc = persistService.loadData('EPISODE_PUB_DATE_COLLECTION');
            
            //console.log(epdc);
            var revisedCollection = _.omit(epdc, function(value, key, object){
               return value < timeAgo; 
            });
            var expiredEpisodes = _.pick(epdc, function(value, key, object){
               return value < timeAgo; 
            });
            
            // Save the update EPDC
            persistService.save('EPISODE_PUB_DATE_COLLECTION', revisedCollection);            

            return expiredEpisodes;
        },

        // Test running
        // @param: An array of episode models
        removeFromLocalStorage : function(episodeModels) {
            console.log(episodeModels);
            _.each(episodeModels, function(episode, i, l) {
                console.log(episode);
                localStorage.removeItem('e' + episode);
            });
        },

        removeFromSEC : function(oldEpisodes) {
            var secCollection = {};
            var oldEpisodeIds = [];
            _.each(oldEpisodes, function(oldEpisode, i) {
                oldEpisodeIds.push(oldEpisode.id);
                if (!secCollection[oldEpisode.subscription_id]) {
                    secCollection[oldEpisode.subscription_id] = persistService.loadData('sec' + oldEpisode.subscription_id);
                }
            });
            _.each(secCollection, function(e, a, i) {
                persistService.save('sec' + a, _.difference(e, oldEpisodeIds));
            });
        },

        removeFromEpisodeCollection : function(ec, oldEpisodes) {
            var oldEpisodeIds = [];
            _.each(oldEpisodes, function(oldEpisode, i) {
                oldEpisodeIds.push(i);
            });
            
            persistService.save('EpisodeCollection', _.difference(ec, oldEpisodeIds));
        },

        // Not testing
        removeFromMemory : function(episodes, removalCollection) {
            return _.omit(episodes, removalCollection);
        },

        // Not testing
        removeFromEPDC : function(epdc, removalCollection){
            console.log('edpc');
            console.log(epdc);
            console.log('removalCollection');
            console.log(removalCollection);
            return _.omit(epdc, removalCollection);
        },

        // Copy the episode from remote to local
        copyToServer : function(episode) {
            var url = 'api/index.php?entity=episode&action=copy' + '&id=' + episode.id;
            return $http.get(url).success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                
                if (!data.success) {
                    var rpt = {
                        entity : 'episode',
                        action : 'copy',
                        id : JSON.stringify(episode.id)
                    };
                    departureService.makeTicket(rpt, episode);
                };
            }).error(function(data, status, headers, config) {
            });
        }
    };

}]);
