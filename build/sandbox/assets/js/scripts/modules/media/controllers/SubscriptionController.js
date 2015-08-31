hcMedia.controller('SubscriptionController', [
    '$scope', '$rootScope', 'PersistenceService', 
    'SubscriptionService', 'EpisodeService', 'SearchService',
	function($scope, $rootScope, PersistenceService, 
	    SubscriptionService, EpisodeService, SearchService){
	    
	    var persistenceService = new PersistenceService();
	
	$scope.activeSubscription = 0;
	    
	// Make a copy of the subscriptions to work with.
	//$rootScope.subscriptionList, $rootScope.subscriptionNav
	   //= angular.copy($rootScope.subscriptions);	
    $scope.subscriptionType = 'audio';
    $scope.add = function(){
        var rsp = SubscriptionService.add($scope.src, $scope.subscriptionType);
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

    
    
}]);   