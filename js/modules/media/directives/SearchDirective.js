hcMedia.directive('searchAction',['SearchService', function(SearchService) {
    var tpl = 
        '<input type="text" ng-model="rqst.keyword">' +
        '<label>iTunes</label><input type="checkbox" ng-model="rqst.itunesCheckbox">' +
        '<label>Youtube</label><input type="checkbox" ng-model="rqst.youtubeCheckbox">' +
        '<button ng-click="executeSearch()">Execute Search</button>';
    return {
        restrict : 'A',
        template: tpl
      };         
}]);

hcMedia.directive('searchDetail', [ function() {
    var tpl =
        '<span class="searchDetails" >' +
            '<span><label>Title: </label>{{searchDetails.title}}</span>' +
            '<span><label>description: </label>' +
                '<span ng-bind-html="searchDetails.description"></span>' +
            '</span>' +
            '<span><label>latest episodes: </label>' +
                '<span ng-repeat="episode in searchDetails.latestEpisodes">' +
                    '<span>{{episode.title}}</span>' +
                    '<span>{{episode.pub_date | date:"medium"}}</span>' +                
                '</span">' +
            '</span>' +
        '</span>';
    return {
        restrict : 'A',
        template: tpl
      };         
        
        
}]);

hcMedia.directive('searchSubscribe',[ function() {
    var tpl = 
        '<span class="searchAddForm">' +
            'Form goes here' +
            '{{addNewTitle}}' +
            '<input type="text" ng-model="searchAddSRC">' +
            '<select ng-model="subscriptionType" ng-options="item as item for item in options">' +
                '<button ng-click="addSubscription()">' +
            '</select>' +
            '<button ng-click="addSubscription()">Add Subscription</button>' +
        '</span>';
return {
  	restrict : 'A',  	
  	link: function(scope, e, attr){
        scope.options = [ 'audio', 'video'];
    },
  	template: tpl
  };  
}]);

hcMedia.directive('searchResults',['SearchService', function(SearchService) {
    var tpl = 
    //'{{searchResponse}}' + 
    '<div class="searchItem" ng-repeat="searchResult in searchResponse">' +
        '<span>{{searchResult.title}}</span>' +
        '<span><img src="{{searchResult.img}}"></span>' +
        '<span><button ng-click="getDetails(searchResult)">Details</button></span>' +
        '<span><button ng-click="subscribe(searchResult)">Subscribe</button></span>';
    '</div>';

return {
    restrict : 'E',
    
    template: tpl
  };    
}]);