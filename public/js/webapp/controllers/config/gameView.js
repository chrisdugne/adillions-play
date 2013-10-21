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
	   templateName: 'myTickets',
      didInsertElement: function(){
         App.GameController.drawMyTickets()
      },
	});
	
	App.ResultsController = Ember.ObjectController.extend({});
	App.ResultsView = Ember.View.extend({
	   templateName: 'results'
	});
	
	App.ProfileController = Ember.ObjectController.extend({});
	App.ProfileView = Ember.View.extend({
	   templateName: 'profile'
	});
	
	//------------------------------------------------//
	
	App.FillLotteryTicketController = Ember.ObjectController.extend({});
	App.FillLotteryTicketView = Ember.View.extend({
	   templateName: 'fillLotteryTicket'
	});

	App.SelectAdditionalNumberController = Ember.ObjectController.extend({});
	App.SelectAdditionalNumberView = Ember.View.extend({
	   templateName: 'selectAdditionalNumber'
	});
	
	App.ConfirmationController = Ember.ObjectController.extend({});
	App.ConfirmationView = Ember.View.extend({
	   templateName: 'confirmation'
	});
	

})( App);
