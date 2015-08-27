hcMedia.service('Episode', [ function(){

	var Episode  = function(episode, subscriptions){
		if(episode){
			return this.buildModel(episode, subscriptions);
		}
		return this;
	};
		
	Episode.prototype.buildModel = function(episode, subscriptions){
	    
		this.id = parseInt(episode.id);
		this.title = episode.title;
		this.description = episode.description;
		this.src = episode.src;
		this.watched = parseInt(episode.watched);
		this.bookmark = parseFloat(episode.bookmark);
        this.pub_date = parseInt(episode.pub_date); 
        this.duration = parseInt(episode.duration); 
		this.create_date = parseInt(episode.create_date);
		this.modified_date = parseInt(episode.modified_date);				
		this.subscription_id = parseInt(episode.subscription_id);	

        if(episode.img){
          this.img = episode.img;  
        }else{ 
            this.img = subscriptions[this.subscription_id].img;
        }
        
		return this; 
	};
	
	Episode.prototype.setWatched = function(val){
	    this.watched = val;
	};
	
	return Episode;
}]); 
 
   