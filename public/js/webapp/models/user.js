(function() {
	'use strict';

	var User = Ember.Object.extend({

	   //---------------------------//
		
	   uid:         "",
		email:       "",
		firstname:   "",
		lastname:    "",
		draws:       Ember.A([]),
		
		//---------------------------//

		loggedIn:    false,
		waiting:     false,
		
		//---------------------------//
		
	});
	
	App.user = User.create();
	
})( App);
