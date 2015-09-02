hcApp.controller('AppController', [
    '$rootScope', '$scope', '$interval', 'PersistenceService', '_', 'SubscriptionService', 'EpisodeService',
    'DepartureService', 'OverlayService',
 	function($rootScope, $scope, $interval, PersistenceService, _, SubscriptionService, EpisodeService,
             DepartureService, OverlayService){

		// Run housekeeping
        departureService = new DepartureService();
        departureService.initialize();		
                
        var ps = new PersistenceService();
        var sc = ps.loadData('SubscriptionCollection')|| {}; 
        var ec = ps.loadData('EpisodeCollection')|| {};
        
        // Collect episodes
        var oldEpisodes = EpisodeService.gatherOld(ec);

        if(oldEpisodes){

            // Remove episode ID from episodeCollection
            EpisodeService.removeFromEpisodeCollection(ec, oldEpisodes); 
            // Reload the collection
            ec = ps.loadData('EpisodeCollection');
            // Remove each episode
            EpisodeService.removeFromLocalStorage(oldEpisodes);
            // Remove episode ID from sec
            EpisodeService.removeFromSEC(oldEpisodes); // working
        }

        
        
		// Use Services to load all subscriptions & Episodes
		// from localStorage to application memory.
		$rootScope.subscriptions = SubscriptionService.load(sc);
		$rootScope.episodes = EpisodeService.load(ec);

        $rootScope.OverlayManager = {};
        $rootScope.toggleOverlay = function(){
            OverlayService.toggleOverlay(updateOverlayManager)
        };

        updateOverlayManager = function(om){
            $rootScope.OverlayManager = om
        };

	}]);
