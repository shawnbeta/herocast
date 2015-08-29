describe('PlayerController', function() {
    var scope, $location, createController, controller;

    beforeEach(function(){
        module('hcApp');
    });

    beforeEach(inject(function ($rootScope, $controller) {
      $scope = $rootScope.$new();
      controller = $controller('PlayerController', {$scope: $scope});
        
    }));

    
    // toggleNowPlayingDetails()
    //it('should set now playing details to visible', function() {
    //    $scope.toggleNowPlayingDetails();
    //    expect($scope.nowPlayingDetails).toEqual(true);
    //});
    
    
});