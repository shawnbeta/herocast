hcMedia.directive('subscriptionAction', function($rootScope, $filter) {
    
        var tpl = 
        '<ul>' +
            '<li><a ng-class="{\'selected\': activeSubscription == 0}"' +
                'ng-click="listAllEpisodes()">All Episodes</a></li>' +
            '<li ng-repeat="s in subscriptions| orderByTitle">' +
                '<a ng-class="{\'selected\': activeSubscription == s.id}"' +
                    'ng-click="episodesBySubscription(s)">' +
                '{{s.title}}' + 
                '</a>' +
            '</li>' +
        '</ul>';
      return {
        restrict : 'A',
        //scope : true,
        template: tpl,
        link: function(scope, e, attr){
            var allEpisodes;
            scope.episodesBySubscription = function(subscription){
                scope.activeSubscription = subscription.id;
                // Make a copy of the original 
                if(!$rootScope.episodeClone)
                    $rootScope.episodeClone = $rootScope.episodes;                
                var episodeClones = angular.copy($rootScope.episodeClone);
                $rootScope.episodes = 
                    $filter('filterBySubscription')(episodeClones, subscription.id);
            };
            scope.listAllEpisodes = function(){
                scope.activeSubscription = 0;
                $rootScope.episodes =  $rootScope.episodeClone;
            };            
            
        },
      };
});