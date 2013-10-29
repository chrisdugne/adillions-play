(function( win ) {
   'use strict';
   
   win.App = null 
   win.App = Ember.Application.create({
      VERSION: '1.0',
      rootElement: '#webappDiv',
      //storeNamespace: 'todos-emberjs',
      // Extend to inherit outlet support
      ApplicationController: Ember.Controller.extend(),
      ready: function() {
         //	initialisation is done inside model.Globals
      }
   });
   
   //------------------------------------------------------//
   
   App.Page = Em.Route.extend({
       enter: function(router) {
          window.scrollTo(0, 0);
       }
   });
   
   //------------------------------------------------------//
   
   App.init = function(){

      //------------------------------------------------------//
      //   App.youtubeManager = new YoutubeManager();
      LotteryManager.refreshNextLottery()
      
      //------------------------------------------------------//

      var failure    = function(){
          
         console.log("FB failure")
         if(!$.cookie('facebookId')){

            console.log("getplayer")
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
      
   }
   
   //------------------------------------------------------//
   
   App.fillView = function(){
      if(($("#webappDiv").height() + App.Globals.FOOTER_HEIGHT) <= $(window).height()){
         $("#webappDiv").css({ "height" : ($(window).height() - App.Globals.FOOTER_HEIGHT) +"px" });
      }
   }

   //------------------------------------------------------//

   $(window).on("resize", function(){
      App.fillView()
   });
   
   //------------------------------------------------------//

   App.authToken = $.cookie("authToken")

   //------------------------------------------------------//

})( this );

