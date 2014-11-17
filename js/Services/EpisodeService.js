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

hcServices.service('Episode', function(){
	obj = this;
	
  this.AllEpisodeDefaults = function($rootScope, $scope){
    $rootScope.buttons = {};  
    $rootScope.msg = '';
    $rootScope.title = 'All Episodes';   
    $scope.watched = []; 
    $scope.image_slide = [];
  };
  
  this.BySeriesDefault = function($rootScope, $scope){
    $scope.showOverview = {};  
    $rootScope.msg = '';
    $rootScope.title = '';   
    $scope.watched = [];      
    $rootScope.buttons = {
      'allepisodes' : true,
      'browsesubscriptions' : true,
      'manuallyrefresh' : true
    };      
    $scope.show_overview = [];
  };  
  
  this.getEpisodes = function($rootScope, $scope, $sce, $http, page, Subscription){
		//$rootScope.pagerToggle = false;
  	$rootScope.loading = true;
    $scope.pager = page; 
    $http.get('core/public/episodes/get/all/' + page)
      .success(function(data) {
      	  	$rootScope.loading = false;
      	  	//$rootScope.loading = false;
    if (data.success) {
    	
		// Add the action buttons	
      $rootScope.buttons = {
        'manuallyrefresh' : true,
        'browsesubscriptions' : true
      };
    	
    	// Build and set the response
    	obj.episodeList($rootScope, $scope, Subscription, data);
    }else{
      $scope.message = $sce.trustAsHtml(data.message);
    }
    });
    
    
  };  
  
    this.getEpisodesBySeries = function($rootScope, $scope, $http, $routeParams, page, Subscription){
    $rootScope.loading = true;
    $scope.pager = page;
    $http.get('core/public/episodes/get/' + $routeParams.id + '/' + page)
    .success(function(data) {
      if (data.success) {  
	      	
      	// Bind series title so the title shows above	      	
      	$scope.media = Subscription.GetSubscriptionById($rootScope, $routeParams.id);
      	console.log($routeParams.id);
      	$scope.seriesTitle = 'Episodes for ' + $scope.media.title; 
          
        // Bind the action buttons
        $rootScope.buttons = {
          'allepisodes' : true,
          'browsesubscriptions' : true,
          'manuallyrefresh' : true
        };  
        
      	// Build and set the response
  		  obj.episodeList($rootScope, $scope, Subscription, data);
    		$rootScope.loading = false;
      }
    });     
        
	};

  this.refresh = function($rootScope, $scope, $http, Subscription){
      $rootScope.loading = true;
    $http({
      method  : 'GET',
      url     : 'core/public/episodes/refresh',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
    })
    .success(function(data) {
      if (data.success) {
        obj.episodeList($rootScope, $scope, Subscription, data);      
      }else{
      	$scope.message = data.message;
      }
      $rootScope.loading = false;
    });  
  };
  
  this.episodeList = function($rootScope, $scope, Subscription, data){
      for(episode in data.episodes){
      	
      	// make episode item var
      	ei = data.episodes[episode]; 
      	
      	// Add the parent subscription 
      	// to the episode object.
      	ei.sub = Subscription.GetSubscriptionById($rootScope, ei.subscription);
      	
      	// If the episode has no image, use the subscription image
      	if(!ei.image) {
      		ei.image = ei.sub.image;
      	}

      	if(ei.sub.type === 'youtube'){
      		var url = ei.src;
      		ei.playLink = 'http://youtube.com/watch?v=' + url;
      	}else{
      		ei.playLink = '#' + ei.sub.type + '/' + ei.id;
      	}

        var episodeId = ei.id;    
        
        // Change the date to js so angular repeat can order correctly      
        var newDate = new Date(ei.pub_date);
        ei.jsDate = newDate;
        if(ei.watched || ei.watched === '1')
        	$scope.watched[episodeId] = ei.watched;
      }
      $scope.episodes = data.episodes;
      
      // Build Pager
      obj.buildPager($scope, data.page_count);

  };
  
  this.markWatched = function(id, option){
    $scope.watched[id] = option;
    $http({
      method  :  'GET',
      url     : 'core/public/episodes/setWatched/' + id + '/' + option,
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
    })
    .success(function(data) {
      if (data.success) {      
      }
    });   
  };  
  
  this.showEpisodeOverview = function(episode){
  	//alert(val + eid)
  	console.log(episode);
  	alert('blue');
  	//$scope.show_overview[episode.id] = !$scope.show_overview[episode.id];
  	      $rootScope.showOverlay = !$rootScope.showOverlay;
      $rootScope.showMask = true;
      $rootScope.overlay = {};
      $rootScope.overlay.title = episode.title;
      $rootScope.overlay.image = episode.image;
      $rootScope.overlay.overview = episode.description;
      doOverlay($rootScope.showOverlay);
  };

  this.buildPager = function($scope, pc){
	
	var full_pager = [];
  	for(i=1; i<=pc; i++){
		full_pager.push(i);
	};
	
	// Bind the full pager
	$scope.full_pager = full_pager;
	
	// Now make the mini pager
	if(full_pager.length > 5) {
		micro_pager = [];
	  	for(i=1; i<=5; i++){
			micro_pager.push(i);
		};
		$scope.micro_pager = micro_pager;
	}

	// Determines if pager should be shown.
    $scope.link_numb = pc;
  };
  
  this.doPagerToggle = function($rootScope){
  	$rootScope.pagerToggle = !$rootScope.pagerToggle;
  };

	this.GetEpisodeById = function($scope, id){
		for(e in $scope.episodes){
			if(parseInt($scope.episodes[e].id) === parseInt(id)) 
				return $scope.episodes[e];
		}
	};
	
    this.SetEpisodeById = function($scope, id, field, value){
        for(e in $scope.episodes){
            if(parseInt($scope.episodes[e].id) === parseInt(id)){
              $scope.episodes[e][field] = value;
            } 
            return;
        }
    };	

  this.bookmark = function($rootScope, $http, player, id){
    
    //console.log(player);
    //console.log(id);
    
    // Get the current time from the player
    var playerTime = jQuery(player).data("jPlayer").status.currentTime;
    
    // Send the time and id to the server for saving
    $http.get('core/public/episodes/setBookmark/' + id + '/' + playerTime)
      .success(function(data){
        if(data.status){
          $rootScope.msg = 'Bookmark Added.';
        }
      });
    
    
    
    
  };
});


