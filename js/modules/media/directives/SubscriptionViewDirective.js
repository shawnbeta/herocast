hcMedia.directive('subscriptions', function($rootScope) {
	var tpl = 
	'<ul>' +
		'<li class="subscriptionItem" ng-repeat="s in subscriptions|orderByTitle">' +
			'<span>{{s.title}}</span></span>' +	
            '<span><img src="{{s.img}}"></span>' +
            '<span>' +
    			'<button ng-click="setAutoDownload(s)">{{downloadToggle(s)}}</button>' +
    			'<button ng-click="doRemove(s)">Remove</button>' +
            '</span>' +
		'</li>' +
	'</ul>';
  return {
  	restrict : 'E',

  	link: function(scope, e, attr){

  		scope.setAutoDownload = function(model){
  			model.auto_download = model.auto_download !=1 ? 1  : 0;
  			model.updateAutoDownload(model);
  		};
  		
  		scope.downloadToggle = function(model){
  			return model.auto_download !=1 ? 'AutoDownload'  : 'Stop AutoDownload';
  		};

		/*scope.doRemove = function(model){
		    var secondScope = {
                episodes: angular.copy($rootScope.episodes),
                subscriptions: angular.copy($rootScope.subscriptions)
		    };
			var rsp = model.remove(model, secondScope);
            $rootScope.episodes = rsp.episodes;
            $rootScope.subscriptions = rsp.subscriptions;
		};*/
		
		scope.doRemove = function(model){
            var rsp = model.remove(model, $rootScope.subscriptions, $rootScope.episodes);
            $rootScope.episodes = rsp.episodes;
            $rootScope.subscriptions = rsp.subscriptions;		  
		};
		
		
		
  	}, 
  	template: tpl
  };
});