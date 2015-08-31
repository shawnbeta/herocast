hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$routeParams', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $routeParams, $timeout, $interval, PlayerService,
        EpisodeService){

        var data = {
            player: document.getElementsByTagName('audio')[0],
            wrapper: jQuery('#audioPlayer'),
            viewToggle: jQuery('#toggleAudio')
        };

        $rootScope.player = $rootScope.player || PlayerService.initializePlayer(data, 'audio');
        var player = $rootScope.player;

        // Update the bookmark time for the target episode.
        // @params: Single Episode object model.
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
            var currentTime = $rootScope.player.element.currentTime;
            var rsp = PlayerService.updateBookmark(episode, currentTime);
        };

        // Toggle the player
        // @params: Single Episode object.
        // @return: off: load the episode and start from bookmark
        //          playing: pause playback
        //          resume playback from currentTime.
        $rootScope.engageAudio = function(episode){
            PlayerService.engageAudio(episode);
        };



        $rootScope.toggleVisible = function(){
            PlayerService.toggleVisible(player);
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



                   
    }]);


