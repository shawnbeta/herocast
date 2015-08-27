hcApp.controller('NavController', function($scope) {
    
    $scope.actions = [
        episodeButton = {
            title : 'Episodes',
            target: 'episodes',
            alt: 'View episodes'
        },
        subscriptionButton = {
            title : 'Subscriptions',
            target: 'subscriptions',
            alt: 'View subscriptions'
        },   
        searchButton = {
            title : 'Search',
            target: 'search',
            alt: 'Search'
        },  
        settingsButton = {
            title : 'Settings',
            target: 'settings',
            alt: 'Manage Settings'
        },                  
    ];
    
    $scope.episodeButton = {
    	title : 'Episodes',
    	target: 'episodes',
    	alt: 'View episodes'
    };
    
    $scope.subscriptionButton = {
    	title : 'Subscriptions',
    	target: 'subscriptions',
    	alt: 'View subscriptions'
    };   
     
    $scope.searchButton = {
    	title : 'Search',
    	target: 'search',
    	alt: 'Search'
    };    
    
    $scope.settingsButton = {
        title : 'Settings',
        target: 'settings',
        alt: 'Manage Settings'
    };        
});