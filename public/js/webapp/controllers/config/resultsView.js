(function() {
	'use strict';

	var ResultsView = Ember.View.extend({
		templateName: 'results',
		didInsertElement: function(){
         App.fillView()
			App.ResultsController.renderUI();
		},
		willDestroyElement: function(){
			App.ResultsController.cleanUI();
		}
	});
	
	App.ResultsView = ResultsView;

})( App);