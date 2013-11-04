
(function() {
	'use strict';

	var ResultsController = Ember.ObjectController.extend({});

	//==================================================================//

	ResultsController.renderUI = function(){
      GameManager.setSelectedButton()
	}

	ResultsController.cleanUI = function()	{
	}
	
	//==================================================================//

	App.ResultsController = ResultsController;

	//==================================================================//
	// Routing

	App.ResultsRouting = App.Page.extend({
		
	   //---------------------------------
	   
	   route: '/results',
		
	   //---------------------------------
		
		connectOutlets: function(router){
			App.Router.openPage(router, "results");
		},

      //-----------------------------------//
      // actions -- callable if App.user.loggedin only
      
      openGameHome            : Ember.Route.transitionTo('game.gameHome'),    
      openMyTickets           : Ember.Route.transitionTo('game.myTickets'),      
      openProfile             : Ember.Route.transitionTo('game.profile'),     
      
	});

	//==================================================================//

})();

