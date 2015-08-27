hcMedia.factory('PlayerService', 
    ['$rootScope', 'EpisodeService', '$interval', 
    function($rootScope, EpisodeService, $interval){
            
    var sec;
    var counter = {};
    var ticker;
    
    return {
                
        startCounter: function(){
            if(angular.isDefined(ticker)) return;
            ticker = $interval(this.updateCounter, 1000);
        },
        
        stopCounter: function(){
            if(angular.isDefined(ticker)){
                $interval.cancel(ticker);
                ticker = undefined;
            }
        },
        
        updateCounter: function(){
            pad = function(val){ 
                return val > 9 ? val : "0" + val; 
            };
            sec = Math.floor($rootScope.audioElement.currentTime);
            counter.seconds = pad(++sec % 60);
            counter.minutes = pad(pad(parseInt(sec / 60, 10) % 60));
            counter.hours = pad(parseInt(sec / 3600, 10)); 
            $rootScope.counter = counter;
        },
        
        setNowPlaying: function(model){
           return model;
        },
 
        setResume: function(){
            var check = $interval(function(){
                if($rootScope.audioElement.currentTime){
                    $interval.cancel(check);
                    var resume = parseFloat($rootScope.nowPlaying.bookmark);
                    $rootScope.audioElement.currentTime = resume;
                }
                    
            }, 20);
        },
        
        updateBookmark: function(episode, currentTime){
            episode.bookmark = currentTime;
            EpisodeService.updateLocal(episode);
            EpisodeService.updateRemote(episode, 'bookmark', episode.bookmark);
        },
               
        
        
    };
}]); 

  



 