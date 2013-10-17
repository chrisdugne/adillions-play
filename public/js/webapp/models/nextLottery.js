(function() {
	'use strict';

	var NextLottery = Ember.Object.extend({

	   //---------------------------//
	   
	   uid:          "",
	   date:         "",
	   maxPicks:     "",
	   maxNumbers:   "",
	   nbPlayers:    "",
	   minPrice:     "",
	   maxPrice:     "",
	   cpm:          "",
	   theme:        "",
	   result:       "",
		
		//---------------------------//
		
	});
	
	App.nextLottery = NextLottery.create();
	
})( App);
