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

hcServices.service('dbx',  function(){
	
	var dbx = this;
	
	this.setDefaults = function($rootScope, $scope){
    $rootScope.title = "Dropbox Configuation";
    $scope.authForm = true;
	};
	
	this.checkAccess = function($rootScope, $scope, $http){
		$http.get('core/public/security/checkDBX')
      .success(function(data) {
        $rootScope.loading = false;
        if (data.error) {
          $rootScope.msg = data.message;
        }else{
        	dbx.getInstructions($rootScope, $scope, $http);
        }
      });  
	};
	
	
	this.getInstructions = function($rootScope, $scope, $http){
		$http.get('core/public/utility/getInstructions')
      .success(function(data) {
        $rootScope.loading = false;
        if (data.error) {
          $rootScope.msg = data.message;
        }else{
        	$scope.dbxInstructions = data.instructions;
        }
        return data.success;
      });  
	};
	
	this.authorize = function($rootScope, $scope, $http){
		var formData = jQuery('.authorize').serialize();
		$rootScope.loading = true;
      $http({
        method  : 'POST',
        url     : 'core/public/utility/authorize',
        data    : formData,  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
      })            
      .success(function(data) {
        $rootScope.loading = false;
        if (data.success) {
          $rootScope.msg = data.message;
          $scope.authForm = false;
        }
      });  
	};

});