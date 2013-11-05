(function() {
	'use strict';

	var HomeView = Ember.View.extend({
		templateName: 'home',
		didInsertElement: function(){
         App.fillView()
			App.HomeController.renderUI();
		},
		willDestroyElement: function(){
			App.HomeController.cleanUI();
		}
	});
	
	App.HomeView = HomeView;

	//---------------------------------------------------//
	
   App.LotteryController = Ember.ObjectController.extend({});
   App.LotteryView = Ember.View.extend({
      templateName: 'homeLottery'
   });
   
})( App);