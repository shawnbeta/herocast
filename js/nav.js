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

function doMenu($rootScope, $scope){
    if(!$rootScope.showMenu){
        showMask($rootScope);
        openMenu($rootScope);
    }else{
        closeMask($rootScope);
        closeMenu($rootScope);
    }
    
}

function doSubscriptions($rootScope, $scope){
    if(!$rootScope.showSubscriptions){
        showMask($rootScope);
        openSubscriptions($rootScope);
    }else{
        closeMask($rootScope);
        closeSubscriptions($rootScope);
    }
}

// Clicking the mask should close everything
function doMask($rootScope, $scope){
    
    closeMenu($scope);
    
    closeSubscriptions($scope);
    
    closeMask($rootScope);
    
    closeOverlay($rootScope);
}

function openMenu($rootScope){
    $rootScope.showMenu = true;
    jQuery(".primary").animate({
        left : 0
      });
}

function closeMenu($rootScope){
    $rootScope.showMenu = false;
    jQuery(".primary").animate({
      left : '-325px'
    });
}

function openSubscriptions($rootScope){
    $rootScope.showSubscriptions = true;
    jQuery(".subscriptions").animate({
        right : 0
      });
}

function closeSubscriptions($rootScope){
    $rootScope.showSubscriptions = false;
    jQuery(".subscriptions").animate({
      right : '-320px'
    });
}

function showMask($rootScope){
    $rootScope.showMask = true;
}

function closeOverlay($rootScope){
    $rootScope.showOverlay = false;
}

function closeMask($rootScope){
    $rootScope.showMask = false;
}

function doOverlay($rootScope){
	$rootScope.showMask = !$rootScope.showMask;
	$rootScope.showOverlay = $rootScope.showOverlay;
	
};


