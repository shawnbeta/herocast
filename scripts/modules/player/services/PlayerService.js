hcMedia.factory('PlayerService', 
    ['$rootScope', '$interval', '$sce', 'EpisodeService', 'HelperService',
    function($rootScope, $interval, $sce, EpisodeService, HelperService){
        
        // This needs to be global so it's accessable from everywhere.
        var ticker;
        var rtime;
        var timeout = false;
        var delta = 200;
    
    return {

        playerObj: {},

        // Returns Player Object.
        createPlayerObj: function(updateToggleStyle, updateBubbleStyle){
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
                toggleStyle: '',
                counter: 0,
                updateToggleStyle: updateToggleStyle,
                updateBubbleStyle: updateBubbleStyle
            }
        },

        initialize: function(updateToggleStyle, updateBubbleStyle){
            this.playerObj = this.createPlayerObj(updateToggleStyle, updateBubbleStyle);
            this.setPlayerStyles();

            jQuery(window).on('resize', function(){
                rtime = new Date();
                console.log(1)
                if (timeout === false) {
                    timeout = true;
                    console.log(4)

                    setTimeout(this.resizeend, delta);
                }
            });

            //var self = this;

            //jQuery(window).on('resize', _.debounce(this.moveStage, 300));


            // Use resize to get the height of the player if the user adjust the screen size.
            //jQuery(window).on('resize', function(){
            //    if(this.resizeTO) clearTimeout(this.resizeTO);
            //    this.resizeTO = setTimeout(function() {
            //        $(this).trigger('resizeEnd');
            //    }, 500);
            //});
            //
            //jQuery(window).resize(_.debounce(function(){
            //}, 500));            //    console.log("resized");



        },

        resizeend: function() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta);
            } else {
                timeout = false;
                alert('Done resizing');
            }
        },


        moveStage: function(){
            //do something, window hasn't changed size in 500ms
            //self.playerObj.height = jQuery(self.playerObj.wrapper).height();
            // Give the user time to finish resizing before adjusting stage top
            //self.animateStage(self.playerObj.height);
            jQuery('#stage').animate({
                top: jQuery('#audioPlayer').height()
            });

        },

        setPlayerStyles: function(){
            // So js doesn't have to check the element each time.
            this.playerObj.height  = jQuery(this.playerObj.wrapper).height();
        },

        determinePlayerVisbility: function() {
            // Player is open
            if(this.playerObj.visible == 2) {
                this.playerObj.updateToggleStyle('fa-angle-double-down', this.playerObj);
                // Close the player
                this.playerObj.visible = 1;
                return 0;
            }
            // Player is closed
            if(this.playerObj.visible == 1) {
                // Expand the player.
                this.playerObj.visible = 2;
                this.playerObj.updateToggleStyle('fa-angle-double-up', this.playerObj);
                return this.playerObj.height;
            }
            if(this.playerObj.visible == 0) {
                //jQuery(this.playerObj.wrapper).css({ 'display':  'block', 'height': 0, 'position': 'relative' });
                //jQuery(this.playerObj.wrapper).css({left: 0});
                this.playerObj.visible = 2;
                this.playerObj.updateToggleStyle('fa-angle-double-up', this.playerObj);
                return this.playerObj.height;
            }
        },

        toggleVisible: function(){
            if(this.playerObj.status == 0) return alert('You\'ll have to play something first');
            var h = this.determinePlayerVisbility();
            this.animateStage(h);
        },

        animateStage : function(h){
            jQuery('#stage').animate({
                top:h
            });
        },


        togglePlayback: function(episode, updateActiveBookmark){

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

            // Action Button should show loading
            this.playerObj.updateBubbleStyle('loading', this.playerObj);

            this.playerObj.element.src = $sce.trustAsResourceUrl(episode.src);
            if(this.playerObj.status == 1){
                this.playerObj.element.load();
            }
            // Change status after running check
            this.playerObj.status = 1;
            this.playerObj.activeEpisode = episode;
            var self = this;
            this.playerObj.element.oncanplay = function(){
                //self.playerObj.toggleStyle = 'fa-pause';
                // Start playback
                self.playAction();
                // Move the pointer to bookmark. Defaults to 0.
                self.playerObj.element.currentTime = parseFloat(episode.bookmark);
                // Only run on initial load.
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
            this.playerObj.updateBubbleStyle('showPauseIcon', this.playerObj);
        },

        pauseAction: function(){
            this.stopCounter();
            this.playerObj.element.pause();
            this.playerObj.status = 3;
            this.playerObj.toggleText = 'play';
            this.playerObj.updateBubbleStyle('showPlayIcon', this.playerObj);
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
            var currentTime = parseInt(this.playerObj.element.currentTime);
            this.playerObj.element.currentTime = currentTime - 300;
        },

        jumpAhead: function(){
            var currentTime = parseInt(this.playerObj.element.currentTime);
            this.playerObj.element.currentTime = currentTime + 300;
        },

        volumeDown: function(){
            this.playerObj.element.volume-=0.1;
        },

        volumeUp: function(){
            this.playerObj.element.volume+=0.1;
        },

        setVolumeTo: function(){
            this.playerObj.element.volume=val;
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

  



 