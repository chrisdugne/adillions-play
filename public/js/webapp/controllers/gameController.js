
(function() {
	'use strict';

	var GameController = Ember.ObjectController.extend({});

	//==================================================================//

	GameController.renderUI = function(){
	   App.Globals.signinRequested = true // reach /game directly : FB landing page, must use signinFBWindow
	   UserManager.setupForms()
	}

	GameController.cleanUI = function()	{

	}
	
	//==================================================================//
	// Controls

	App.GameController = GameController;

	//==================================================================//
	// Routing

	App.GameRouting = App.Page.extend({
		route: '/game',
		
		connectOutlets: function(router){
			App.Router.openPage(router, "game");
		},
		
		
	});

	//==================================================================//

})();

