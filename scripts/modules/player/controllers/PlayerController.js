hcApp.controller('PlayerController', [
    '$rootScope', '$scope', '$sce', '$timeout', '$interval', 'PlayerService',
    'EpisodeService',
    function($rootScope, $scope, $sce, $timeout, $interval, PlayerService,
        EpisodeService){
        $rootScope.audioElement = document.getElementsByTagName("audio")[0];
        $rootScope.currentFile = $rootScope.currentFile || '';
        $rootScope.nowPlaying = $rootScope.nowPlaying || '';
        $rootScope.playerStatus = $rootScope.playerStatus || 'off';
        $rootScope.playPauseToggle = $rootScope.playPauseToggle || 'play';
          
        $scope.nowPlayingDetails = false;
        
        // Hide or show the details of Now Playing.
        // Test running
        $scope.toggleNowPlayingDetails = function(){
            $scope.nowPlayingDetails = !$scope.nowPlayingDetails;
        };
          
        // Update the bookmark time for the target episode.
        // @params: Single Episode object model. 
        // Testing by Proxy in PlayerServiceTest: updateBookmark()
        $scope.setBookmark = function(episode){
          var currentTime = $scope.audioElement.currentTime;
          PlayerService.updateBookmark(episode, currentTime);
        };
        
        // Toggle the player
        // @params: Single Episode object model.
        // @return: off: load the episode and start from bookmark
        //          playing: pause playback
        //          resume playback from currentTime.    
        $rootScope.playPause = function(episode){
            if($rootScope.playerStatus == 'off')
                return $rootScope.initializeAction(episode);
            if($rootScope.playerStatus == 'playing')
                return $rootScope.pauseAction();
            return $rootScope.resumeAction(episode); 
        };
        
        $rootScope.counter = $rootScope.counter || 0;
        
        $rootScope.initializeAction = function(episode){
            $rootScope.currentFile = $sce.trustAsResourceUrl(episode.src);
            $rootScope.nowPlaying = PlayerService.setNowPlaying(episode);
            // Run the time out only on the initial
            // file load so js has time to read it.
            $timeout(function(){ 
                // Start the player from the models
                // bookmarked time defaults to 0 of course.
                $rootScope.audioElement.play();
                PlayerService.setResume();
                return $rootScope.playAction();
            }, 300);
        };
        
        $rootScope.resumeAction = function(model){
            $rootScope.audioElement.play();
            return $rootScope.playAction();
        };
        
        $rootScope.playAction = function(){            
            $rootScope.playerStatus = 'playing';            
            $rootScope.playPauseToggle = 'pause';
            return PlayerService.startCounter();
        };
        
        $rootScope.isPlaying = function(model){
            if(model.id == $rootScope.nowPlaying.id && 
                $rootScope.playerStatus == 'playing')
                    return 'pause';
            return 'play';
        };
        
        $rootScope.pauseAction = function(){
            PlayerService.stopCounter();
            $rootScope.audioElement.pause(); 
            $rootScope.playerStatus = 'paused';
            $rootScope.playPauseToggle = 'play';
        };        
        
        $rootScope.jumpBack = function(){
            var currentTime = parseInt($rootScope.audioElement.currentTime);
            $rootScope.audioElement.currentTime = currentTime - 300;
        };   
        
        $rootScope.rewind = function(){
            var currentTime = parseInt($rootScope.audioElement.currentTime);
            $rootScope.audioElement.currentTime = currentTime - 20;
        };               
        
        $rootScope.forward = function(){
            var currentTime = parseInt($rootScope.audioElement.currentTime);
            $rootScope.audioElement.currentTime = currentTime + 20;
        };  
                
        $rootScope.jumpAhead = function(){
            var currentTime = parseInt($rootScope.audioElement.currentTime);
            $rootScope.audioElement.currentTime = currentTime + 300;
        };            
        
        $scope.volumeDown = function(){
            console.log('volume down');
            $rootScope.audioElement.volume-=0.1;
        };
        
        $scope.volumeUp = function(){
            console.log('volume up');
            $rootScope.audioElement.volume+=0.1;
        };     
        
        $scope.setVolumeTo = function(val){
              $rootScope.audioElement.volume=val;
        };
                   
    }]);
