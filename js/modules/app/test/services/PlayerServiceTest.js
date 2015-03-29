
    

describe('PlayerService', function() {
    var scope, $location, PlayerService;

    beforeEach(function(){
        module('hcApp');
    });

    beforeEach(inject(function ($rootScope, _PlayerService_) {
        PlayerService = _PlayerService_;

    }));

    
    // updateBookmark()
    it('episode bookmark should be set at 420', function() {
        var episode = {id: 1, bookmark: 0};
        PlayerService.updateBookmark(episode, 420);
        var rsp = JSON.parse(localStorage.getItem('e1'));
        expect(rsp.bookmark).toEqual(420);
    });
    

        
    
    
    
});