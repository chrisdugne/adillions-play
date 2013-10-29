(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 67,

      //-------------------------------------------//
      
      APP_READY:false,

      //-------------------------------------------//

      isDev    : window.location.hostname == "maperial.localhost" || window.location.hostname == "192.168.0.9",
//      isLocal  : (window.location.hostname == "maperial.localhost" || window.location.hostname == "maperial.localhost.deploy") ,
      isProd    : window.location.hostname == "www.adillions.com",
      debug    : false,

      //-------------------------------------------//

      // if login/signin clicked -> set true -> fb.init may open signinFromFB popup.
      // default : home -> false
      signinRequested    : false,

   });

   //------------------------------------------------------//

   App.Globals = Globals.create();

   //------------------------------------------------------//
  
})( App);
