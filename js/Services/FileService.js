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

hcServices.service('File', function(){
  
  this.copyToServer = function(episode){
    var input = {
      'eid' : episode.id,
    };
    var jInput = JSON.stringify(input);
    var transferToServer = new Worker("js/Workers/transferToServer.js");

    transferToServer.postMessage(jInput);
  };
  
  this.copyToDbx = function(episode){
    // Try the workers
    var input = {
      'eid' : episode.id,
    };
    var jInput = JSON.stringify(input);
    var copyDropbox = new Worker("js/Workers/copyToDropbox.js");
    copyDropbox.onmessage = function(oEvent){
      $scope.message = oEvent.data;
    };
    copyDropbox.postMessage(jInput);
  };
  
});

hcServices.factory('MigrateFile', function($http){
  
  var migrateFile = {    
    async: function(){    
       eid = localStorage['eid'];
       mid = localStorage['mid'];

      var migrate_file = $http.get('core/web/app_dev.php/podcast/migrate/' + eid + '/' + mid).then(function(rsp){
        console.log(rsp);
        return rsp;
      });
      return migrate_file;
    }
  };
  return migrateFile;
  
});
