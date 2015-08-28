hcApp.directive('nowPlaying', ['PlayerService', function(PlayerService) {
    
    var tpl = 'Now Playing: {{nowPlaying.title}}'+
        '{{subscription}}' +
    '<div>Time:{{counter.hours}}:{{counter.minutes}}:{{counter.seconds}}</div>' +
        //'<audio ng-if="type == \'audio\'" src="{{currentFile}}"></audio>' +
        //'<video ng-if="type == \'video\'" src="{{currentFile}}"></video>' +
    '<button ng-click="setBookmark(nowPlaying)">bookmark</button>' +
    '<button ng-click="playPause(nowPlaying)">{{playPauseToggle}}</button>' +
    '<button ng-click="jumpBack()">Jump Back</button>' + 
    '<button ng-click="rewind()">RR</button>' +    
    '<button ng-click="forward()">FF</button>' +
    '<button ng-click="jumpAhead()">Jump Ahead</button>' +
    '<button ng-click="toggleNowPlayingDetails()">description</button>' +
    '<span ng-if="currentPlayer.showDetails">' +
        '{{nowPlaying.description}}' + 
        '{{nowPlaying.pub_date}}' + 
    '</span>' +    
    '<div slider class="slider" min="0" max="9001" step="100">' +  
      '<span></span>' +  
    '</div>';
    

return {
    restrict : 'A',
    
//    link: function(scope, element, attrs){
//
//
//
//        // Linking function.
//        var $element = angular.element(element);
//        //var $bar = angular.element('span', $element);
//        var step = attrs.step;
//
//        var width;
//        var offset;
//
//        var mouseDown = false;
//        element.on('mousedown touchstart', function(evt) {
//            mouseDown = true;
//            if (!width) {
//                width = $element.width();
//            } if (!offset) {
//                offset = $bar.offset().left;
//            }
//        });
//
//        element.on('mouseup touchend', function(evt) {
//            mouseDown = false;
//        });
//
//        // Throttle function to 1 call per 25ms for performance.
//        element.on('mousemove touchmove', _.throttle(function(evt) {
//            if (!mouseDown)
//                // Don't drag the slider on mousemove hover, only on click-n-drag.
//                return;
//
//            // Calculate distance of the cursor/finger from beginning of slider
//            var diff;
//            if (evt.pageX) {
//                diff = evt.pageX - offset;
//            } else {
//                diff = evt.originalEvent.touches[0].pageX - offset;
//            }
//    // Allow dragging past the limits of the slider, but impose min/max values.
//    if (diff < 0) {
//        scope.sliderValue = attrs.min;
//        $bar.width('0%');
//    } else if (diff > width) {
//        scope.sliderValue = attrs.max;
//        $bar.width('100%');
//
//    // Set the value to percentage of slider filled against a max value.
//    } else {
//        var percent = diff / width;
//        $bar.width(percent * 100 + '%');
//        scope.sliderValue = Math.round(percent * attrs.max / step) * step;
//    }
//
//    // Let all the watchers know we have updated the slider value.
//    scope.$apply();
//}, 25));
//
//        scope.$watch('sliderValue', function(sliderValue) {
//            $bar.width(sliderValue / attrs.max * 100 + '%');
//        });
//
//
//},
    
    template: tpl
  };
}]);  

/*hcApp.directive('playerCounter', ['$interval', 'dateFilter', 
    function($interval, dateFilter) {
    
    return function(scope, element, attr){
 
      
      var format, stopTime;
      
      function updateCounter(){
          element.text(dateFilter(new Date(), format));
      }
      
    /*scope.$watch(attr.playerCounter, function(value) {
        format = value;
        updateCounter();
    });
   
    
    stopTime = $interval(updateCounter, 1000);
    
    element.on('$destroy', function(){
       $interval.cancel(stopTime); 
    });
        
    };
   
}]);*/





    