
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

    //yumeInitObj.domainId = "211DaVuJgGj";
    // NOTE: For testing this should be set to "211DaVuJgGj"
    this.yumeInitObj.domainId = "211DaVuJgGj";

    this.yumeInitObj.prerollPlaylist = "dynamic_preroll_playlist.vast2xml?imu=medrect";

    //this value needs to be the same as the HTML5 video element's id on the page
    this.yumeInitObj.html5VideoId = "player";

    //this value needs to be the same as the HTML5 video div element's id on the page
    this.yumeInitObj.html5VideoDivId = "playerContainer";

    //this value needs to be the same as the anchor tag's id around the <video> element
    this.yumeInitObj.clickTagHRefId = "hRefClickTag";

    console.log("yume init")
    this.yumeSDKInstance.yume_init(this.yumeInitObj);
}

window.yumeSDKAdEventListener = function  (yume_event, yume_eventInfo) {
    console.log("event ", yume_event);
    switch (yume_event) {
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_PRESENT:
            //console.log("Received AD_PRESENT event from YuMe HTML5 Plug-in...");
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_ABSENT:
            console.log("absent : no video");
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_PLAYING:
            console.log("Video playing");
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_COMPLETED:
            console.log("Video finished ");
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_ERROR:
            console.log("Received AD_ERROR event from0 YuMe HTML5 Plug-in, Error Info:" + yume_eventInfo);
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_CLICKED2SITE:
            //console.log("Received AD_CLICKED2SITE event from YuMe HTML5 Plug-in...");
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_CLICKED2vIDEO:
            //console.log("Received AD_CLICKED2VIDEO event from YuMe HTML5 Plug-in...");
            //do something
            break;

        case YuMeHTML5SDK.prototype.yume_adEvent.PIP_VIDEO_PLAYING:
            //console.log("Received PIP_VIDEO_PLAYING event from YuMe HTML5 Plug-in...");
            //do something
            break;
        case YuMeHTML5SDK.prototype.yume_adEvent.AD_CB_IFRAME:
            //console.log("Received AD_CB_IFRAME event from YuMe HTML5 Plug-in..." + yume_eventInfo);
            //do something
            break;
        default:
            break;
    }
}

