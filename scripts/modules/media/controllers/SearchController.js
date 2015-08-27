hcMedia.controller('SearchController', [
    '$scope', '$rootScope', 'SearchService',
    'SubscriptionService', 'EpisodeService',
	function($scope, $rootScope, SearchService,
	    SubscriptionService, EpisodeService){
    $rootScope.actionPane = 'search';
    $scope.rqst = {};
	$rootScope.viewTitle = 'Search';
	$rootScope.searchResponse = 112;  
	$rootScope.searchDetails = {}; 
    $scope.executeSearch = function(){
        var rsp = SearchService.executeSearch($scope);
        rsp.then(function(rsp){
            if(rsp.data.all)
                return $rootScope.searchResponse = rsp.data.all;
        });
    };
        $scope.subscriptionType = 'audio';
        $scope.options = [ 'audio', 'video'];
        
        $rootScope.actionToggle = false;
        
        $scope.subscribe = function(searchResult){            
           $rootScope.actionToggle = 'subscribe';
           $rootScope.searchAddSRC = searchResult.src;
           $rootScope.addNewTitle = searchResult.title;
        };
        
        $scope.addSubscription = function(){
            var rsp = SubscriptionService.add($scope.searchAddSRC, $scope.subscriptionType);
            rsp.then(function(rsp){
            var result = SubscriptionService.insertNewMedia(
                    $rootScope.subscriptions, $rootScope.episodes, rsp.data);
            $rootScope.subscriptions = result.subscriptions;                        
            $rootScope.episodes = result.episodes;                        
            });            
        };
   

    $scope.getDetails = function(searchResult){
        $rootScope.actionToggle = 'details';
        var rsp = SearchService.requestDetails(searchResult);
        if(!rsp)
            return;
        rsp.then(function(rsp){
            searchResult = SearchService.getDetails(rsp, searchResult);
            $rootScope.searchDetails = searchResult;
        });
    };
    
    
}]);   