(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 67,

      //-------------------------------------------//
      
      FACEBOOK_APP_ID      : "170148346520274",
      FACEBOOK_APP_SECRET  : "887e8f7abb9b1cb9238a097e06585ae2",

      //-------------------------------------------//
      
      APP_READY:false,

      //-------------------------------------------//

      isDev    : window.location.hostname == "maperial.localhost",
      isLocal  : (window.location.hostname == "maperial.localhost" || window.location.hostname == "maperial.localhost.deploy") ,
      debug    : false,

      //-------------------------------------------//

   });

   //------------------------------------------------------//

   App.Globals = Globals.create();
   App.youtubeManager = new YoutubeManager();
   
   Facebook.init()
//   UserManager.getPlayer()
   
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
