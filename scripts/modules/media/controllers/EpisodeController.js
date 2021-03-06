hcMedia.controller('EpisodeController', [
	'$scope', '$rootScope', '$sce', '$filter', 'EpisodeService', 'OverlayService',
	function($scope, $rootScope, $sce, $filter, EpisodeService, OverlayService){
		$scope.toggleDetails = function(model){
			if($scope.showDetails && $scope.episodeDetailer == model)
				return hideDescription();
			$scope.setDetailer(model);
		};

		$scope.EpisodeManager = {
			active:{
				menu: 0
			},
			expanded: []
		};

		$scope.episodeStyle = 'list';

		$scope.setEpisodeStyle = function(val) {
			$scope.episodeStyle = val;
		};

		hideDescription = function(){
			$scope.episodeDetailer = {};
			$scope.showDetails = false;
		};

		$scope.toggleOverlay = function(episode){
			OverlayService.toggleOverlay(updateOverlayManager, episode)
		};

		updateOverlayManager = function(om){
			$rootScope.OverlayManager = om
		};


		$scope.toggleSubscriptionMenu = function(){
			var navBar = jQuery('.subscriptionNavbar');
			console.log(jQuery(navBar).css('right'));
			var position = jQuery(navBar).css('right') == '0px' ? '-320px' : 0;
			console.log(position)
			jQuery(navBar).animate({
				'right': position
			});
			console.log(position)

		};

		$rootScope.currentPage = 'episodes';


		$scope.episodesBySubscription = function(subscription){
			$scope.EpisodeManager.active.menu = subscription.id;
			// Make a copy of the original
			if(!$rootScope.episodeClone)
				$rootScope.episodeClone = $rootScope.episodes;
			var episodeClones = angular.copy($rootScope.episodeClone);
			$rootScope.episodes =
				$filter('filterBySubscription')(episodeClones, subscription.id);
		};

		$scope.allEpisodes = function(){
			$scope.activeSubscription = 0;
			$rootScope.episodes =  $rootScope.episodeClone;
		};

		$scope.updateWatched = function(model){
			model.watched = model.watched == 0 ? 1 : 0;
			EpisodeService.updateLocal(model);
			EpisodeService.updateRemote(model, 'watched', model.watched);
		};


		$scope.setDetailer = function(model){
			$scope.episodeDetailer = model;
			$scope.showDetails = true;
		};

		$scope.isWatched = function(model){
			return model.watched == 0 ? 'redText'  : 'greenText';
		};
	}]);