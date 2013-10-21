
(function() {
	'use strict';

	var GameController = Ember.ObjectController.extend({});

	//==================================================================//

	GameController.renderUI = function(){
	   App.Globals.signinRequested = true // reach /game directly : FB landing page, must use signinFBWindow
	   UserManager.setupForms()
	   
      App.get('router').transitionTo('game.gameHome');
	}

	GameController.cleanUI = function()	{

	}
	
	//==================================================================//
	
	GameController.setSelectedButton = function()	{
	   
	   $("#gameHomeButton").removeClass("selected")
	   $("#myTicketsButton").removeClass("selected")
	   $("#resultsButton").removeClass("selected")
	   $("#profileButton").removeClass("selected")
	   
	   var view = App.get('router').currentState.name
	   
	   if($("#"+view+"Button")){
	      $("#"+view+"Button").addClass("selected")
	   }
	}

	//==================================================================//
	
	GameController.drawBallToPick = function(ballNum, left, top)	{
	   
	   console.log(ballNum, left, top)
	   
	   var ballId = "ball_"+ballNum
	   var textId = "text_"+ballNum
	   
	   var ball   = "<img id='"+ballId+"' src='/assets/images/game/ball.png' class='ball'></img>"
	   var num    = "<p id='"+textId+"' class='num'>"+ballNum+"</p>"
	   
	   $("#numbersToSelect").append(ball)
	   $("#numbersToSelect").append(num)
	   
	   $("#"+ballId).css("left", left + "px")
	   $("#"+ballId).css("top",  top + "px")

	   $("#"+textId).css("left", left + "px")
	   $("#"+textId).css("top",  top + "px")
	}
	
	//==================================================================//

	GameController.drawMyTickets = function()	{
	   
	   var xGap            =  45;
	   var yGap            =  45;

	   var totalNums       = App.nextLottery.maxNumbers;  
	   var nbNumPerLine    = 5;

	   var nbLines         =  Math.floor(totalNums/nbNumPerLine);
	   var nbOnlastLine    =  totalNums - Math.floor(nbLines)*nbNumPerLine;
	   
	   console.log(nbLines, nbNumPerLine, nbOnlastLine)
	   
	   for(var i = 0; i < nbNumPerLine; i++){
	      for(var j = 0; j < nbLines; j++){
	         var ballNum = j*nbNumPerLine + i + 1
	         GameController.drawBallToPick(ballNum, (i+1)*xGap, (j+1)*yGap)
	      }
	   }
	   
	   for(var i = 0; i < nbOnlastLine; i++){
	      var ballNum = nbLines*nbNumPerLine+i+1
	      GameController.drawBallToPick(ballNum, (i+1)*xGap, (nbLines+1)*yGap)
	   }

	}

	//==================================================================//

	GameController.requireVideo = function(afterVideoSeen)	{
	   
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
            GameController.setSelectedButton()
         }
      }),
      
      myTickets: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameController.setSelectedButton()
         }
      }),
      
      results: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameController.setSelectedButton()
         }
      }),
      
      profile: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameController.setSelectedButton()
         }
      }),
      
      //---------------------------------
      
      fillLotteryTicket: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameController.setSelectedButton()
         }
      }),
      
      selectAdditionalNumber: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameController.setSelectedButton()
         }
      }),
      
      confirmation: Ember.Route.extend({
         connectOutlets: function(router) {
            App.Router.openComponent(router, "game");
            GameController.setSelectedButton()
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

