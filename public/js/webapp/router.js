(function() {
	'use strict';
	
	var Router = Ember.Router.extend({
		enableLogging: true,
		root: Ember.Route.extend({
			
			//-------------------------------------------------------//
			// Common actions to all views

		   openHome           : Ember.Route.transitionTo('home'),
		   openRealHome       : Ember.Route.transitionTo('realhome'),

			//-------------------------------------------------------//

			translateEn    : function(){
			    App.changeLang("en")
			},
			translateFr    : function(){
			    App.changeLang("fr")
			},

			//-------------------------------------------------------//
			
			openLogin         : function(){
			   App.HomeController.openLoginWindow()
			},
			
			openSignin         : function(){

			   $("#loginWindow").trigger("reveal:close");
            $("#confirmWindow").trigger("reveal:close");
			   App.Globals.signinRequested = true
			   
			   $("#signinWindow").reveal({
			      animation: 'fade',
			      animationspeed: 100, 
			   });
			   
			},
			
			//-------------------------------------------------------//
			
			openConfirm         : function(){

			   if(UserManager.signinFormReady()){
			      $("#signinWindow").trigger("reveal:close");
			      $("#signinFBWindow").trigger("reveal:close");
			      
			      $("#confirmWindow").reveal({
			         animation: 'fade',
			         animationspeed: 100, 
			      });

               $("#confirmFirstName").text($("#firstName").val())
               $("#confirmLastName").text($("#lastName").val())
               $("#confirmBirthDate").text($("#birthDate").val())
			   }
			   
			},

			openConfirmFB         : function(){
			   
			   if(UserManager.signinFormFBReady()){
			      $("#signinWindow").trigger("reveal:close");
			      $("#signinFBWindow").trigger("reveal:close");
			      
			      $("#confirmFBWindow").reveal({
			         animation: 'fade',
			         animationspeed: 100, 
			      });
			      
		         $("#confirmFBFirstName").text($("#fbForm_firstName").val())
		         $("#confirmFBLastName").text($("#fbForm_lastName").val())
		         $("#confirmFBBirthDate").text($("#fbForm_birthDate").val())
			   }
			   
			},

			openSigninFB         : function(){
			   UserManager.openSigninFB()
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
            $("#confirmWindow").trigger("reveal:close");
		      UserManager.signin()
			},
			
			signinFB       : function(){
			   $("#confirmFBWindow").trigger("reveal:close");
			   UserManager.signinFB()
			},
			
			//-------------------------------------------------------//

			openPoints     : function(){
		      $("#pointsWindow").reveal({
		         animation: 'fade',
		         animationspeed: 100, 
		      });         
			},
	      
			//-------------------------------------------------------//
			   
			logout         : function(){
			   UserManager.logout()
			},

			//-------------------------------------------------------//
			// Routes used when calling Ember.Route.transitionTo
			//-------------------//
			
			home           : App.HomeRouting,
			game           : App.GameRouting,
			team           : App.TeamRouting,
			credits        : App.CreditsRouting,
			blog           : App.BlogRouting,

			// to remove !
			realhome       : App.RealHomeRouting,
			
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
            $(window).scrollTop(0)
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
      $(window).scrollTop(0)
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
      return (page != "home" && page != "realhome" &&
            page != "team" && 
            page != "credits" && 
            page != "blog");
   }
   
   //-----------------------------------------------------------------------------------------//

	App.Router = Router;
	window.location.hash = "/"      // landing forced on homepage + login 
	   
	App.init()

	//-----------------------------------------------------------------------------------------//
	
})();
