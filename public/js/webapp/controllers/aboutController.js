
(function() {
	'use strict';

	var AboutController = Ember.ObjectController.extend({});

	//==================================================================//

	AboutController.renderUI = function(){
      App.AboutController.setSelectedTab()
      UserManager.setupForms()
	}

	AboutController.cleanUI = function()	{
	}

	//==================================================================//

	AboutController.setSelectedTab = function()	{

	   $(".aboutTab").removeClass("selected")

	   var view = App.get('router').currentState.name;
	   
	   if($("#"+view+"Tab")){
	      $("#"+view+"Tab").addClass("selected")
	   }
	}

	//==================================================================//

	App.AboutController = AboutController;

	//==================================================================//
	// Routing

	App.AboutRouting = App.Page.extend({
		
	   //---------------------------------
	   
	   route: '/about',
	   
      //---------------------------------
      
      aboutHome: Ember.Route.extend({
         route: '/',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
      
      faq: Ember.Route.extend({
         route: '/faq',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
      
      terms: Ember.Route.extend({
         route: '/terms',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
      
      rewards: Ember.Route.extend({
         route: '/rewards',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
      
      prizes: Ember.Route.extend({
          route: '/prizes',
          connectOutlets: function(router) {
              App.Router.openComponent(router, "about");
              App.AboutController.setSelectedTab()
          }
      }),
      
      keyrules: Ember.Route.extend({
          route: '/keyrules',
          connectOutlets: function(router) {
              App.Router.openComponent(router, "about");
              App.AboutController.setSelectedTab()
          }
      }),
      
      jobs: Ember.Route.extend({
         route: '/jobs',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
      
      press: Ember.Route.extend({
         route: '/press',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
      
      privacy: Ember.Route.extend({
         route: '/privacy',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "about");
            App.AboutController.setSelectedTab()
         }
      }),
		
	   //---------------------------------
		
		connectOutlets: function(router){
			App.Router.openPage(router, "about");
		},

      //-----------------------------------//
      
      
	});

	//==================================================================//

})();

