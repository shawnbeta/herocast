hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$routeParams', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $routeParams, $timeout, $interval, PlayerService,
        EpisodeService){

        $rootScope.player = $rootScope.player ||
            PlayerService.defaultPlayer(document.getElementsByTagName('audio')[0], 'audio');
        var player = $rootScope.player;

        $rootScope.showAudio = false;


        // Hide or show the details of Now Playing.
        // Test running
        $scope.toggleNowPlayingDetails = function(){
            player.showDetails = !player.showDetails;
        };

        // Update the bookmark time for the target episode.
        // @params: Single Episode object model.
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
            var currentTime = player.element.currentTime;
            PlayerService.updateBookmark(episode, currentTime);
        };

        // Toggle the player
        // @params: Single Episode object model.
        // @return: off: load the episode and start from bookmark
        //          playing: pause playback
        //          resume playback from currentTime.
        $rootScope.engageAudio = function(episode){
            if(player.status == 0)
                return loadPlayer(episode);
            if(player.status == 1)
                return pauseAction();
            return PlayerService.playAction(player);
        };

        $rootScope.counter =  0;

        loadPlayer = function(episode){
            $rootScope.showLoading = true;
            player.file = $sce.trustAsResourceUrl(episode.src);
            player.activeEpisode = episode;
            //
            // Continue the p
            player.element.oncanplay = function(){
                $rootScope.showAudio = true;
                $rootScope.showLoading = false;
                // Start playback
                PlayerService.playAction(player);
                // Move the pointer to bookmark. Defaults to 0.
                player.element.currentTime = parseFloat(episode.bookmark);
            }

        };


        $rootScope.isPlaying = function(model){
            if(model.id == player.activeEpisode.id && player.status == 1)
                return 'pause';
            return 'play';
        };

        pauseAction = function(){
            PlayerService.stopCounter();
            player.element.pause();
            player.status = 3;
            player.toggle = 'play';
        };

        $rootScope.jumpBack = function(){
            alert('working')
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime - 300;
        };

        $rootScope.rewind = function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime - 20;
        };

        $rootScope.forward = function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime + 20;
        };

        $rootScope.jumpAhead = function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime + 300;
        };

        $scope.volumeDown = function(){
            player.element.volume-=0.1;
        };

        $scope.volumeUp = function(){
            player.element.volume+=0.1;
        };

        $scope.setVolumeTo = function(val){
            player.element.volume=val;
        };


                   
    }]);


