hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$routeParams', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $routeParams, $timeout, $interval, PlayerService,
        EpisodeService){

        //var data = {
        //    element: ,
        //    //element: angular.element( document.querySelector('audio')[0]),
        //    wrapper: jQuery('#audioPlayer'),
        //    viewToggle: jQuery('#toggleAudio')
        //};
        $rootScope.toggleStyle = 'fa-angle-double-down';
        $rootScope.buttonStyle = '';

        //$rootScope.playerObj = $rootScope.playerObj || PlayerService.initialize(data, 'audio');
        //var playerObj = $rootScope.playerObj;

        // Update the bookmark time for the target episode.
        // @params: Single Episode object model.
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
            var currentTime = $rootScope.playerObj.element.currentTime;
            var rsp = PlayerService.updateBookmark(episode, currentTime);
        };

        // Play or Pause audio playback.
        // @params: Single episode object.
        $rootScope.togglePlayback = function(episode){
            // send the episode and player
            PlayerService.togglePlayback(episode, updateActiveBookmark);

        };

        updateToggleStyle = function(toggleStyle, playerObj){
            // Add the player object to the scope.
            $rootScope.playerObj = playerObj;
            playerObj.toggleStyle = toggleStyle;
            $rootScope.toggleStyle = toggleStyle;
        };

        updateButtonStyle = function(buttonStyle, playerObj){
            // Add the player object to the scope.
            $rootScope.playerObj = playerObj;
            playerObj.buttonStyle = buttonStyle;
            $rootScope.buttonStyle = buttonStyle;
        };

        updateActiveBookmark = function(episode, playerObj){
            //console.log('episodes');
            //console.log($rootScope.episodes);
            //console.log(playerObj.activeEpisode.id);
            $rootScope.episodes[playerObj.activeEpisode.id].bookmark = playerObj.element.currentTime;
        };

        $rootScope.toggleVisible = function(){
            PlayerService.toggleVisible();
        };

        $rootScope.isPlaying = function(model){
            return PlayerService.isPlaying(model);
        };

        $rootScope.jumpBack = function(){
            PlayerService.jumpBack();
        };

        $rootScope.rewind = function(){
            PlayerService.rewind();
        };

        $rootScope.forward = function(){
            PlayerService.forward();
        };

        $rootScope.jumpAhead = function(){
            PlayerService.jumpAhead();
        };

        $scope.volumeDown = function(){
            PlayerService.volumeDown();
        };

        $scope.volumeUp = function(){
            PlayerService.volumeUp();
        };

        $scope.setVolumeTo = function(val){
            PlayerService.setVolumeTo(val);
        };

        $rootScope.playerObj = $rootScope.playerObj || PlayerService.initialize(updateToggleStyle, updateButtonStyle);


                   
    }]);


