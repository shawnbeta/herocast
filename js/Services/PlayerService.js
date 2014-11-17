/**
 * This source file is part of HeroCast.
 *
 * HeroCast is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HeroCast is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with HeroCast. If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 *
 *
 * @category HC_App
 * @package  js
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */

hcServices.service('Player', function() {

    var playerObj = this;

    this.togglePlayer = function($rootScope) {
        $rootScope.togglePlayer = true;
    };

    this.videoPlayer = function($rootScope, episode) {
        var string = JSON.stringify(episode);
        //console.log(string);
        localStorage['episode_string'] = string;
        var win_size = "width=760, height=710";
        $rootScope.sbPlayer = window.open("player.html#video", "cool", win_size);
    };

    this.engagePlayer = function($rootScope, $scope, $http, $sce, Episode, episode, player) {

        $scope.file = $sce.trustAsResourceUrl(episode.src);

        // If episode is already loaded update it's resume time so you don't have t
        // to reach out to server time after time.
        if ($rootScope.current_episode) {
            id = $rootScope.current_episode.id;
            old_episode = Episode.GetEpisodeById($scope, id);
        }

        $rootScope.current_episode = episode;

        var file = episode.src;

        // See if the another file is playing.
        if (jQuery(player).data("jPlayer") && !jQuery(player).data("jPlayer").status.paused) {
            //console.log("playing");
            var saveTime = jQuery(player).data("jPlayer").status.currentTime;

            if (old_episode)
                old_episode.bookmark = saveTime;

            $http.get('core/public/episodes/setBookmark/' + id + '/' + saveTime).success(function(data) {
                if (data.success) {

                }
            });

            jQuery(player).jPlayer("pause");
            jQuery(player).jPlayer("setMedia", {
                mp3 : file,
            });
        }

        if (player == "#player") {
            jQuery(player).jPlayer({
                ready : function() {
                    jQuery(this).jPlayer("setMedia", {
                        mp3 : file,
                    });
                },
                swfPath : "libs/",
                supplied : "mp4, mp3",
                timeFormat : {
                    showHour : true,
                },
            });
        } else {
            jQuery(player).jPlayer({
                ready : function() {
                    jQuery(this).jPlayer("setMedia", {
                        m4v : file,
                    });
                },
                swfPath : "libs/",
                supplied : "m4v",
                timeFormat : {
                    showHour : true,
                },
                size : {
                    width : "720px",
                    height : "438px"
                }
            });
        }

        setTimeout(function() {
            var resume = parseInt(episode.bookmark);
            jQuery(player).jPlayer("play", resume);
        }, 300);

    };

    // The video launches in a new tab
    // so episode array isn't available.
    // To get episode information must use
    // another query from the server.
    this.getSoloEpisode = function($scope, $http, eid) {
        $http.get('core/public/episodes/getSolo/' + eid).success(function(data) {
            if (data.success) {
                $scope.episode = data.episode;
                $scope.media = data.subscription;
                $scope.file = sw.sce.trustAsResourceUrl(data.episode.src);
                $scope.resume = data.episode.resume_time;

                var file = data.episode.src;

                jQuery("#jquery_jplayer_2").jPlayer({
                    ready : function() {
                        $(this).jPlayer("setMedia", {
                            //title: $scope.episode.title,
                            m4v : file,
                            //oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
                        });
                    },
                    swfPath : "libs/",
                    supplied : "m4v",
                    size : {
                        width : "705px",
                        height : "438px"
                    }
                });

            }
        });

    };

    this.rewind = function(player) {
        RewindTrack(player);
    };

    this.fastForward = function(player) {
        FastForwardTrack(player);
    };

    this.aheadFive = function(player) {
        FastForwardTrack(player);
    };

    this.backFive = function(player) {
        RewindTrack(player);
    };

});

function GetPlayerProgress() {
    return (jQuery('.jp-play-bar').width() / jQuery('.jp-seek-bar').width() * 100);
};

function RewindTrack(player) {
    //Get current progress and increment
    var currentProgress = this.GetPlayerProgress();

    //If it goes past the starting point - stop rewinding and pause
    var futureProgress = currentProgress - .5;
    if (futureProgress <= 0) {
        rewinding = false;
        jQuery(player).jPlayer("pause", 0);
    } else {
        jQuery(player).jPlayer("playHead", parseInt(futureProgress - .5));
    }
};

function FastForwardTrack(player) {
    //Get current progress and increment
    var currentProgress = this.GetPlayerProgress();
    var futureProgress = currentProgress + .5;
    //If the percentage exceeds the max - stop fast forwarding at the end.
    if (futureProgress >= 100) {
        fastforward = false;
        jQuery(player).jPlayer("playHead", parseInt(jQuery('.jp-duration').text().replace(':', '')));
    } else {
        jQuery(player).jPlayer("playHead", parseInt(futureProgress + .5));
    }
};

