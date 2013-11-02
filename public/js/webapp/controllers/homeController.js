
(function() {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//==================================================================//

	HomeController.renderUI = function(){
	   UserManager.setupForms()
	}

	HomeController.cleanUI = function()	{

	}

	
	//==================================================================//
	// Controls
	
	HomeController.openLoginWindow = function() 
	{
      App.Globals.signinRequested = true
      
      $("#loginWindow").reveal({
         animation: 'fade',
         animationspeed: 100, 
      });
	}

	HomeController.openVideoWindow = function() 
	{
	   window.youtubeManager.openVideoWindow();
	}

	//----------------------------------------------------//

	App.HomeController = HomeController;

	//==================================================================//
	// Routing

	App.HomeRouting = App.Page.extend({
		route: '/',
		
		connectOutlets: function(router){
			App.Router.openPage(router, "home");
		},
		
		//--------------------------------------//
		// actions
		
		playOnAdillions    : function(){
		   if(App.user.loggedIn){
		      App.get('router').transitionTo('game');
		   }
		   else{
		      App.HomeController.openLoginWindow()
		   }
		},
		openLoginWindow    : function(){App.HomeController.openLoginWindow()},
		showVideo          : function(){App.HomeController.openVideoWindow()},
		
	});

	//==================================================================//

})();

