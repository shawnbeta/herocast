hcMedia.factory('PlayerService', 
    ['$rootScope', '$interval', '$sce', 'EpisodeService', 'HelperService',
    function($rootScope, $interval, $sce, EpisodeService, HelperService){
        
        // This needs to be global so it's accessable from everywhere.
        var ticker;

    
    return {

        playerObj: {},

        // Returns Player Object.
        createPlayerObj: function(){
            return {
                element: document.getElementsByTagName('audio')[0],
                wrapper: jQuery('#audioPlayer'),
                viewToggle: jQuery('#toggleAudio'),
                status: 0,
                src: null,
                showDetails: false,
                activeEpisode: {},
                toggleText: null,
                visible: false,
                height: 0,
                type: 'audio',
                loading: true,
                toggleStyle: 'fa-bars',
                counter: 0
            }
        },

        initialize: function(){
            this.playerObj = this.createPlayerObj();
            console.log(this.playerObj);
            console.log(this.playerObj);
            this.setPlayerStyles(this.playerObj);
            var self = this;

            // Use resize to get the height of the player if the user adjust the screen size.
            jQuery(window).on('resize', function(){
                // Just collapse the player for now
                jQuery(this.playerObj.wrapper).css({'display': 'none', 'height': ''});
                self.setPlayerStyles(playerObj);
            });
        },

        setPlayerStyles: function(){
            // So js doesn't have to check the element each time.
            this.playerObj.height  = jQuery(this.playerObj.wrapper).height();
            //console.log(player.height);
            // Player should be moved to margin equal to elements height
            jQuery(this.playerObj.wrapper).css({
                'display':  'block',
                'height': 0
            });
        },

        toggleVisible: function(){
            if(this.playerObj.visible == false){
                console.log(playerObj.height)
                jQuery(this.playerObj.wrapper).animate({
                    height: this.playerObj.height
                });
            }else {
                jQuery(this.playerObj.wrapper).animate({
                    height: 0
                });
            }
            this.playerObj.visible = !this.playerObj.visible;
        },

        adjustPlayerHeight: function(height, wrapper){
            jQuery(wrapper).animate({
                'height': height
            })
        },

        engageAudio: function(episode, updateActiveBookmark){

            if(this.playerObj.status == 0){
                console.log('aaaa')
                return this.loadPlayer(episode);
            }

            if(this.playerObj.status == 1 && this.playerObj.activeEpisode == episode){
                console.log('dddd')
                this.pauseAction();
                return {success: true}
            }

            // Player is currently playing a different episode.
            if(this.playerObj.status == 1){
                console.log('12351')
                console.log(this.playerObj.activeEpisode.id)
                // Run the callback;
                updateActiveBookmark(this.playerObj.activeEpisode.id, this.playerObj);
                this.loadPlayer(episode);
            }
        },

        loadPlayer: function(episode){


            this.playerObj.toggleStyle = 'loading';
            this.playerObj.element.src = $sce.trustAsResourceUrl(episode.src);
            if(this.playerObj.status == 1){
                this.playerObj.element.load();
            }
            // Change status after running check
            this.playerObj.status = 1;
            this.playerObj.activeEpisode = episode;
            var self = this;
            // Continue the p
            this.playerObj.element.oncanplay = function(){
                console.log('kkkkkk')

                self.playerObj.toggleStyle = 'active';
                self.playerObj.loading = false;
                // Start playback
                self.playAction();
                // Move the pointer to bookmark. Defaults to 0.
                self.playerObj.element.currentTime = parseFloat(episode.bookmark);
                //console.log(this.playerObj);
            }
            //return {
            //    playerObj: this.playerObj,
            //    success: true
            //};

        },

        isPlaying: function(obj){
            if(obj.id == this.playerObj.activeEpisode.id && this.playerObj.status == 1)
                return 'pause';
            return 'play';
        },

        playAction: function(){
            this.playerObj.element.play();
            this.playerObj.status = 1;
            this.playerObj.toggleText = 'pause';
            this.startCounter();
        },

        pauseAction: function(){
            this.stopCounter();
            this.playerObj.element.pause();
            this.playerObj.status = 3;
            this.playerObj.toggle = 'play';
        },

        rewind: function(){
            var currentTime = parseInt(this.playerObj.element.currentTime);
            this.playerObj.element.currentTime = currentTime - 20;
        },

        forward: function(){
            var currentTime = parseInt(this.playerObj.element.currentTime);
            this.playerObj.element.currentTime = currentTime + 20;
        },

        jumpBack: function(){
            var currentTime = parseInt(playerObj.element.currentTime);
            playerObj.element.currentTime = currentTime - 300;
        },

        jumpAhead: function(){
            var currentTime = parseInt(playerObj.element.currentTime);
            playerObj.element.currentTime = currentTime + 300;
        },

        volumeDown: function(){
            playerObj.element.volume-=0.1;
        },

        volumeUp: function(){
            playerObj.element.volume+=0.1;
        },

        setVolumeTo: function(){
            playerObj.element.volume=val;
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
            sec = Math.floor(this.playerObj.element.currentTime);
            var counter = {};
            counter.seconds = pad(++sec % 60);
            counter.minutes = pad(pad(parseInt(sec / 60, 10) % 60));
            counter.hours = pad(parseInt(sec / 3600, 10));
            this.playerObj.counter = counter;
        },

        getExtension: function(filename){
          var parts = filename.split('.');
            return parts[parts.length - 1];
        },

        isAudio: function(filename) {
            var ext = this.getExtension(filename);
            switch (ext.toLowerCase()) {
                case 'mp3':
                case 'ogg':
                    return true;
            }
            return false;
        },

        isVideo: function(filename) {
            var ext = this.getExtension(filename);

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

  



 