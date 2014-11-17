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

var hcApp = angular.module('hcApp', [
  'hcControllers',
  'hcServices',
  'ngRoute',
  'ngSanitize',
  'ngTouch'
]).run(function() {
    FastClick.attach(document.body);
  });

hcApp.config(['$routeProvider',

  function($routeProvider) {
    $routeProvider
    
    // Content    
    // All Episodes
    .when('/episodes', {
      templateUrl: 'Views/Subscription/List/episodes.html',
      controller: 'Episode'
    })  
    
    // Episodes by Series 
    .when('/series/:id', {
      templateUrl: 'Views/Subscription/List/series.html',
      controller: 'Series'
    })  
    
    // Video Player
    .when('/video/', {
      templateUrl: 'Views/Players/video.html',
      controller: 'Video'
    })    
        
    
    // Subscription list
    .when('/subscriptions/', {
      templateUrl: 'Views/Subscription/List/subscriptions.html',
      controller: 'Subscription'
    })
      
    // XML/Atom Feed URL form
    .when('/subscriptions/create/feed', {
      templateUrl: 'Views/Subscription/Create/feed.html',
      controller: 'CreateFeed'
    })    
    
    // Subscribe to youtube channel with channel-id.
    .when('/subscriptions/create/youtube', {
      templateUrl: 'Views/Subscription/Create/youtube.html',
      controller: 'CreateYoutube'
    })   
    
    // Search iTunes Form
    .when('/search/itunes', {
      templateUrl: 'Views/Search/itunes.html',
      controller: 'SearchiTunes'
    })             
 
    // Search Youtube Form
    .when('/search/youtube', {
      templateUrl: 'Views/Search/youtube.html',
      controller: 'SearchYoutube'
    })
    
    // Clients
    .when('/clients', {
      templateUrl: 'Views/Application/clients.html',
      controller: 'Client'
    })
        
    // Dropbox Pages
    .when('/dropbox', {
      templateUrl: 'Views/Application/dropbox.html',
      controller: 'Dropbox'
    })
            
        
    // Security - Add Key
    .when('/security/create', {
      templateUrl: 'Views/Security/Create/key.html',
      controller: 'Create'
    })    
    
    // Security - Change Key
    .when('/security/edit', {
      templateUrl: 'Views/Security/Edit/key.html',
      controller: 'Edit'
    })       
    
    // Security - Check Access Key
    .when('/security/validate', {
      templateUrl: 'Views/Security/validate.html',
      controller: 'Validate'
    })       
    
    // Security - Logout
    .when('/security/logout', {
      templateUrl: 'Views/Security/validate.html',
      controller: 'Logout'
    })           

   // Default to episode list if all else fails.                  
     .otherwise({
       redirectTo: '/episodes'
      });
       }]);