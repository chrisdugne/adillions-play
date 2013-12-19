(function() {
	'use strict';

	var AboutView = Ember.View.extend({
		templateName: 'about',
		didInsertElement: function(){
		    App.fillView()
			App.AboutController.renderUI();
		},
		willDestroyElement: function(){
		    App.releaseFooter()
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
      willDestroyElement: function(){
          App.releaseFooter()
      }
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
      willDestroyElement: function(){
          App.releaseFooter()
      }
   });
   
   App.TermsController = Ember.ObjectController.extend({});
   App.TermsView = Ember.View.extend({
      templateName: 'terms',
      didInsertElement: function(){
         App.fillView()
      },
      willDestroyElement: function(){
          App.releaseFooter()
      }
   });
   
   App.PrizesController = Ember.ObjectController.extend({});
   App.PrizesView = Ember.View.extend({
       templateName: 'prizes',
       didInsertElement: function(){
           App.fillView()
       },
       willDestroyElement: function(){
           App.releaseFooter()
       }
   });
   
   App.KeyrulesController = Ember.ObjectController.extend({});
   App.KeyrulesView = Ember.View.extend({
       templateName: 'keyrules',
       didInsertElement: function(){
           App.fillView()
       },
       willDestroyElement: function(){
           App.releaseFooter()
       }
   });
   
   App.RewardsController = Ember.ObjectController.extend({});
   App.RewardsView = Ember.View.extend({
       templateName: 'rewards',
       didInsertElement: function(){
           App.fillView()
       },
       willDestroyElement: function(){
           App.releaseFooter()
       }
   });

   App.JobsController = Ember.ObjectController.extend({});
   App.JobsView = Ember.View.extend({
       templateName: 'jobs',
       didInsertElement: function(){
           App.fillView()
       },
       willDestroyElement: function(){
           console.log("releaseFooter")
           App.releaseFooter()
       }
   });

   App.PressController = Ember.ObjectController.extend({});
   App.PressView = Ember.View.extend({
       templateName: 'press',
       didInsertElement: function(){
           App.fillView()
       },
      willDestroyElement: function(){
          App.releaseFooter()
      }
   });
   
   App.PrivacyController = Ember.ObjectController.extend({});
   App.PrivacyView = Ember.View.extend({
      templateName: 'privacy',
      didInsertElement: function(){
         App.fillView()
      },
      willDestroyElement: function(){
          App.releaseFooter()
      }
   });
   
})( App);