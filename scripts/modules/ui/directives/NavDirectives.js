hcApp.directive('actionItem', function() {
  return {
  	restrict : 'E',
  	scope : {
  		link: '=view'
  	},
  	
  	templateUrl: 'js/modules/app/templates/navLink.html'
  };
});  