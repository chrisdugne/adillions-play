
(function() {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//==================================================================//

	HomeController.renderUI = function(){
	   UserManager.setupForms()
	   
	   if(App.nextLottery.date){
         App.get('router').transitionTo('home.lottery')
	   }
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

		startWithoutLottery: Ember.Route.extend({
         route: '/'
      }),
      
      //--------------------------------------//
      
      lottery: Ember.Route.extend({
         route: '/welcome',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "home");
         }
      }),
		
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

})();

