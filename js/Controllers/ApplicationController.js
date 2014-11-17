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

var hcControllers = angular.module('hcControllers', ['ngSanitize']);

hcControllers.controller('Application', [
    '$rootScope', 
    '$scope', 
    '$http', 
    '$sce', 
    'GetSecurityData', 
    'Security', 
    'Application', 
    'Player', 
    'Subscription', 
    'Episode',

function($rootScope, $scope, $http, $sce, GetSecurityData, Security, Application, Player, Subscription, Episode) {
    GetSecurityData.async().then(function(d) {
        Security.checkSecurityData($rootScope, $http, d.data);
    });

    //Set the defaults
    Application.setDefaults($rootScope);

    //Get the primary Menu
    Application.getPrimary($rootScope, $http);

    //Get subscriptions (empty by default)
    Subscription.get($rootScope, $http);

    // Get Config Data
    Application.getConfig($rootScope, $http);

    $scope.goBack = function() {
        window.history.back();
    };

    //$rootScope.showMenu = false;
    $rootScope.showSubscriptions = false;

    $rootScope.doMenu = function() {
        doMenu($rootScope, $scope);
    };

    $scope.doSubscriptions = function() {
        doSubscriptions($rootScope, $scope);
    };

    $scope.doMask = function() {
        doMask($rootScope, $scope);
    };

    $rootScope.fastForward = function(id) {
        Player.fastForward(id);
    };

    $rootScope.rewind = function(id) {
        Player.rewind(id);
    };

    $rootScope.bookmark = function(player, id) {
        Episode.bookmark($rootScope, $http, player, id);
    };

}]);

function setSize() {
    w = $(window).width();
    if (w < 481) {
        //alert('small')
        st = $('span.title');
        value = st.text();

        st.text(value.substr(0, 1) + '...');
    }
}

function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
