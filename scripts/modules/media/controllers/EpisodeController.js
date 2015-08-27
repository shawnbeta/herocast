hcMedia.controller('EpisodeController', [
	'$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	$rootScope.viewTitle = "Episodes";
	// Make a copy of the episodes to work with.
    $scope.episodeDetailer = '';
    $rootScope.actionPane = 'episodes';
    $rootScope.viewActions  = '<action-bar></action-bar>';
}]);