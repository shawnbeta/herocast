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

hcServices.service('Security', function(){
	
	this.getAccess = function($http){      
      var security_data = $http.get('core/public/security/getAccess').then(function(rsp){
      	console.log(rsp.data.success);
        return rsp;
      });
      return security_data;
   };

	this.createKey = function($rootScope, $scope, $http){
		var formData = jQuery('.add').serialize();
		$rootScope.loading = true;
		$http({
			method  : 'POST',
			url     : 'core/public/security/setAccessToken',
			data    : formData,  
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		})
		.success(function(data) {
			if (data.success) {
				$rootScope.loading = false;
				$rootScope.msg = data.msg;
				$scope.hideForm = true;
			}
		});      
	};	
	
	this.validateKey = function($rootScope, $scope, $http, Application, Subscription ){
		$rootScope.loading = true;
		var formData = jQuery('.validate').serialize();		
		$http({
			method  : 'POST',
			url     : 'core/public/security/validateAccessToken',
			data    : formData,  
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		})
		.success(function(data) {
			if (data.success) {
				Application.getPrimary($rootScope, $http);
				Subscription.get($rootScope, $http);
                localStorage['client_token'] = data.client_token;
                localStorage['client_id'] = data.client_id;
				window.location = '#episodes';
			}
			$scope.loading = false;
			$rootScope.msg = data.msg;			
		});      
	};	
	
	this.changeKey = function($rootScope, $http){
		$rootScope.loading = true;
		var formData = jQuery('.edit').serialize();
		
		$http({
			method  : 'POST',
			url     : 'core/public/security/setAccessToken',
			data    : formData,  
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		})
		.success(function(data) {
			if (data.success) {
				$rootScope.loading = false;
				$rootScope.msg = data.msg;
			}
		});      
	};
	
	this.useClientToken = function($http){
		$http({
			method  : 'POST',
			url     : 'core/public/security/validateClientToken',
			data    : { token : localStorage['client_token'] }  
		}).success(function(data) {
        if(data.success){
          // On success redirect user
          // to the episode grid
          return window.location = '#/episodes';
      }else{
        // Bad client token is saved
        // in ls so remove it
        localStorage['client_token'] = '';
        // Then redirect
        return window.location = '#/security/validate';
      }
      
		});

	};
	
	this.logout = function($rootScope, $http, Application){
		$rootScope.loading = true;
		
		$http.get('core/public/security/logout/' + localStorage['client_id'])
        .success(function(){
			  $rootScope.loading = false;
			  // Get the menu for unauthenticated users
				Application.getPrimary($rootScope, $http);
				// Remove the current client from localStorage
				// this allows client name to be reused.
				localStorage['client_token'] = '';
				// Send the user to login page.
				window.location = '#/security/validate';
			});
	};
	
	this.validateDefaults = function($rootScope){
		$rootScope.buttons = {
          'createKey' : true,   
          'editKey' : true,
        };
    $rootScope.title = "Validate Key";  
	};
	
	this.createDefaults = function($rootScope){
		$rootScope.buttons = {
      'enterKey' : true,
      'editKey' : true,
    };
    $rootScope.title = "Create Key";  
	};	
	
	this.changeDefaults = function($rootScope, $http){
	    // Check to see if the change 
	    //key is authorized in config.
	    $http.get('core/public/security/checkChangeKey').
	       success(function(data){
	           $rootScope.msg = data.msg;
	       });
	    
		$rootScope.buttons = {
          'enterKey' : true,
          'createKey' : true,   
        };
        $rootScope.title = "Change Key";  
	};	
  
  // Security Checks
  this.checkSecurityData = function($rootScope, $http, d){

    console.log(d.access);
    if(d.access){
        console.log('true');
      $rootScope.access = true;
      return;
    }
    
    // Accesss token is set so let's check localStorage
    if(localStorage['client_token']){
      // If client token exist use this to log user in. 
      this.useClientToken($http);
    }
  };
 
   this.clientDefaults = function($rootScope)
  {
    $rootScope.title = 'Clients';
  };
  
   
this.deleteClient = function($rootScope, $http, id){
    $http.get('core/public/security/deleteClient/' + id)
    .success(function(data) {
        $rootScope.clients = data.clients;
    });
};
          
  
  this.getClients = function($rootScope, $http){
    $http.get('core/public/security/getClients').success(function(data) {
      if(data){
        $rootScope.clients = data.clients;
      }
    });    
  };  

});





hcServices.factory('GetSecurityData', function($http){
  
  var getSecurityData = {    
    async: function(){      
      var security_data = $http.get('core/public/security/getAccess')
        .then(function(rsp){
          return rsp;
        });
      return security_data;
    }
  };
  return getSecurityData;
  
});