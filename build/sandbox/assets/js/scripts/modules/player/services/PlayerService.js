hcMedia.factory('PlayerService', 
    ['$rootScope', 'EpisodeService', '$interval', '$sce',
    function($rootScope, EpisodeService, $interval, $sce){
            
    var counter = {};
    var ticker;
        var player;
    
    return {

        playerToggleIcon: function(){
            return 'bars';
        },

        initializePlayer: function(ele, type){
            player = this.defaultPlayer(ele, type);
            this.setPlayerStyles(player);

            var self = this;


            // Use resize to get the height of the player if the user adjust the screen size.
            jQuery(window).on('resize', function(){
                // Just collapse the player for now
                jQuery(player.wrapper).css({'display': 'none', 'height': ''});
                self.setPlayerStyles(player);
            });

            return player;
        },

        setPlayerStyles: function(player){
            // So js doesn't have to check the element each time.
            player.height  = jQuery(player.wrapper).height();
            //console.log(player.height);
            // Player should be moved to margin equal to elements height
            jQuery(player.wrapper).css({
                'display':  'block',
                'height': 0
            });
        },

        toggleVisible: function(player){
            if(player.visible == false){
                console.log(player.height)
                jQuery(player.wrapper).animate({
                    height: player.height
                });
            }else {
                jQuery(player.wrapper).animate({
                    height: 0
                });
            }
            player.visible = !player.visible;

        },

        adjustPlayerHeight: function(height, wrapper){
            jQuery(wrapper).animate({
                'height': height
            })
        },

        engageAudio: function(episode, player, pti){
            if(player.status == 0){
                this.loadPlayer(episode, player, pti);
                pti = 'spinner';
                return 1;
            }

            if(player.status == 1 && player.activeEpisode == episode){
                this.pauseAction();
                pti = 'play-circle';
                return 1;
            }

            // Player is currently playing a different episode.
            if(player.status == 1){
                console.log(player.activeEpisode.id)
                // So set a temporary bookmark in memory.
                // Send back the currently playing episode and the current time.
                return {
                    previousEpisode: player.activeEpisode.id,
                    currentTime: player.element.currentTime
                }
            }
            ///this.playAction(player);
        },

        loadPlayer: function(episode, player, pti){
            player.loading = true;
            // if the player is already active kill it
            if(player.status == 1){

                player.element.pause();
                player.file = $sce.trustAsResourceUrl(episode.src);
                player.element.load();
            }
            player.file = $sce.trustAsResourceUrl(episode.src);
            player.activeEpisode = episode;
            var self = this;
            // Continue the p
            player.element.oncanplay = function(){
                player.loading = false;
                // Start playback
                self.playAction(player);
                // Move the pointer to bookmark. Defaults to 0.
                player.element.currentTime = parseFloat(episode.bookmark);
            }
        },

        isPlaying: function(model){
            if(model.id == player.activeEpisode.id && player.status == 1)
                return 'pause';
            return 'play';
        },

        playAction: function(player){
            player.element.play();
            player.status = 1;
            player.toggleText = 'pause';
            this.startCounter(player);
        },

        pauseAction: function(){
            this.stopCounter();
            player.element.pause();
            player.status = 3;
            player.toggle = 'play';
        },

        rewind: function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime - 20;
        },

        forward: function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime + 20;
        },

        jumpBack: function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime - 300;
        },

        jumpAhead: function(){
            var currentTime = parseInt(player.element.currentTime);
            player.element.currentTime = currentTime + 300;
        },

        volumeDown: function(){
            player.element.volume-=0.1;
        },

        volumeUp: function(){
            player.element.volume+=0.1;
        },

        setVolumeTo: function(){
            player.element.volume=val;
        },

        defaultPlayer: function(ele, type){
            return {
                element: ele.player,
                wrapper: ele.wrapper,
                status: 0,
                file: null,
                showDetails: false,
                activeEpisode: '',
                toggleText: null,
                visible: false,
                height: 0,
                type: type,
                loading: true
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

  



 