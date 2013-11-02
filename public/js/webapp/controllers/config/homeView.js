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

	//---------------------------
	// dummy to remove 
	
	var RealhomeView = Ember.View.extend({
	   templateName: 'realhome',
	   didInsertElement: function(){
	      App.fillView()
	      App.RealhomeController.renderUI();
	   },
	   willDestroyElement: function(){
	      App.RealhomeController.cleanUI();
	   }
	});
	
	App.RealhomeView = RealhomeView;

})( App);