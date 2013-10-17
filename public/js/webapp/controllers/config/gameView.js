(function() {
	'use strict';
	  
	//------------------------------------------------//

   var GameView = Ember.View.extend({
      templateName: 'game',
      didInsertElement: function(){
         App.fillView()
         App.GameController.renderUI();
      },
      willDestroyElement: function(){
         App.GameController.cleanUI();
      }
   });
   
   App.GameView = GameView;

   //------------------------------------------------//

	App.GameHomeController = Ember.ObjectController.extend({});
	App.GameHomeView = Ember.View.extend({
		templateName: 'gameHome'
	});
	
	App.MyTicketsController = Ember.ObjectController.extend({});
	App.MyTicketsView = Ember.View.extend({
	   templateName: 'myTickets'
	});
	
	App.ResultsController = Ember.ObjectController.extend({});
	App.ResultsView = Ember.View.extend({
	   templateName: 'results'
	});
	
	App.ProfileController = Ember.ObjectController.extend({});
	App.ProfileView = Ember.View.extend({
	   templateName: 'profile'
	});
	

})( App);
