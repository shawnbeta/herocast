hcMedia.directive('episodes',['EpisodeService', function(EpisodeService) {
	var episodeDetails = 
    	'<span class="episodeDetails" ng-if="showDetails">' +
           '<span><label>Title: </label>{{episodeDetailer.title}}</span>' +
           '<span><label>description: </label>' +
           '<span ng-bind-html="episodeDetailer.description"></span></span>' +
           '<span><label>watched: </label>{{episodeDetailer.watched}}</span>' +
           '<span><label>bookmark: </label>{{episodeDetailer.bookmark}}</span>' +
           '<span><label>Pub Date: </label>{{episodeDetailer.pub_date}}</span>' +
           '<span><label>Create Date: </label>{{episodeDetailer.create_date}}</span>' +
           '<span><label>Modified Date: </label>{{episodeDetailer.modified_date}}</span>' +
       '</span>';
	var episodeItems = 
	'<ul>' +
        '<li class="episodeItem" ng-repeat="e in episodes|orderByPubDate" >' +
            '<span>{{e.title}}</span>' + 
            '<span>{{e.pub_date | date:"medium"}}</span>' + 
            '<span>{{e.id}}</span>' + 
            '<span>{{e.duration}}</span>' + 
            '<span><img src="{{e.img}}"</span>' + 
            '<span ng-controller="PlayerController">' +
            '<button ng-click="playPause(e)">{{isPlaying(e)}}</button>' +
            '<button ng-click="updateWatched(e)">{{isWatched(e)}}</button>' +
            '<button ng-click="playPause(e)">download</button>' +
            '<button ng-click="toggleDetails(e)">details</button>' +
            '<button ng-click="copyToServer(e)">copy</button>' +
            '</span>' +
        '</li>' +        
    '</ul>';
    

    
    var tpl = episodeDetails + episodeItems;
    
  return {
  	restrict : 'E',

  	link: function(scope, e, attr){  		
  		scope.isWatched = function(model){
  			return model.watched == 0 ? 'mark watched'  : 'mark unwatched';
  		};
  		
  		
  		scope.updateWatched = function(model){
  			model.watched = model.watched == 0 ? 1 : 0;
            EpisodeService.updateLocal(model);
            EpisodeService.updateRemote(model, 'watched', model.watched);
  		};
  		
  		scope.toggleDetails = function(model){
  		    if(scope.showDetails && scope.episodeDetailer == model)
  		        return scope.hideDescription();
  		    scope.setDetailer(model);
  		};
  		
  		scope.setDetailer = function(model){
  		    scope.episodeDetailer = model;
  		    scope.showDetails = true;
  		};
  		
        scope.hideDescription = function(){
            scope.episodeDetailer = {};
            scope.showDetails = false;
        };  		
  		
  		scope.copyToServer = function(episode){
  		  var rsp = EpisodeService.copyToServer(episode);  
  		  rsp.then(function(rsp){
  		     episode.src = rsp.data.url;
  		     EpisodeService.updateLocal(episode);
  		  });
  		};
  		
  	},
  	template: tpl
  };  
}]);