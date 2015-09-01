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


        //SubscriptionService.initializeManager(setSubscriptionManager, $rootScope.subscriptions);

    
    
}]);   