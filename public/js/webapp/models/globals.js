(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 30,

      //-------------------------------------------//
      
      APP_READY:false,

      //-------------------------------------------//

      FACEBOOK_PAGE_ID              : "379432705492888",
      TWITTER_ID                    : "1922939570",

      POINTS_TO_EARN_A_TICKET       : 8,
      NB_POINTS_PER_TICKET          : 1,
      NB_POINTS_PER_TWEET           : 2,
      NB_POINTS_PER_POST            : 2,
      NB_POINTS_PER_LIKE            : 2,
      NB_POINTS_PER_FB_INVITATION   : 2,
      NB_POINTS_PER_THEME_LIKED     : 2,
      START_AVAILABLE_TICKETS       : 10,

      FACEBOOK_FAN_TICKETS          : 4,
      TWITTER_FAN_TICKETS           : 4,
      
      //-------------------------------------------//

      isDev          : window.location.hostname == "192.168.0.9",
      isProd         : window.location.hostname == "www.adillions.com",
      debug          : false,
      
      //-------------------------------------------//
      
      lotteries      :  "",

      //-------------------------------------------//

      // if login/signin clicked -> set true -> fb.init may open signinFromFB popup.
      // default : home -> false
      signinRequested    : false,

   });

   //------------------------------------------------------//

   App.Globals = Globals.create();

   //------------------------------------------------------//
  
})( App);
