(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 67,

      //-------------------------------------------//
      
      APP_READY:false,

      //-------------------------------------------//

//      isDev    : window.location.hostname == "maperial.localhost",
//      isLocal  : (window.location.hostname == "maperial.localhost" || window.location.hostname == "maperial.localhost.deploy") ,
      debug    : false,

      //-------------------------------------------//

      // if login/signin clicked -> set true -> fb.init may open signinFromFB popup.
      // default : home -> false
      signinRequested    : false,

   });

   //------------------------------------------------------//

   App.Globals = Globals.create();
//   App.youtubeManager = new YoutubeManager();
   
   var failure    = function(){  UserManager.getPlayer()  }
   var finalize   = function(){  console.log("Facebook.init. finalize "); App.Globals.APP_READY = true }
   
   Facebook.init(finalize, failure)
   
   //------------------------------------------------------//
   // create footer email

   var guymal_enc= "ncjjiFkgvho`(eik";
   var email = "";
   for(var i=0;i<guymal_enc.length;++i)
   {
      email += String.fromCharCode(6^guymal_enc.charCodeAt(i));
   }

   App.Globals.set("contactEmail", email);
  
})( App);
