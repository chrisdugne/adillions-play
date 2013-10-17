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
// App.youtubeManager = new YoutubeManager();

   LotteryManager.refreshNextLottery()
   
   //------------------------------------------------------//

   var failure    = function(){
      if(!$.cookie('facebookId')){
         UserManager.getPlayer();
      }
      else{
         // le authToken est lié à un compte FB : ne pas logguer le mec, il est deco de FB ! (donc pas de getPlayer)
         // delete authToken
         $.removeCookie('authToken');
      } 
   }

   var finalize   = function(){  
      App.Globals.APP_READY = true 
   }

   Facebook.init(finalize, failure)

   //------------------------------------------------------//
  
})( App);
