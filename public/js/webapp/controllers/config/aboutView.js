(function() {
	'use strict';

	var AboutView = Ember.View.extend({
		templateName: 'about',
		didInsertElement: function(){
         App.fillView()
			App.AboutController.renderUI();
		},
		willDestroyElement: function(){
			App.AboutController.cleanUI();
		}
	});
	
	App.AboutView = AboutView;

   //------------------------------------------------//
   
   App.AboutHomeController = Ember.ObjectController.extend({});
   App.AboutHomeView = Ember.View.extend({
      templateName: 'aboutHome',
      didInsertElement: function(){
         App.fillView()
      },
   });
   
   App.FaqController = Ember.ObjectController.extend({});
   App.FaqView = Ember.View.extend({
      templateName: 'faq',
      didInsertElement: function(){
         App.fillView()

         $(function() {
            $( "#accordion" ).accordion({
               collapsible: true,
               active: false,
               heightStyle: "content"
            });
         });
      },
   });
   
   App.TermsController = Ember.ObjectController.extend({});
   App.TermsView = Ember.View.extend({
      templateName: 'terms',
      didInsertElement: function(){
         App.fillView()
      },
   });
   
   App.RewardsController = Ember.ObjectController.extend({});
   App.RewardsView = Ember.View.extend({
      templateName: 'rewards',
      didInsertElement: function(){
         App.fillView()
      },
   });
   
   App.JobsController = Ember.ObjectController.extend({});
   App.JobsView = Ember.View.extend({
      templateName: 'jobs',
      didInsertElement: function(){
         App.fillView()
      },
   });
   
   App.PressController = Ember.ObjectController.extend({});
   App.PressView = Ember.View.extend({
      templateName: 'press',
      didInsertElement: function(){
         App.fillView()
      },
   });
   
   App.PrivacyController = Ember.ObjectController.extend({});
   App.PrivacyView = Ember.View.extend({
      templateName: 'privacy',
      didInsertElement: function(){
         App.fillView()
      },
   });
   
})( App);