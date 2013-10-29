(function() {
	'use strict';
	
	var Router = Ember.Router.extend({
		enableLogging: true,
		root: Ember.Route.extend({
			
			//-------------------------------------------------------//
			// Common actions to all views

			openHome       : Ember.Route.transitionTo('home'),

			//-------------------------------------------------------//

			translateEn    : function(){
			    App.changeLang("en")
			},
			translateFr    : function(){
			    App.changeLang("fr")
			},

			//-------------------------------------------------------//
			
			openLogin         : function(){
			   
			   App.Globals.signinRequested = true
			   
			   $("#loginWindow").reveal({
			      animation: 'fade',
			      animationspeed: 100, 
			   });
			   
			},
			
			openSignin         : function(){
			   
			   App.Globals.signinRequested = true
			   
			   $("#signinWindow").reveal({
			      animation: 'fade',
			      animationspeed: 100, 
			   });
			   
			},
			
			//-------------------------------------------------------//
			
			openGame         : Ember.Route.transitionTo('game'),

			//-------------------------------------------------------//
			
			facebookLogin         : function(){
			   $("#signinWindow").trigger("reveal:close");
			   $("#loginWindow").trigger("reveal:close");
			   Facebook.popupLogin()
			},
			
			login         : function(){
            UserManager.login()
			},
			
			signin         : function(){
		      UserManager.signin()
			},
			
			signinFB       : function(){
			   UserManager.signinFB()
			},
			
			//-------------------------------------------------------//
			   
			logout         : function(){

			   App.message("Welcome back  !", true)
			   return
			   if(Facebook.accessToken){
			      Facebook.logout()
			      $.removeCookie('facebookId');
			   }
			      
            $.removeCookie('authToken');
			   App.user.set("loggedIn", false)
		      App.get('router').transitionTo('home');
			},

			//-------------------------------------------------------//
			// Routes used when calling Ember.Route.transitionTo
			//-------------------//
			
			home           : App.HomeRouting,
			game           : App.GameRouting,
			team           : App.TeamRouting,
			credits        : App.CreditsRouting,
			blog           : App.BlogRouting,
			
		})
	})
	
	//-----------------------------------------------------------------------------------------//
	
	/**
	 * the main purpose of Router.openPage is to check if user.isLoggedIn
	 * the second purpose is to create a full context, adding the customContext to everything else
	 * 
	 * context : may contain additional models required for the view
	 * exemple 
	 * connectOutlets: function(router){
         var customContext = new Object();
         customContext["datasetsData"] = App.datasetsData;
         App.Router.openPage(router, "dashboard", customContext);
      }, 
      
      the custom context is added to the glabal context containing
       - user
       - publicData
       - viewData
       - currentView
	 */
	Router.openPage = function (router, page, customContext)
	{
	   var webappPage = Router.isWebappPage(page);
	   
	   console.log("-------------> ") 
      console.log("openPage " + page);
		if(webappPage
		&& !App.user.loggedIn)
		{
			console.log("Not connected ! Redirected to the home page");
			router.transitionTo('home');
		}
		else{
		   if(webappPage && !App.Globals.APP_READY){
		      console.log("Not loaded properly ! Redirected to the home page");
		      window.location.href="/"
		   }
		   else{
            var context = Router.buildGlobalContext(customContext, page);
            App.Globals.set("currentPage", page);
            App.Globals.set("currentView", page);
            App.Globals.set("parentView", "root");
            
            router.get('applicationController').connectOutlet(page, context);
		   }
		}
	}

	//-----------------------------------------------------------------------------------------//

   /**
    * Load a component with the parentController as context
    * context : same as Router.openPage
    */
   Router.openComponent = function (router, parentView, customContext)
   {
      var view = router.currentState.name;
      var context = Router.buildGlobalContext(customContext, view);

      context["currentView"] = view;
      App.Globals.set("currentView", view);
      App.Globals.set("parentView", parentView);
      
      router.get(parentView+"Controller").connectOutlet(view, context);
   }

   //-----------------------------------------------------------------------------------------//

   Router.buildGlobalContext = function (customContext, view){

      var context;
    
      if(customContext == undefined)
         context = new Object();
      else
         context = customContext;

      context["user"] = App.user;
      context["publicData"] = App.publicData;

      // binding controller's data
      context[view+"Data"] = App[view+"Data"];  
      
      return context;
   }

   //-----------------------------------------------------------------------------------------//

   Router.isWebappPage = function(page){
      return (page != "home" && 
            page != "team" && 
            page != "credits" && 
            page != "blog");
   }
   
   //-----------------------------------------------------------------------------------------//

	App.Router = Router;
	App.init()

	//-----------------------------------------------------------------------------------------//
	
})();
