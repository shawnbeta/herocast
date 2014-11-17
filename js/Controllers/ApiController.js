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

hcControllers.controller('Dropbox', ['$rootScope', '$scope', '$http', 'Security', 'GetSecurityData', 'dbx',
function($rootScope, $scope, $http, Security, GetSecurityData, dbx) {
    GetSecurityData.async().then(function(d) {
        Security.checkSecurityData($rootScope, $http, d.data);
    });

    dbx.setDefaults($rootScope, $scope);

    dbx.checkAccess($rootScope, $scope, $http);

    // Authorize the token
    $scope.authorize = function() {
        dbx.authorize($rootScope, $scope, $http);
    };

}]); 