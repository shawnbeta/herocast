hcApp.directive('volumeAction', [ function() {
    
    var tpl = 
    '<button ng-click="volumeDown()">-</button>' +
    '<button ng-click="setVolumeTo(.1)">A</button>' +
    '<button ng-click="setVolumeTo(.4)">B</button>' +
    '<button ng-click="setVolumeTo(.6)">C</button>' +
    '<button ng-click="setVolumeTo(1)">D</button>' +
    '<button ng-click="volumeUp()">+</button>';

return {
    restrict : 'A',
    

    
    template: tpl
  };
}]);  
