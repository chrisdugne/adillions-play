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
	   }.property('nbPlayers', 'toolPlayers')
	   
	});
	
	App.nextLottery = NextLottery.create();
	
})( App);
