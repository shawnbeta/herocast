hcMedia.factory('PlayerService', 
    ['$rootScope', 'EpisodeService', '$interval', 
    function($rootScope, EpisodeService, $interval){
            
    var counter = {};
    var ticker;
    
    return {

        playAction: function(player){
            player.element.play();
            player.status = 1;
            player.toggleText = 'pause';
            this.startCounter(player);
        },

        defaultPlayer: function(type){
            return {
                element: document.getElementsByTagName(type)[0],
                status: 0,
                file: null,
                showDetails: false,
                activeEpisode: '',
                toggleText: null
            }
        },
                
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
            sec = Math.floor($rootScope.player.element.currentTime);
            counter.seconds = pad(++sec % 60);
            counter.minutes = pad(pad(parseInt(sec / 60, 10) % 60));
            counter.hours = pad(parseInt(sec / 3600, 10));
            $rootScope.counter = counter;
        },

        getExtension: function(filename){
          var parts = filename.split('.');
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

  



 