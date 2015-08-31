
    

describe('PlayerService', function() {
    var scope, $location, PlayerService;

    beforeEach(function(){
        module('hcMedia');
        module('hcUtilities');
        module('hcVendors');
    });

    beforeEach(inject(function (_PlayerService_) {
        PlayerService = _PlayerService_;

    }));

    // playAction()
    it('will set play action on player', function(){
       // Make an audio element
        var audioElement = document.createElement("audio");
        // Add a media file for the player to engage.
        audioElement.setAttribute('src', 'http://www.noiseaddicts.com/samples_1w72b820/274.mp3');
        var player = PlayerService.defaultPlayer(audioElement, 'audio');
        PlayerService.playAction(player);

        // Is the Audio playing?
        // Player not being tested.
        //expect(player.element.readyState);
        expect(player.status).toEqual(1);
        expect(player.toggleText).toBe('pause');
    });

    // defaultPlayer()
    it('will return a player object with props in place', function(){

        var audioElement = document.createElement("audio");
        var player = PlayerService.defaultPlayer(audioElement, 'audio');

        expect(player.element).toEqual(audioElement);
        expect(player.type).toEqual('audio');
    });

    // getExtension()
    it('will return the proper extension', function(){
        var ext = PlayerService.getExtension('afek.eksne.flsgfgweje.elsfg.dsdfsdf...ddsfaddf.dog');
        expect(ext).toEqual('dog');
    });



    // updateBookmark()
    it('episode bookmark should be set at 420', function() {
        var episode = {id: 1, bookmark: 0};
        PlayerService.updateBookmark(episode, 420);
        var rsp = JSON.parse(localStorage.getItem('e1'));
        expect(rsp.bookmark).toEqual(420);
    });
    

        
    
    
    
});