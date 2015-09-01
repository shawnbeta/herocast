hcMedia.factory('PlayerService', 
    ['$rootScope', '$interval', '$sce', 'EpisodeService', 'HelperService',
    function($rootScope, $interval, $sce, EpisodeService, HelperService){
        
        // This needs to be global so it's accessable from everywhere.
        var ticker;

    
    return {

        playerObj: {},

        // Returns Player Object.
        createPlayerObj: function(updateToggleStyle){
            return {
                element: document.getElementsByTagName('audio')[0],
                wrapper: jQuery('#audioPlayer'),
                viewToggle: jQuery('#toggleAudio'),
                status: 0,
                src: null,
                showDetails: false,
                activeEpisode: {},
                toggleText: null,
                // 0: default(left:-9999px, display: none)
                // 1: expanded
                // 2: closed(left:0, height: 0)
                visible: 0,
                height: 0,
                type: 'audio',
                loading: true,
                toggleStyle: 'fa-bars',
                counter: 0,
                updateStyle: updateToggleStyle
            }
        },

        initialize: function(updateToggleStyle){
            this.playerObj = this.createPlayerObj(updateToggleStyle);
            this.playerObj.updateStyle(' fa-amazon ');
            this.setPlayerStyles();
            var self = this;

            // Use resize to get the height of the player if the user adjust the screen size.
            jQuery(window).on('resize load', function(){
                self.setPlayerStyles();
            });
            this.playerObj.updateStyle(' fa-amazon ');
        },

        //hidePlayer: function(wrapper){
        //    // Player should be moved to margin equal to elements height
        //    jQuery(wrapper).css({
        //        'display':  'block',
        //        'height': 0
        //    });
        //},
        setPlayerStyles: function(){
            // So js doesn't have to check the element each time.
            this.playerObj.height  = jQuery(this.playerObj.wrapper).height();
        },

        determinePlayerVisbility: function() {
            console.log(this.playerObj.visible);
            // Player is open
            if(this.playerObj.visible == 2) {
                this.playerObj.updateStyle('fa-amazon');
                // Close the player
                this.playerObj.visible = 1;
                return 0;
            }
            // Player is closed
            if(this.playerObj.visible == 1) {
                this.playerObj.updateStyle('fa-apple');
                // Expand the player.
                this.playerObj.visible = 2;
                return this.playerObj.height;
            }
            if(this.playerObj.visible == 0) {
                this.playerObj.updateStyle('fa-adn');
                jQuery(this.playerObj.wrapper).css({ 'display':  'block', 'height': 0, 'position': 'relative' });
                jQuery(this.playerObj.wrapper).css({left: 0});
                this.playerObj.visible = 2;
                return this.playerObj.height;
            }
        },

        toggleVisible: function(){
            var h = this.determinePlayerVisbility();
            jQuery(this.playerObj.wrapper).animate({
                height:h
            });
        },


        engageAudio: function(episode, updateActiveBookmark){

            if(this.playerObj.status == 0){
                return this.loadPlayer(episode);
            }

            if(this.playerObj.status == 1 && this.playerObj.activeEpisode == episode){
                this.pauseAction();
                return;
            }

            // Player is currently playing a different episode.
            if(this.playerObj.status == 1){
                // Run the callback;
                updateActiveBookmark(this.playerObj.activeEpisode.id, this.playerObj);
                this.loadPlayer(episode);
            }
            // resume from pause
            else {
                this.playAction();
            }
            return;
        },

        loadPlayer: function(episode){


            this.playerObj.toggleStyle = 'anchor';

            this.playerObj.element.src = $sce.trustAsResourceUrl(episode.src);
            if(this.playerObj.status == 1){
                this.playerObj.element.load();
            }
            // Change status after running check
            this.playerObj.status = 1;
            this.playerObj.activeEpisode = episode;
            var self = this;
            this.playerObj.element.oncanplay = function(){
                self.playerObj.toggleStyle = 'amazon';
                // Start playback
                self.playAction();
                // Move the pointer to bookmark. Defaults to 0.
                self.playerObj.element.currentTime = parseFloat(episode.bookmark);
                // On run toggleVisible if the playerObj isn't visible
                if(self.playerObj.visible == 0)
                    self.toggleVisible();
                //console.log(self.playerObj.wrapper);
                //console.log(self.playerObj.height);
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
            var self = this;
            ticker = $interval(function(){
                self.updateCounter(self.playerObj);
            }, 1000);
        },
        
        stopCounter: function(){
            if(angular.isDefined(ticker)){
                $interval.cancel(ticker);
                ticker = undefined;
            }
        },
        
        updateCounter: function(playerObj){
            var time = playerObj.element.currentTime;
            pad = function(val){
                return val > 9 ? val : "0" + val; 
            };
            sec = Math.floor(time);
            var counter = {};
            counter.seconds = pad(++sec % 60);
            counter.minutes = pad(pad(parseInt(sec / 60, 10) % 60));
            counter.hours = pad(parseInt(sec / 3600, 10));
            playerObj.counter = counter;
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

  



 