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

hcServices.service('Subscription', function(){
	
	self = this;
  
	this.subscriptionListDefaults = function($rootScope){
		$rootScope.buttons = {
      'searchitunes' : true,
      'youtube' : true,   
      'searchyoutube' : true,
    };   
    $rootScope.title = "Your Subscriptions";             
	};
	
	this.createFeedDefaults = function($rootScope){
		$rootScope.buttons = {
      'searchitunes' : true,
      'youtube' : true,   
      'searchyoutube' : true,
    };
    $rootScope.title = "Add New Feed";  
	};
	
	this.createYoutubeDefaults = function($rootScope){
		$rootScope.buttons = {
      'feed' : true,
      'youtube' : true,   
      'searchitunes' : true,
    };
    $rootScope.title = "Add Youtube Channel ID";  
	};	
	
	// Add new feed urls
	this.createFeed = function($rootScope, $http){
			var formData = jQuery('.create').serialize();
			$rootScope.loading = true;
			$http({
		  	method  : 'POST',
			  url     : 'core/public/subscriptions/set',
			  data    : formData,  
			  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
			})
		  .success(function(data) {
		    $rootScope.loading = false;
		    $rootScope.msg = data.message;
		    if (!data.success) $rootScope.error = true;
		    self.get($rootScope, $http);
	    });  
		};
		
	this.createYoutube = function($rootScope, $http){
		var formData = jQuery('.create').serialize();
		$rootScope.loading = true;
		$http({
	  	method  : 'POST',
		  url     : 'core/public/subscriptions/set',
		  data    : formData,  
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		})
	  .success(function(data) {
	    $rootScope.loading = false;
	    $rootScope.msg = data.message;
	    if (!data.success) $rootScope.error = true;
	    self.get($rootScope, $http);
    });  		
		
	};
  
  this.download = function($rootScope, $scope, $http, option, id){
    $http.get('core/public/subscriptions/download/' + id + '/' + option)
    .success(function(rsp) {
      if(rsp.success){
        $rootScope.subscriptions[id].download = option;
      }else{
        $rootScope.msg = rsp.error;
      }
    }); 	
  };
  
  this.get = function($rootScope, $http){
    $http.get('core/public/subscriptions').success(function(rsp) {
      if(rsp.success){
      	
				// Make a new array for the subscriptions
				subGroup = {};
				var subs = rsp.subscriptions;
				for(s in subs){
					if(!subs[s].title) continue;
					subObj = {
						id		: subs[s].id,
						title : subs[s].title,
						description : subs[s].description,
						url			: subs[s].url,
						image		: 'downloads/cover-art/' // add the cover art directory
							+ encodeURI(subs[s].title) + '/' // encode the subscription title
							+ subs[s].image, // finally append the image filename.
						type		: subs[s].type,
						download	: subs[s].download,
						create_date	: subs[s].create_date				
					};			
					subGroup[subs[s].id] = subObj;
				}
				$rootScope.subscriptions = subGroup;
      }else{
        $rootScope.msg = rsp.error;
      }
    }); 		  
  };
  
  this.deleteSub = function($rootScope, $http, val){
	 var self = this;
   $http.get('core/public/subscriptions/delete/' + val)
    .success(function(data) {
      if (data.success) {   
      	self.get($rootScope, $http);
          window.location = '#subscriptions';
      }
      });   
  };
  	
  	
	this.GetSubscriptionById = function($rootScope, id){
		for(s in $rootScope.subscriptions){
			if(parseInt($rootScope.subscriptions[s].id) === parseInt(id)) 
				return $rootScope.subscriptions[s];
		}
	};

    
});
