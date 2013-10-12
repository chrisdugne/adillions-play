(function() {
   'use strict';

   var GameView = Ember.View.extend({
      templateName: 'game',
      didInsertElement: function(){
         App.GameController.renderUI();
      },
      willDestroyElement: function(){
         App.GameController.cleanUI();
      }
   });
   
   App.GameView = GameView;

})( App);