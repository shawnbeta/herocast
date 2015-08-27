hcMedia.service('Subscription', [function(){

	var Subscription = function(data){
		if(data){
			return this.buildModel(data);
		}
		return this;
	};
		
	Subscription.prototype.buildModel = function(data){
		this.id =  parseInt(data.id);
		this.title = data.title;
		this.description = data.description;
		this.src = data.src;
		this.img = data.img;
		this.subscription_type = data.subscription_type;
		this.home_page = data.home_page;
		this.auto_download = parseInt(data.auto_download);
		this.create_date = parseInt(data.create_date);
		this.modified_date = parseInt(data.modified_date);				
		return this; 
	};

	Subscription.prototype.setAutoDownload = function(val){
		this.autoDownload = val;
	};	
	
	 
	return Subscription;
}]); 
 
   