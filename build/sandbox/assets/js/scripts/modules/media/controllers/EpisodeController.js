hcMedia.controller('EpisodeController', [
	'$scope', '$rootScope', '$sce', 'EpisodeService',
	function($scope, $rootScope, $sce, EpisodeService){
	$rootScope.viewTitle = "Episodes";
		$scope.toggleDetails = function(model){
			if($scope.showDetails && $scope.episodeDetailer == model)
				return hideDescription();
			$scope.setDetailer(model);
		};

		hideDescription = function(){
			$scope.episodeDetailer = {};
			$scope.showDetails = false;
		};
		$rootScope.viewTitle = 'Episodes';

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
			return model.watched == 0 ? 'mark watched'  : 'mark unwatched';
		};
	}]);