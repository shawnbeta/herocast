hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $timeout, $interval, PlayerService,
        EpisodeService){
        $rootScope.audioElement = document.getElementsByTagName("audio")[0];
        $rootScope.videoElement = document.getElementsByTagName("video")[0];
        //$rootScope.currentFile = $rootScope.currentFile || '';
        //$rootScope.nowPlaying = $rootScope.nowPlaying || '';
        //$rootScope.playerStatus = $rootScope.playerStatus || 'off';
        //$rootScope.playPauseToggle = $rootScope.playPauseToggle || 'play';
        //var currentFile;
        //var nowPlaying;
        //var playerStatus;
        //var playPauseToggle;

        $rootScope.nowPlaying = {};
        $rootScope.currentPlayer = {
            element: '',
            type: '',
            status: 0,
            file: null,
            toggle: false,
            showDetails: false
        };

        var currentPlayer = $rootScope.currentPlayer;


        $scope.nowPlayingDetails = false;
        
        // Hide or show the details of Now Playing.
        // Test running
        $scope.toggleNowPlayingDetails = function(){
            $rootScope.currentPlayer.showDetails = !$rootScope.currentPlayer.showDetails;
        };
          
        // Update the bookmark time for the target episode.
        // @params: Single Episode object model. 
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
          var currentTime = $rootScope.currentPlayer.currentTime;
          PlayerService.updateBookmark(episode, currentTime);
        };
        
        // Toggle the player
        // @params: Single Episode object model.
        // @return: off: load the episode and start from bookmark
        //          playing: pause playback
        //          resume playback from currentTime.    
        $rootScope.playPause = function(episode){
            if($rootScope.currentPlayer.status == 0)
                return initializeAction(episode);
            if($rootScope.currentPlayer.status == 1)
                return pauseAction();
            return resumeAction(episode);
        };
        
        //$rootScope.counter = $rootScope.counter || 0;

        $rootScope.counter = 0;
        
        initializeAction = function(episode){
            $rootScope.currentPlayer.file = $sce.trustAsResourceUrl(episode.src);
            $rootScope.nowPlaying = PlayerService.setNowPlaying(episode);
            var playerStyle = getPlayerStyle(episode);
            console.log(jQuery(playerStyle));

            $rootScope.currentPlayer.type = playerStyle;
            $rootScope.currentPlayer.element = jQuery(playerStyle)[0];



            console.log('element');
            console.log($rootScope.currentPlayer);

            // Run the time out only on the initial
            // file load so js has time to read it.
            $timeout(function(){
                // Start the player from the models
                // bookmarked time defaults to 0 of course.
                var data = {
                    time: $rootScope.currentPlayer.currentTime,
                    bookmark: $rootScope.nowPlaying.bookmark
                };
                $rootScope.currentPlayer.element.play();
                $rootScope.currentPlayer.element.currentTime = PlayerService.setResume(data);
                return $rootScope.playAction();
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
        
        $rootScope.resumeAction = function(model){
            $rootScope.currentPlayer.element.play();
            return $rootScope.playAction();
        };
        
        $rootScope.playAction = function(){
            $rootScope.currentPlayer.status = 'playing';
            $rootScope.currentPlayer.toggle = 'pause';
            return PlayerService.startCounter();
        };
        
        $rootScope.isPlaying = function(model){
            if(model.id == $rootScope.nowPlaying.id &&
                $rootScope.currentPlayer.status == 'playing')
                    return 'pause';
            return 'play';
        };
        
        $rootScope.pauseAction = function(){
            PlayerService.stopCounter();
            $rootScope.currentPlayer.element.pause();
            $rootScope.playerStatus = 'paused';
            $rootScope.playPauseToggle = 'play';
        };        
        
        $rootScope.jumpBack = function(){
            var currentTime = parseInt($rootScope.$rootScope.currentPlayer.currentTime);
            $rootScope.currentPlayer.element.currentTime = currentTime - 300;
        };   
        
        $rootScope.rewind = function(){
            var currentTime = parseInt($rootScope.currentPlayer.element.currentTime);
            $rootScope.currentPlayer.element.currentTime = currentTime - 20;
        };               
        
        $rootScope.forward = function(){
            var currentTime = parseInt($rootScope.currentPlayer.element.currentTime);
            $rootScope.currentPlayer.element.currentTime = currentTime + 20;
        };  
                
        $rootScope.jumpAhead = function(){
            var currentTime = parseInt($rootScope.currentPlayer.element.currentTime);
            $rootScope.currentPlayer.element.currentTime = currentTime + 300;
        };            
        
        $scope.volumeDown = function(){
            console.log('volume down');
            $rootScope.currentPlayer.element.volume-=0.1;
        };
        
        $scope.volumeUp = function(){
            console.log('volume up');
            $rootScope.currentPlayer.element.volume+=0.1;
        };     
        
        $scope.setVolumeTo = function(val){
            $rootScope.currentPlayer.element.volume=val;
        };
                   
    }]);


