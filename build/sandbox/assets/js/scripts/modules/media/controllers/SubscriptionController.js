hcMedia.controller('SubscriptionController', [
    '$scope', '$rootScope', 'PersistenceService', 
    'SubscriptionService', 'EpisodeService',
	function($scope, $rootScope, PersistenceService, 
	    SubscriptionService, EpisodeService){
	    
	    var persistenceService = new PersistenceService();
	
	$scope.activeSubscription = 0;
	    
	$rootScope.viewTitle = 'Subscriptions';
	// Make a copy of the subscriptions to work with.
	//$rootScope.subscriptionList, $rootScope.subscriptionNav
	   //= angular.copy($rootScope.subscriptions);	
    $rootScope.actionPane = 'subscriptions';
    $scope.add = function(){
        var rsp = SubscriptionService.add($scope.src, $scope.subscriptionType);
        
        rsp.then(function(rsp){
            
            SubscriptionService.insertNewMedia(
                $rootScope.subscriptions, $rootScope.episodes, rsp.data);
        });
    };	   
    
    
}]);   