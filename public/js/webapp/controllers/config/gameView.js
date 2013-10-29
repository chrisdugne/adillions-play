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
		templateName: 'gameHome',
      didInsertElement: function(){
         App.GameController.gameHomeReady()
         App.fillView()
      },
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
	
	//------------------------------------------------//
	
	App.FillLotteryTicketController = Ember.ObjectController.extend({});
	App.FillLotteryTicketView = Ember.View.extend({
	   templateName: 'fillLotteryTicket',
      didInsertElement: function(){
         GameManager.initFillLotteryTicket()
         App.fillView()
      },
	});

	App.SelectAdditionalNumberController = Ember.ObjectController.extend({});
	App.SelectAdditionalNumberView = Ember.View.extend({
	   templateName: 'selectAdditionalNumber',
      didInsertElement: function(){
         GameManager.initSelectAdditionalNumber()
         App.fillView()
      },
	});

	App.ConfirmationController = Ember.ObjectController.extend({});
	App.ConfirmationView = Ember.View.extend({
	   templateName: 'confirmation',
	   didInsertElement: function(){
	      GameManager.initConfirmation()
	      App.fillView()
	   },
	});


})( App);
