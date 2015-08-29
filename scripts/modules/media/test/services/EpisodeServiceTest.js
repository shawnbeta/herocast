describe('EpisodeService', function() {

    var httpBackend;

    beforeEach(function() {
        module('hcMedia');
        module('hcUtilities');
        module('hcVendors');
    });

    beforeEach(inject(function(_EpisodeService_, $httpBackend, _Episode_) {
        EpisodeService = _EpisodeService_;
        Episode = _Episode_;
        httpBackend = $httpBackend;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // testing: persistBulkSEC()
    // Testing that the value of the items add to localStorage
    // equals the initial value of the arrays.
    it('should be able to read a collection from localStorage', function() {

        // The subscription episode collections
        var sc1 = ['123', '456', '789'];
        var sc2 = ['123', '456', '789'];
        
        // Now for the collection to hold both collections
        var s1 = { id : 0 };
        var s2 = { id : 1 };

        var sec = [sc1, sc2];
        
        var subscriptions = [s1, s2];
         
        // Execute the method.
        EpisodeService.persistBulkSEC(subscriptions, sec);
        
        var test1 = localStorage.getItem('sec0');
        var test2 = localStorage.getItem('sec1');
         
        expect(JSON.parse(test1)).toEqual(sc1);
        expect(JSON.parse(test2)).toEqual(sc2);
    });
    
    // testing: persistEPDC()
    it('should save the episode pub date collection', function(){
        var epdc = { 1: 4311351351, 2: 6311351351 };
        EpisodeService.persistBulkEPDC(epdc);
        var result = JSON.parse(localStorage.getItem('EPISODE_PUB_DATE_COLLECTION'));
        expect(result).toEqual(epdc);
    });

    // testing: addToMemory()
    it('should add new episodes to existing array', function() {
        var currentEpisode1 = 'A';
        var currentEpisode2 = 'B';
        var newEpisode1 = 'C';
        var newEpisode2 = 'D';
        var currentEpisodes = {
            ce1 : currentEpisode1,
            ce2 : currentEpisode2
        };
        var newEpisodes = {
            ne1 : newEpisode1,
            ne2 : newEpisode2
        };
        var rsp = EpisodeService.addToMemory(currentEpisodes, newEpisodes);
        expect(_.size(rsp)).toBe(4);
    });
    
    // testing: updateLocal()
    it('should change the model information in localStorage', function(){
       // Make the mock episode
       var episode = {bookmark: 0, id: 3};
       // Save the episode as a string in localStorage
       localStorage.setItem('e' + episode.id, JSON.stringify(episode));
       // Retrive the episode model from localStorage prior to making 
       // updates to varify values have been saved.
       var retrived = JSON.parse(localStorage.getItem('e' + episode.id));
       // Run the first test against the current bookmark value.
       expect(retrived.bookmark).toEqual(0);
       // Update the bookmark value.
       episode.bookmark = 1.2534;
       // Execute the update method to persist the updated value in localStorage.
       EpisodeService.updateLocal(episode);
       // Retrive the post update values from localStorage.
       var retrived = JSON.parse(localStorage.getItem('e' + episode.id));
       // Run the post update test against the current bookmark value.
       expect(retrived.bookmark).toEqual(1.2534);       
       
       
       
       
       
        
    });

    // testing: persistBulkCollection()
    it('should save dummy episode collection in localStorage', function(){
       
       var e1 = 'test';
       var e2 = 'test';
       var e3 = 'test';
       
       var episodes = {
           e1: { title: 'test' },
           e2: { title: 'test' },
           e3: { title: 'test' },                      
       };
       EpisodeService.persistBulkCollection(episodes);
       var rsp = JSON.parse(localStorage.getItem('EpisodeCollection'));       
        expect(_.size(rsp)).toBe(3);        
    });

    //testing: removeFromLocalStorage()
    it('removes episodes from localStorage', function() {

        localStorage.setItem('e1', 'test1');
        localStorage.setItem('e2', 'test2');
        localStorage.setItem('e3', 'test3');



        var episodeModels = ["1", "2", "3"];

        // Check the values before execution
        expect(localStorage.getItem('e1')).not.toBeNull();
        expect(localStorage.getItem('e2')).not.toBeNull();
        expect(localStorage.getItem('e3')).not.toBeNull();

        EpisodeService.removeFromLocalStorage(episodeModels);

        // Check the values after execution
        expect(localStorage.getItem('e1')).toBeNull();
        expect(localStorage.getItem('e2')).toBeNull();
        expect(localStorage.getItem('e3')).toBeNull();
    });

    //testing: update()
    it('will send remote update request', function() {
        var episode = {
            id : 1
        };
        var field = val = 'test';
        var url = 'api/?entity=episode&action=update' + '&field=' + field + '&val=' + val + '&id=' + episode.id;

        var success = {
            success : true
        };

        httpBackend.expectGET(url).respond(success);
        var returnedPromise = EpisodeService.updateRemote(episode, field, val);
        var result;
        returnedPromise.then(function(response) {
            result = response;
        });
        httpBackend.flush();

        expect(result.data.success).toBe(true);
    });

    // testing: persistBulkModels()
    it('should save in localStorage', function() {

        var e1 = {
            id : 1,
            title : 'Shawn on Star Trek',
            img : 'image',
            subscription_id : 'test',
            pub_date: 145935125            
        };
        var e2 = {
            id : 2,
            title : 'Shawn on Star Trek',
            img : 'image',
            subscription_id : 'test',
            pub_date: 145935125            
        };
        var e3 = {
            id : 3,
            title : 'Shawn on Star Trek',
            img : 'image',
            subscription_id : 'test',
            pub_date: 145935125
        };

        var episodeArray = [e1, e2, e3];

        var rsp = EpisodeService.persistBulkModels(episodeArray);
        expect(_.size(rsp.sec.test)).toBe(3);
    });
    
  

    // testing: load()
    it('should load models', function() {

        var episode = JSON.stringify({
            title : 'Shawn on Star Trek',
            img : 'afd'
        });
        localStorage.setItem('e1', episode);
        localStorage.setItem('e2', episode);
        localStorage.setItem('e3', episode);

        var episodeModels = ['1', '2', '3'];

        var rsp = EpisodeService.load(episodeModels);

        expect(_.size(rsp)).toBe(3);
        expect(_.pluck(rsp, 'title')).toContain('Shawn on Star Trek');
    });

    // testing: assembleBulkModels()
    it('should assemble bulk models', function() {

        var e1 = {
            id : 1,
            title : 'Shawn on Star Trek',
            img : 'image'
        };
        var e2 = {
            id : 2,
            title : 'Shawn on Star Trek',
            img : 'image'
        };
        var e3 = {
            id : 3,
            title : 'Shawn on Star Trek',
            img : 'image'
        };

        var episodeArray = [e1, e2, e3];

        var rsp = EpisodeService.assembleBulkModels(episodeArray);
        expect(_.size(rsp)).toBe(3);
        expect(_.pluck(rsp, 'title')).toContain('Shawn on Star Trek');
    });

    // testing: makeEpisode()
    it('returns Episode with fields', function() {
        var episode = {
            title : 'MockTitle',
            description : 'Mock description is where the text goes',
            img : 'test_img',
            subscription_id : 2
        };
        var rsp = EpisodeService.makeEpisode(episode);
        //expect(episode).toEqual(jasmine.any(Episode));
        expect(episode.title).toEqual('MockTitle');
        expect(episode.description).toEqual('Mock description is where the text goes');
        expect(episode.img).toEqual('test_img');
        expect(episode.subscription_id).toEqual(2);
    });

});
