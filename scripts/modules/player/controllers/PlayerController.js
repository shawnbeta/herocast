hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$routeParams', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $routeParams, $timeout, $interval, PlayerService,
        EpisodeService){

        var element = {
            player: document.getElementsByTagName('audio')[0],
            wrapper: jQuery('#audioPlayer')
        };

        $rootScope.player = $rootScope.player ||
            PlayerService.initializePlayer(element, 'audio');

        var player = $rootScope.player;

        console.log($rootScope.episodes);

        // Update the bookmark time for the target episode.
        // @params: Single Episode object model.
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
            var currentTime = $rootScope.player.element.currentTime;
            PlayerService.updateBookmark(episode, currentTime);
        };

        // Toggle the player
        // @params: Single Episode object model.
        // @return: off: load the episode and start from bookmark
        //          playing: pause playback
        //          resume playback from currentTime.
        $rootScope.engageAudio = function(episode){
            var rsp = PlayerService.engageAudio(episode, $rootScope.player);
            if(rsp!= 1){
                // there is another episode already playing so that needs
                // to be bookmarked in memory
                console.log($rootScope.episodes[rsp.previousEpisode].bookmark);
                $rootScope.episodes[rsp.previousEpisode].bookmark = rsp.currentTime
                console.log($rootScope.episodes[rsp.previousEpisode].bookmark);
                PlayerService.loadPlayer(episode, $rootScope.player);
            }

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


