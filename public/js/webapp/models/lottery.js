(function() {
    'use strict';

    var NextLottery = Ember.Object.extend({

       //---------------------------//
       
       uid:          "",
       date:         "",
       maxPicks:     "",
       maxNumbers:   "",
       nbPlayers:    "",
       toolPlayers:  "",
       minPrice:     "",
       maxPrice:     "",
       cpm:          "",
       theme:        "",
       result:       "",
        
        //---------------------------//

       enoughPlayers: function() {
         return this.get('toolPlayers') <= this.get('nbPlayers');
       }.property('nbPlayers', 'toolPlayers'),
       
       price: function() {
          return Math.min(this.get('maxPrice'), Math.max(this.get('minPrice'), this.get('nbTickets')/1000 * this.get('cpm')));
       }.property('maxPrice', 'minPrice', 'nbTickets', 'cpm')
       
    });
    
    App.nextLottery = NextLottery.create();
    App.nextDrawing = NextLottery.create();
    
})( App);
