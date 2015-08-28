hcMedia.factory('AudioService', ['PlayerService', 'Episode', '$http', '$rootScope',
    function(PlayerService, Episode, $http, $rootScope) {

      return {

          makePlayer: function(){
              return PlayerService.defaultPlayer('audio');
          }



      }


    }]);
