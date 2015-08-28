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

        getExtension: function(filename){
            console.log(filename);
          var parts = filename.split('.');
            console.log('parts length');
            console.log(parts.length);
            console.log('parts');
            console.log(parts);
            console.log(parts[parts.length - 1]);
            return parts[parts.length - 1];
        },

        isAudio: function(filename) {
            var ext = this.getExtension(filename);
            console.log(ext);
            switch (ext.toLowerCase()) {
                case 'mp3':
                case 'ogg':
                    return true;
            }
            return false;
        },
        isVideo: function(filename) {
            var ext = this.getExtension(filename);
            console.log(ext);

            switch (ext.toLowerCase()) {
                case 'm4v':
                case 'avi':
                case 'mpg':
                case 'mp4':
                    return true;
            }
            return false;
        },

        
        updateBookmark: function(episode, currentTime){
            episode.bookmark = currentTime;
            EpisodeService.updateLocal(episode);
            EpisodeService.updateRemote(episode, 'bookmark', episode.bookmark);
        },
               
        
        
    };
}]); 

  



 