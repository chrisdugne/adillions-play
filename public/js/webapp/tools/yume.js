
//----------------------------------------------------------------//

window.Yume = window.Yume || {}

//----------------------------------------------------------------//

Yume.init = function() {

    this.yumeSDKInstance     = new YuMeHTML5SDK();
    this.yumeInitObj         = new YuMeHTML5SDKInitObject();

    //this value needs to be the same as the MedRect div's id
    this.yumeInitObj.cbMedRectDivId = "cb_medrect1_div";

    //this value needs to be the same as the MedRect frame's id
    this.yumeInitObj.cbMedRectIFrameId = "cb_medrect1_frame";

    // NOTE: For testing this can be set to "http://shadow01.yumenetworks.com/"
    this.yumeInitObj.adDomainUrl = "http://shadow01.yumenetworks.com/";

    // NOTE: For testing this should be set to "211DaVuJgGj"
    this.yumeInitObj.domainId = "211DaVuJgGj";

    this.yumeInitObj.prerollPlaylist = "dynamic_preroll_playlist.vast2xml?imu=medrect";

    //this value needs to be the same as the HTML5 video element's id on the page
    this.yumeInitObj.html5VideoId = "player";

    //this value needs to be the same as the HTML5 video div element's id on the page
    this.yumeInitObj.html5VideoDivId = "playerContainer";

    //this value needs to be the same as the anchor tag's id around the <video> element
    this.yumeInitObj.clickTagHRefId = "hRefClickTag";

    window.yume_adPlaying = false;
    this.yumeSDKInstance.yume_init(this.yumeInitObj);
}

window.yumeSDKAdEventListener = function  (yume_event, yume_eventInfo) {
    console.log(yume_event, yume_eventInfo)
    switch (yume_event) {
        
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_PRESENT:
            $("#pleaseWait").hide();
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_ABSENT:
            window.location.href = "/yume_novideo";
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_PLAYING:
            if(yume_eventInfo == "image_slate")
                window.location.href = "/yume_wrong_playing";
            else
                window.yume_adPlaying = true;
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_COMPLETED:
            window.location.href = "/yume_completed?status=" + window.yume_adPlaying;
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_ERROR:
            window.location.href = "/yume_error";
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_CLICKED2SITE:
            console.log("AD_CLICKED2SITE");
            //console.log("Received AD_CLICKED2SITE event from YuMe HTML5 Plug-in...");
            //do something
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_CLICKED2vIDEO:
            console.log("AD_CLICKED2vIDEO");
            //console.log("Received AD_CLICKED2VIDEO event from YuMe HTML5 Plug-in...");
            //do something
            break;

        case YuMeHTML5SDK.prototype.yume_adEvent.PIP_VIDEO_PLAYING:
            console.log("PIP_VIDEO_PLAYING");
            //console.log("Received PIP_VIDEO_PLAYING event from YuMe HTML5 Plug-in...");
            //do something
            break;
            
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_CB_IFRAME:
            console.log("AD_CB_IFRAME");
            //console.log("Received AD_CB_IFRAME event from YuMe HTML5 Plug-in..." + yume_eventInfo);
            //do something
            break;
            
        default:
            break;
    }
}

