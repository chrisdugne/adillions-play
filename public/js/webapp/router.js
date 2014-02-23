(function() {
    'use strict';
    
    var Router = Ember.Router.extend({
       
        enableLogging: true,
        root: Ember.Route.extend({
            
            //-------------------------------------------------------//
            // Common actions to all views

           openHome           : Ember.Route.transitionTo('home'),
           openResults        : Ember.Route.transitionTo('results'),
           openAdvertisers    : Ember.Route.transitionTo('advertisers'),

            //-------------------------------------------------------//

           openAboutHome      : Ember.Route.transitionTo('about.aboutHome'),
           openFaq            : Ember.Route.transitionTo('about.faq'),
           openTerms          : Ember.Route.transitionTo('about.terms'),
           openRewards        : Ember.Route.transitionTo('about.rewards'),
           openPrizes         : Ember.Route.transitionTo('about.prizes'),
           openKeyRules       : Ember.Route.transitionTo('about.keyrules'),
           openJobs           : Ember.Route.transitionTo('about.jobs'),
           openPress          : Ember.Route.transitionTo('about.press'),
           openPrivacy        : Ember.Route.transitionTo('about.privacy'),
           
           //-------------------------------------------------------//

            translateEn    : function(){
                App.changeLang("en")
            },
            translateFr    : function(){
                App.changeLang("fr")
            },

            //-------------------------------------------------------//
            
            openTutorial1         : function(){
            Router.closePopup();
            
            $("#tutorial1Window").reveal({
               animation: 'none',
            });
            
            },
            
            openTutorial2         : function(){
               Router.closePopup();
               
               $("#tutorial2Window").reveal({
                  animation: 'none',
               });
            },
            
            openTutorial3         : function(){
               Router.closePopup();
               
               $("#tutorial3Window").reveal({
                  animation: 'none',
               });
            },
            
            //-------------------------------------------------------//
            
            openLogin         : function(){
               App.HomeController.openLoginWindow()
            },
            
            openSignin         : function(){

            Router.closePopup();
               App.Globals.signinRequested = true
               
               $("#signinWindow").reveal({
                  animation: 'fade',
                  animationspeed: 100, 
               });
               
            },
            
            //-------------------------------------------------------//
            
            openConfirm         : function(){

               if(UserManager.signinFormReady()){
                Router.closePopup();
                  
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
                Router.closePopup();
                  
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
            
            openGame         : Ember.Route.transitionTo('game.gameHome'),

            //-------------------------------------------------------//
            
            facebookLogin         : function(){
            Router.closePopup();
               Facebook.popupLogin()
            },
            
            facebookMerge         : function(){
               Router.closePopup();
               Facebook.popupLogin(function(){
                  Facebook.mergeMe(function(){
                     UserManager.mergePlayerWithFacebook();
                  })
               })
            },

            //-------------------------------------------------------//
            
            login         : function(){
            UserManager.login()
            },
            
            signin         : function(){
            Router.closePopup();
              UserManager.signin()
            },
            
            signinFB       : function(){
               Router.closePopup();
               UserManager.signinFB()
            },
            
            //-------------------------------------------------------//

            signinWithTwitter   : function(){
               UserManager.signinWithTwitter()
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
            
            closeModal         : function(){
               Router.closePopup()
            },

            //-------------------------------------------------------//
            // Routes used when calling Ember.Route.transitionTo
            //-------------------//
            
            home           : App.HomeRouting,
            game           : App.GameRouting,
            about          : App.AboutRouting,
            results        : App.ResultsRouting,
            advertisers    : App.AdvertisersRouting,
            team           : App.TeamRouting,
            credits        : App.CreditsRouting,
            blog           : App.BlogRouting,
            
        })
    })
    
    //-----------------------------------------------------------------------------------------//

    Router.closePopup = function (){
      $(".reveal-modal").trigger("reveal:close");
    }
    
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
      return (page != "home" &&
            page != "results" && 
            page != "advertisers" && 
            page != "about" && 
            page != "team" && 
            page != "credits" && 
            page != "blog");
   }
   
   //-----------------------------------------------------------------------------------------//

    App.Router = Router;

    //-----------------------------------------------------------------------------------------//
    
})();
