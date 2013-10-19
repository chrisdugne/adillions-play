
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
	   $("#"+view+"Button").addClass("selected")
	}

	//==================================================================//

	GameController.drawMyTickets = function()	{
	   var canvas = document.getElementById("myTicketsCanvas");
	   var ctx = canvas.getContext("2d");
	   
	   
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
            GameController.drawMyTickets()
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
		
		connectOutlets: function(router){
			App.Router.openPage(router, "game");
		},

      //-----------------------------------//
      // actions
      
      openGameHome            : Ember.Route.transitionTo('game.gameHome'),		
      openMyTickets           : Ember.Route.transitionTo('game.myTickets'),		
      openResults             : Ember.Route.transitionTo('game.results'),		
      openProfile             : Ember.Route.transitionTo('game.profile'),		
		
	});

	//==================================================================//

})();

