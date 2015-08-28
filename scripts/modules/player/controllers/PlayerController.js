hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $timeout, $interval, PlayerService,
        EpisodeService){
        $rootScope.audioElement = document.getElementsByTagName("audio")[0];
        $rootScope.videoElement = document.getElementsByTagName("video")[0];

        $rootScope.nowPlaying = {};
        $rootScope.currentPlayer = {
            element: '',
            type: '',
            status: 0, // 0: off, 1: playing, 2: paused
            file: null,
            toggle: false,
            showDetails: false
        };

        var currentPlayer = $rootScope.currentPlayer;
        var nowPlaying = $rootScope.nowPlaying;



        $scope.nowPlayingDetails = false;
        
        // Hide or show the details of Now Playing.
        // Test running
        $scope.toggleNowPlayingDetails = function(){
            currentPlayer.showDetails = !currentPlayer.showDetails;
        };
          
        // Update the bookmark time for the target episode.
        // @params: Single Episode object model. 
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
          var currentTime = currentPlayer.currentTime;
          PlayerService.updateBookmark(episode, currentTime);
        };
        
        // Toggle the player
        // @params: Single Episode object model.
        // @return: off: load the episode and start from bookmark
        //          playing: pause playback
        //          resume playback from currentTime.    
        $rootScope.playPause = function(episode){
            if(currentPlayer.status == 0)
                return initializeAction(episode);
            if(currentPlayer.status == 1)
                return pauseAction();
            return resumeAction(episode);
        };
        
        //$rootScope.counter = $rootScope.counter || 0;

        $rootScope.counter = 0;
        
        initializeAction = function(episode){
            currentPlayer.file = $sce.trustAsResourceUrl(episode.src);
            nowPlaying = PlayerService.setNowPlaying(episode);
            var playerStyle = getPlayerStyle(episode);
            currentPlayer.type = playerStyle;
            currentPlayer.element = jQuery(playerStyle)[0];

            // Run the time out only on the initial
            // file load so js has time to read it.
            $timeout(function(){
                // Start the player from the models
                // bookmarked time defaults to 0 of course.
                currentPlayer.element.play();
                currentPlayer.element.currentTime = parseFloat(nowPlaying.bookmark);
                return playAction();
            }, 300);
        };

        getPlayerStyle = function(episode){
            // Set the player type
            if(PlayerService.isAudio(episode.src)){
                return 'audio';
            }
            if(PlayerService.isVideo(episode.src)){
                return 'video';
            }
            else{
                return alert('Cannot play this file type.');
            }
        };
        
        resumeAction = function(){
            currentPlayer.element.play();
            return playAction();
        };

        playAction = function(){
            currentPlayer.status = 1;
            currentPlayer.toggle = 'pause';
            return PlayerService.startCounter();
        };
        
        $rootScope.isPlaying = function(model){
            if(model.id == $rootScope.nowPlaying.id &&
                currentPlayer.status == 1)
                    return 0;
            return 1;
        };
        
        pauseAction = function(){
            PlayerService.stopCounter();
            currentPlayer.element.pause();
            currentPlayer.status = 2;
            currentPlayer.toggle = 'playing';
        };        
        
        $rootScope.jumpBack = function(){
            var currentTime = parseInt(currentPlayer.currentTime);
            currentPlayer.element.currentTime = currentTime - 300;
        };   
        
        $rootScope.rewind = function(){
            var currentTime = parseInt(currentPlayer.element.currentTime);
            currentPlayer.element.currentTime = currentTime - 20;
        };               
        
        $rootScope.forward = function(){
            var currentTime = parseInt(currentPlayer.element.currentTime);
            currentPlayer.element.currentTime = currentTime + 20;
        };  
                
        $rootScope.jumpAhead = function(){
            var currentTime = parseInt(currentPlayer.element.currentTime);
            currentPlayer.element.currentTime = currentTime + 300;
        };            
        
        $scope.volumeDown = function(){
            console.log('volume down');
            currentPlayer.element.volume-=0.1;
        };
        
        $scope.volumeUp = function(){
            console.log('volume up');
            currentPlayer.element.volume+=0.1;
        };     
        
        $scope.setVolumeTo = function(val){
            currentPlayer.element.volume=val;
        };
                   
    }]);


