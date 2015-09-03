hcMedia.factory('OverlayService',
    ['$rootScope', '$interval', '$sce', 'EpisodeService', 'HelperService',
    function($rootScope, $interval, $sce, EpisodeService, HelperService){


    
    return {

        OverlayManager : {
            active: null, // The id of the active object.
            status : 0, // 0: hidden, 1: visible
            content: '', // The content to display inside the overlay
            mask: 0, // 0: hidden, 1: visible
            wrapperEle: jQuery('#overlayWrapper')
        },

        toggleOverlay : function(updateOverlayManager, episode){
            var om = {};
            // if the overlay is visible, hide it.
            if(this.OverlayManager.status == 1){
                om = this.unsetOverlayManager();
            }else{
                om = this.setOverlayManager(episode);
            }
                return updateOverlayManager(om);
        },

        setOverlayManager : function(episode){

            var om = this.OverlayManager;
            om.active = episode.id;
            om.status = 1;
            om.content = {
                title: episode.title,
                date: episode.pub_date,
                description: episode.description
            };
            om.mask = 1;
            //// Get the size of the viewport to adjust height
            //document.getElementById("overlayContent").style.height = HelperService.getViewportSize().h;

            return om;
        },

        unsetOverlayManager : function(){
            var om = this.OverlayManager;
            om.active = null;
            om.status = 0;
            om.content = '';
            om.mask = 0;
        }




        
    };
}]); 

  



 