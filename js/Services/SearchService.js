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

hcServices.service('Search', function() {

    this.searchiTunesDefaults = function($rootScope) {
        $rootScope.buttons = {
            'feed' : true,
            'youtube' : true,
            'searchyoutube' : true,
        };
        $rootScope.title = "Search iTunes";
    };

    this.searchYoutubeDefaults = function($rootScope) {
        $rootScope.buttons = {
            'searchitunes' : true,
            'youtube' : true,
            'searchyoutube' : true,
        };
        $rootScope.title = "Search Youtube";
    };

    this.searchiTunes = function($rootScope, $scope, $http) {
        $rootScope.loading = true;
        var formData = jQuery('.search').serialize();
        $http({
            method : 'POST',
            url : 'core/public/search/itunes',
            data : formData,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            $rootScope.loading = false;

            if (data.success) {
                $scope.results = data.results;
            }
        });
    };

    this.addiTunes = function($rootScope, $scope, $http, url, type) {
        $rootScope.loading = true;
        $http({
            method : 'POST',
            url : 'core/public/subscriptions/set',
            data : 'src=' + url + '&type=' + type + '&feed=set',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            $rootScope.loading = false;
            if (data.success) {
                $scope.results = data.results;
            }
        });
    };

    this.searchYoutube = function($rootScope, $scope, $http) {

        var formData = jQuery('.search').serialize();
        $rootScope.loading = true;
        $http({
            method : 'POST',
            url : 'core/public/search/youtube',
            data : formData,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            $rootScope.loading = false;
            if (data.success) {
                $scope.results = data.results;
            }
        });
    };

    this.addYoutube = function($rootScope, $scope, $http, channelId) {
        $rootScope.loading = true;
        $http({
            method : 'POST',
            url : 'core/public/subscriptions/set',
            data : 'src=' + channelId + '&type=youtube',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            $rootScope.loading = false;
            if (data.success) {
                $scope.results = data.results;
            }
        });
    };

    this.youTubeSearchDefaults = function() {
        $rootScope.buttons = {
            'favorites' : true,
            'podcasturl' : true,
            'youtube' : true,
            'searchitunes' : true,
        };
    };

});
