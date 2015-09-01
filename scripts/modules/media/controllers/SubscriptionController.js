hcMedia.controller('SubscriptionController', [
    '$scope', '$rootScope', '$routeParams', 'PersistenceService',
    'SubscriptionService', 'EpisodeService', 'SearchService',
	function($scope, $rootScope, $routeParams, PersistenceService,
	    SubscriptionService, EpisodeService, SearchService){

        $rootScope.submgr = $rootScope.submgr || {};

        $scope.toggleAddView = function(val){
            $scope.activeAddView = val;
        }
	    
	// Make a copy of the subscriptions to work with.
	//$rootScope.subscriptionList, $rootScope.subscriptionNav
	   //= angular.copy($rootScope.subscriptions);	
    $scope.addForm = {
        src: '',
        type: 'audio'
    };
    $scope.add = function(){
        var rsp = SubscriptionService.add($scope.addForm.src, $scope.addForm.type);
        rsp.then(function(rsp){
            
            SubscriptionService.insertNewMedia(
                $rootScope.subscriptions, $rootScope.episodes, rsp.data);
        });
    };

        $scope.toggleSubscriptionMenu = function(){
            var navBar = jQuery('.subscriptionNavbar');
            var position = jQuery(navBar).css(left) < 0 ? 0 : '-9999px';
            jQuery(navBar).animate({
                left: position
            });
        }

        $scope.episodeStyle = 'list';

        $scope.setSubscriptionStyle = function(val) {
            $scope.episodeStyle = val;
        };


        $scope.executeSearch = function(){
            var rsp = SearchService.executeSearch($scope);
            rsp.then(function(rsp){
                if(rsp.data.all)
                    return $rootScope.searchResponse = rsp.data.all;
            });
        };

        $scope.getDetails = function(searchResult){
            $rootScope.actionToggle = 'details';
            var rsp = SearchService.requestDetails(searchResult);
            if(!rsp) return;
            rsp.then(function(rsp){
                searchResult = SearchService.getDetails(rsp, searchResult);
                $rootScope.searchDetails = searchResult;
            });
        };

        function setSubscriptionManager(subscriptionManager){
            //$rootScope.subscriptions = subscriptionManager.subscriptions;
            $rootScope.submgr = subscriptionManager;
        }


        $scope.setAutoDownload = function(model){
            model.auto_download = model.auto_download !=1 ? 1  : 0;
            model.updateAutoDownload(model);
        };

        $scope.downloadToggle = function(model){
            return model.auto_download !=1 ? 'AutoDownload'  : 'Stop AutoDownload';
        };

        /*scope.doRemove = function(model){
         var secondScope = {
         episodes: angular.copy($rootScope.episodes),
         subscriptions: angular.copy($rootScope.subscriptions)
         };
         var rsp = model.remove(model, secondScope);
         $rootScope.episodes = rsp.episodes;
         $rootScope.subscriptions = rsp.subscriptions;
         };*/

        $scope.doRemove = function(model){
            var rsp = model.remove(model, $rootScope.subscriptions, $rootScope.episodes);
            $rootScope.episodes = rsp.episodes;
            $rootScope.subscriptions = rsp.subscriptions;
        };

        //SubscriptionService.initializeManager(setSubscriptionManager, $rootScope.subscriptions);

    
    
}]);   