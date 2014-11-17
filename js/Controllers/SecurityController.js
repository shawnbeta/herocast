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

hcControllers.controller('Create', ['$rootScope', '$scope', '$http', 'Security',
  function($rootScope, $scope, $http, Security) {
		Security.createDefaults($rootScope);
		$scope.createKey = function(){
		  Security.createKey($rootScope, $scope, $http);
		};	
	}
]);

hcControllers.controller('Edit', ['$rootScope', '$scope', '$http', 'Security',
  function($rootScope, $scope, $http, Security) {
		Security.changeDefaults($rootScope, $http);
		$scope.changeKey = function(){
		  Security.changeKey($rootScope, $http);
		};
	}
]);

hcControllers.controller('Validate', ['$rootScope', '$scope', '$http', 'Security', 'Application', 'Subscription',
  function($rootScope, $scope, $http, Security, Application, Subscription) {
    Security.validateDefaults($rootScope);
    $scope.validateKey = function(){
		  Security.validateKey($rootScope, $scope, $http, Application, Subscription);
		};	
	}
]);


hcControllers.controller('Client', ['$rootScope', '$scope', '$http', 'Security',
  function($rootScope, $scope, $http, Security) {
        Security.clientDefaults($rootScope);
        Security.getClients($rootScope, $http);
        $scope.deleteClient = function(id){
          Security.deleteClient($rootScope, $http, id);
        };
    }
]);

hcControllers.controller('Logout', ['$rootScope', '$http', 'Application', 'Security',
  function($rootScope, $http, Application, Security) {
		Security.logout($rootScope, $http, Application);
	}
]);