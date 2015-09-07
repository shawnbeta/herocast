hcMedia.factory('SearchService', ['Episode', '$http', '$rootScope',
function(Episode, $http, $rootScope) {
    return {
        executeSearch : function(scope) {
            console.log(scope.rqst);
            var url = '../../api/index.php?entity=search&action=all' +
                '&keyword=' + scope.rqst.keyword +
                '&itunes=' + scope.rqst.itunesCheckbox +
                '&youtube=' + scope.rqst.youtubeCheckbox;
            return $http.get(url).success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                if (data.success) {
                    return data.rsp;
                };
            }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        },
        
        getDetails : function(rsp, searchResult) {
                if(rsp.data.description)
                    searchResult.description = rsp.data.description;
                searchResult.latestEpisodes = rsp.data.episodes;
               return searchResult;
        },
        
        requestDetails : function(searchResult){
            if(searchResult.description && searchResult.latestEpisodes)
                return false;
            var url = '../../api/index.php?entity=search&action=details' +
                '&src=' + searchResult.src;
            return $http.get(url);                
        }
        
    };
}]);
