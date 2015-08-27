hcMedia.filter('orderByTitle', ['_', function(_) {
	return function(models, order) {
		return _.sortBy(models, 'title');
	};
}]); 