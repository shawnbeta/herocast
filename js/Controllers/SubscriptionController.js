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

hcControllers.controller('Subscription', ['$rootScope', '$scope', '$http', 'Subscription',
  function($rootScope, $scope, $http, Subscription) {
  	
  	Subscription.subscriptionListDefaults($rootScope);
  
  	
		$scope.download = function(option, id){
			$rootScope.subscriptions[id].download = id;
			Subscription.download($rootScope, $scope, $http, option, id);
		};
	  
	  $scope.deleteSub = function(val){
			Subscription.deleteSub($rootScope, $http, val);
		};
  
	  $scope.showDescription = function(subscription){
          $rootScope.showOverlay = !$rootScope.showOverlay;
          $rootScope.showMask = true;
          $rootScope.overlay = {};
          $rootScope.overlay.title = subscription.title;
          $rootScope.overlay.image = subscription.image;
          $rootScope.overlay.overview = subscription.description;
          doOverlay($rootScope.showOverlay);	    
	  };  

	  $scope.hideDescription = function(){
		$scope.activeDescription = false;
	  	$rootScope.showOverlay = false;
	    $rootScope.overlay = false;
	    $rootScope.mask = false;
	  }; 
  }

  ]);
  
  
hcControllers.controller('CreateFeed', ['$rootScope', '$scope', '$http', 'Subscription',
  function($rootScope, $scope, $http, Subscription) {  	
  	// Set the page defaults
  	Subscription.createFeedDefaults($rootScope);
  	
  	// On create form submission
    $scope.create = function(){
    	Subscription.createFeed($rootScope, $http);
    };
    
  }
]);

hcControllers.controller('CreateYoutube', ['$rootScope', '$http', 'Subscription',
  function($rootScope, $http, Subscription) {  	
  	// Set the page defaults
  	Subscription.createYoutubeDefaults($rootScope);
  	
  	// On create form submission
    $scope.create = function(){
    	Subscription.createYoutube($rootScope, $http);
    };
  }
]);
