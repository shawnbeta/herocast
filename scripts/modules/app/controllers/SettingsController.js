hcApp.controller('SettingsController', [
	'$scope', '$rootScope', 'SubscriptionService', 
	'EpisodeService', 'HelperService', 'MediaService',
	function($scope, $rootScope, SubscriptionService, 
		EpisodeService, HelperService, MediaService){

	$scope.flushLocalStorage = function(){
	    localStorage.clear();
	    location.reload();
	};
	
	$scope.fetchBulk = function(){
		localStorage.clear();
		var h = new HelperService();
		// Get the json response
		var f = MediaService.fetchAll();
		
		// returns subscription collection
	    f.then(function(rsp) {

	       var subscriptionObjCollection = 
	           SubscriptionService.executeBulkRetrieval(rsp.data.subscriptions);
	           $rootScope.subscriptions = subscriptionObjCollection;
			$rootScope.episodes =
			 EpisodeService.executeBulkRetrieval(
			     subscriptionObjCollection, rsp.data.episodes);
	    });

	};
		$rootScope.currentPage = 'settings';



		$scope.purgeRemote = function(){
	    MediaService.purge();
	};
	
	$scope.fetchNew = function(){
	    var lu = localStorage.getItem('last_update') || 0;
	    var newLu = new Date();
	    localStorage.setItem('last_update', Math.floor(newLu));
        MediaService.fetchNew(lu); 
	};
	
}]); 