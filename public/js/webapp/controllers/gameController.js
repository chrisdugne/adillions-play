
(function() {
	'use strict';

	var GameController = Ember.ObjectController.extend({});

	//==================================================================//

	GameController.renderUI = function(){
	   App.Globals.signinRequested = true // reach /game directly : FB landing page, must use signinFBWindow
	   UserManager.setupForms()
	   
      App.get('router').transitionTo('game.gameHome');
	   GameManager.init()
	   
	   var menuButtonSize = 67;
	   $("#gameHomeButton").css("left", ($(window).width()/2 - 3.4*menuButtonSize) + "px")
	   $("#myTicketsButton").css("left", ($(window).width()/2 - 1.8*menuButtonSize) + "px")
	   $("#resultsButton").css("left", ($(window).width()/2 ) - 0.2*menuButtonSize + "px")
	   $("#profileButton").css("left", ($(window).width()/2 + 1.4*menuButtonSize) + "px")
	}

	GameController.cleanUI = function()	{

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
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      myTickets: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      results: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      profile: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      //---------------------------------
      
      fillLotteryTicket: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      selectAdditionalNumber: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameManager.setSelectedButton()
         }
      }),
      
      confirmation: Ember.Route.extend({
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
		   GameController.requireVideo( function(){
		      App.get('router').transitionTo('game.fillLotteryTicket')
		   }) 
		},		
      
      openGameHome            : Ember.Route.transitionTo('game.gameHome'),		
      openMyTickets           : Ember.Route.transitionTo('game.myTickets'),		
      openResults             : Ember.Route.transitionTo('game.results'),		
      openProfile             : Ember.Route.transitionTo('game.profile'),		
		
	});

	//==================================================================//

})();

