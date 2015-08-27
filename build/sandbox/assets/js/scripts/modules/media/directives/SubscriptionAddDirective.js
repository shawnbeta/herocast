hcMedia.directive('subscriptionAdd', function($rootScope) {
    var tpl =
    '<input type="text" ng-model="src">' +
    '<select ng-model="subscriptionType" ng-options="item as item for item in options">' +
    '</select>' +
    '<a ng-click="add()">+</a>';
  return {
    restrict : 'A',

    link: function(scope, e, attr){
        scope.subscriptionType = 'audio';
        scope.options = [ 'audio', 'video', 'green' ];

    },
    template: tpl
  };
});