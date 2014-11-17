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

hcControllers.controller('Episode', [
'$rootScope', 
'$scope', 
'$http', 
'$sce', 
'Application', 
'Subscription', 
'Episode', 
'Player', 
'File',
  
  function($rootScope, $scope, $http, $sce, Application, Subscription, Episode, Player, File) {
  	
    // This needs to go in globals
    $scope.limitChars = function(txt, count) {
      return Application.limitChars(txt, count);
    };
      
    Episode.AllEpisodeDefaults($rootScope, $scope);
  
    $scope.getEpisodes = function(page){
      Episode.getEpisodes($rootScope, $scope, $sce, $http, page, Subscription);
    };
    
    $scope.doVideoPlayer = function(episode){
      $rootScope.current_episode = episode;
	   Player.videoPlayer($rootScope, episode);
    };
    
    $scope.doPlayer = function(episode){
    	Player.togglePlayer($rootScope);
    	Player.engagePlayer($rootScope, $scope, $http, $sce, Episode, episode, '#player');
    };
	    
    $scope.markWatched = function(id, option){
      Episode.markWatched(id, option);
    };

    $scope.showEpisodeOverview = function(episode){
      $rootScope.overlay = {};
      $rootScope.showOverlay = !$rootScope.showOverlay;
      $rootScope.mask = true;
      $rootScope.overlay.image = episode.image;
      $rootScope.overlay.title = episode.title;
      $rootScope.overlay.pub_date = episode.pub_date;
      $rootScope.overlay.overview = episode.overview;
      doOverlay($rootScope);
    };      
     
     
    $rootScope.refresh = function(){
      Episode.refresh($rootScope, $scope, $http, Subscription);    
    };    
         
    // Now run the defaults
    $scope.getEpisodes(1);
    $scope.pager = 1;  
    
		// File Operations
    $scope.copyToServer = function(episode){
    	File.copyToServer(episode);
    };

    $scope.copyToDbx = function(episode){
    	File.copyToDbx(episode);
    };
    
    
		$scope.doPagerToggle = function(){

      Episode.doPagerToggle($rootScope);
		};
  
}
  
]);


hcControllers.controller('Series', [
    '$rootScope', 
    '$scope', 
    '$http', 
    '$sce', 
    '$routeParams', 
    'Application', 
    'Subscription', 
    'Episode', 
    'Player', 
    'File',
  function($rootScope, $scope, $http, $sce, $routeParams, Application, Subscription, Episode, Player, File) {
  	  	  	
    Episode.BySeriesDefault($rootScope, $scope);

    // This needs to go in globals
    $scope.limitChars = function(txt, count) {
      return Application.limitChars(txt, count);
    };
    
    $scope.showOverview = function(eid, val){    	
      Episode.showOverview(eid, val);
    };
  
    $scope.getEpisodesBySeries = function(page){
      Episode.getEpisodesBySeries($rootScope, $scope, $http, $routeParams, page, Subscription); 
    };
    
    $scope.doPlayer = function(episode){
    	Player.togglePlayer($rootScope);
    	Player.engagePlayer($rootScope, $scope, $http, $sce, Episode, episode, '#player');
    };

    $scope.markWatched = function(id, option){
      Episode.markWatched(id, option);
    };
    
    $scope.manualRefresh = function(){
      Episode.manualRefresh();    
    };
      
    // Now run the defaults
    $scope.getEpisodesBySeries(1, $rootScope.id);
    $scope.pager = 1;  


	// File Operations
    $rootScope.copyToServer = function(episode){
    	File.copyToServer(episode);
    };

    File.copyToDbx = function(episode){
    	File.copyToDbx(episode);
    };

    $scope.doPagerToggle = function(){
      Episode.doPagerToggle($rootScope);
    };

  },
]);

hcControllers.controller('Video', [
  function() {
  	
  	// get the episode from localStorage  	
  	// and set it to scope as current episode.  	
    $scope.current_episode = JSON.parse(localStorage['episode_string']);

    Player.engagePlayer($rootScope, $scope, $http, $sce, Episode, episode, '#player');
    
    
    

  },
]);