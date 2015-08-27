hcMedia.filter('orderByPubDate', ['_', function(_) {
    return function(models, order) {
        return _.sortBy(models, 'pub_date', true).reverse();
    };
}]);

hcMedia.filter('filterBySubscription', function() {
    return function(models, subscriptionID) {
        return _.filter(models, function(model){
            return model.subscription_id == subscriptionID; 
        });
    };
});  