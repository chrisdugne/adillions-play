(function() {
    'use strict';

    var AdvertisersView = Ember.View.extend({
        templateName: 'advertisers',
        didInsertElement: function(){
         App.fillView()
            App.AdvertisersController.renderUI();
        },
        willDestroyElement: function(){
            App.AdvertisersController.cleanUI();
        }
    });
    
    App.AdvertisersView = AdvertisersView;

})( App);