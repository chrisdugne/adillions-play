
(function() {
	'use strict';

	var GameController = Ember.ObjectController.extend({});

	//==================================================================//

	GameController.renderUI = function(){
	    App.Globals.signinRequested = true // reach /game directly : FB landing page, must use signinFBWindow
	    UserManager.setupForms()

	    GameManager.init()
	    GameManager.setSelectedButton()

	    App.showSocialButtons()

	    Facebook.checkThemeLiked()
	}

	GameController.cleanUI = function()	{
	    App.hideSocialButtons()
	}

	//==================================================================//

	GameController.gameHomeReady = function()	{
	}

	//==================================================================//

	GameController.startTicket = function()	{

	   var next = function(){
         App.get('router').transitionTo('game.fillLotteryTicket')
      }
	   
	   if(App.user.extraTickets > 0){
	      App.message(App.translations.messages.ExtraTicket + "!")
	      next()
	   }
	   else{
	      GameController.requireVideo(next) 
	   }

	}
	
	//==================================================================//
	
	GameController.shareFacebook = function(afterVideoSeen)	{
	   if(!App.user.hasPostOnFacebook){
	      
	      var message = App.user.sponsorCode; 
         
	      Facebook.postOnWall(message, function(){
            
            App.message("+ " + App.Globals.NB_POINTS_PER_POST + " Pts !");
            App.user.set("currentPoints", App.user.currentPoints + App.Globals.NB_POINTS_PER_POST)
            App.user.set("hasPostOnFacebook", true)
            
            UserManager.updatePlayer()
         })
      }
	   else{
	      App.message(App.translations.messages.HasPostOnFacebook)
	   }
	}

	//==================================================================//

	GameController.requireVideo = function(afterVideoSeen)	{

	   if(App.Globals.isDev){
	      afterVideoSeen()
	      return
	   }

	   GameController.sponsorpay = new SPONSORPAY.Video.Iframe({
	      
	      appid:           '16913', 
	      uid:             App.user.uid,
	      height:          700,
	      width:           700,
	      display_format:  'bare_player',
	      
	      callback_on_start: function(offer) { 
	         GameController.sponsorpay.showVideo();
	      },
	      
	      callback_no_offers: function(){ 
	         App.message("_No video to watch...")
	         App.free()
	      },
	      
	      callback_on_close: function(){ 
	         console.log("on close")
	         App.free()
	      },
	      
	      callback_on_conversion: function(){ 
	         console.log("on conversion")
	         afterVideoSeen()
	      }
	      
	   });

	   GameController.sponsorpay.backgroundLoad();
	   App.lock()
	}

	//==================================================================//
	// Controls

	App.GameController = GameController;

	//==================================================================//
	// Routing

	App.GameRouting = App.Page.extend({
		
	   //---------------------------------
	   
	    route: '/game',

	    //---------------------------------

	    gameHome: Ember.Route.extend({
	        route: '/',
	        connectOutlets: function(router) {
	            App.Router.openComponent(router, "game");
	            GameManager.setSelectedButton()
	        }
	    }),

	    myTickets: Ember.Route.extend({
	        route: '/tickets',
	        connectOutlets: function(router) {
	            App.Router.openComponent(router, "game");
	            GameManager.setSelectedButton()
	        }
	    }),

	    profile: Ember.Route.extend({
	        route: '/profile',
	        connectOutlets: function(router) {
	            App.Router.openComponent(router, "game");
	            GameManager.setSelectedButton()
	        }
      }),
      
      //---------------------------------
      
      fillLotteryTicket: Ember.Route.extend({
         route: '/numbers',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      selectAdditionalNumber: Ember.Route.extend({
         route: '/luckyball',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      confirmation: Ember.Route.extend({
         route: '/confirmation',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      //---------------------------------
		
		connectOutlets: function(router){
			App.Router.openPage(router, "game");
		},

      //-----------------------------------//
      // actions
		
		requireNewTicket        : function() {

		   if(UserManager.hasTicketsToPlay()){
		      if(UserManager.checkTicketTiming()) {
		         GameController.startTicket()
		      }
		   }
		   else{
		      $("#noMoreTicketsWindow").reveal({
		         animation: 'fade',
		         animationspeed: 100, 
		      });         
		   }
		},		
      
      openGameHome            : Ember.Route.transitionTo('game.gameHome'),		
      openMyTickets           : Ember.Route.transitionTo('game.myTickets'),		
      openProfile             : Ember.Route.transitionTo('game.profile'),
      upgradeProfile          : function(){
         App.Router.closePopup()
         App.get('router').transitionTo('game.profile')
      },
      

      likeTheme               : function(){
         Facebook.likeTheme()
      },
      
      inviteFacebook         : function(){
         Facebook.inviteFriends()
      },
      
      shareFacebook         : function(){
         GameController.shareFacebook()
      },

      openInvite         : function(){
         App.Router.closePopup()
         $("#inviteFriendsWindow").reveal({
            animation: 'fade',
            animationspeed: 100, 
         });
      },
      
      openCashout         : function(){
         App.Router.closePopup()
         $("#cashoutWindow").reveal({
            animation: 'fade',
            animationspeed: 100, 
         });
      },
      
      openConfirmCashout         : function(){
         App.Router.closePopup()
         $("#confirmCashoutWindow").reveal({
            animation: 'fade',
            animationspeed: 100, 
         });
      },
      
      confirmCashout         : function(){
         App.Router.closePopup()
         UserManager.cashout();
      },

      
      openShare         : function(){
         $("#shareWindow").reveal({
            animation: 'fade',
            animationspeed: 100, 
         });
      },
		
	});

	//==================================================================//

})();

