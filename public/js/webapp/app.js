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

   App.init = function(sponsorRequestId){

      window.location.hash = "/";      // landing forced on homepage + login 

      //------------------------------------------------------//
      //   App.youtubeManager = new YoutubeManager();
      LotteryManager.refreshNextLottery()
      LotteryManager.getFinishedLotteries()

      //------------------------------------------------------//

      var failure    = function(){
         App.loginAdillions()
      }

      var finalize   = function(){  
         App.Globals.APP_READY = true
      }

      Facebook.init({
         finalizeInit            : finalize,
         notConnectedCallback    : failure, 
         sponsorRequestId        : sponsorRequestId
      })
   }

   //------------------------------------------------------//

   App.loginAdillions = function(force){

      if(!$.cookie('facebookId') || force){
         $.removeCookie('facebookId')  
         UserManager.getPlayer();
      }
      else{
         // le authToken est lié à un compte FB : ne pas logguer le mec, il est deco de FB ! (donc pas de getPlayer)
         // delete authToken
         $.removeCookie('authToken');
      } 
   }
   
   //------------------------------------------------------//
   
   App.fillView = function(){
      if(($("#webappDiv").height() + App.Globals.FOOTER_HEIGHT) <= $(window).height()){
         $("#webappDiv").css({ "height" : ($(window).height() - App.Globals.FOOTER_HEIGHT - App.Globals.HEADER_HEIGHT) +"px" });
      }
   }

   //------------------------------------------------------//
   
   App.applyResize = function (){
      // Haven't resized in 100ms!
      App.fillView()
   }   

   var doit
   $(window).on("resize", function(){
      clearTimeout(doit);
      doit = setTimeout(App.applyResize, 100);   
   });
   
   //------------------------------------------------------//
   
   App.showSocialButtons = function (){
      $("#twitterFollowButtonContainer").append( $("#twitterFollowButton") );
      $("#facebookFollowButtonContainer").append( $("#facebookFollowButton") );
      $("#twitterShareButtonContainer").append( $("#twitterShareButton") );
   }
   
   App.hideSocialButtons = function (){
      $("#socialContainer").append( $("#twitterFollowButton") );
      $("#socialContainer").append( $("#facebookFollowButton") );   
      $("#socialContainer").append( $("#twitterShareButton") );
   }
   
   //------------------------------------------------------//

   App.authToken = $.cookie("authToken")

   //------------------------------------------------------//

})( this );

