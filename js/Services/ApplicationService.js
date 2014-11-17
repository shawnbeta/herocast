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

var hcServices = angular.module('hcServices', []);


hcServices.service('Application', function(){
  
  this.setDefaults = function($rootScope){
    $rootScope.title = '';
    $rootScope.loading = false;
    $rootScope.msg = '';
    $rootScope.error = false;
    $rootScope.subscriptions = {};
    $rootScope.buttons = {};
    $rootScope.mask = false;
    $rootScope.pagerToggle = false;
    $rootScope.current_episode = {};
    $rootScope.access = false;
    $rootScope.showMenu = false;
    
  };
  
  this.getConfig = function($rootScope, $http){
    $http.get('core/public/application/getConfigRoot').success(function(rsp) {
      if(rsp){
        $rootScope.webRoot = rsp.src_root;
        $rootScope.fileRoot = rsp.file_root;
      }
    });    
  };

  this.getPrimary = function($rootScope, $http){
    $http.get('core/public/menu/primary').success(function(rsp) {
      if(rsp){
        $rootScope.primary = rsp;
      }
    });      
  };
  
  
  this.limitChars = function(txt, count) {
      txt = txt.replace(/<(?:.|\n)*?>/gm, '');
      return txt.substr(0, count) + '...';
    };
    
});

