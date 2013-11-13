
(function() {
	'use strict';

	var AdvertisersController = Ember.ObjectController.extend({});

	//==================================================================//

	AdvertisersController.renderUI = function(){
      GameManager.setSelectedButton()
	}

	AdvertisersController.cleanUI = function()	{
	}
	
	//==================================================================//

	App.AdvertisersController = AdvertisersController;

	//==================================================================//
	// Routing

	App.AdvertisersRouting = App.Page.extend({
		
	   //---------------------------------
	   
	   route: '/advertisers',
		
	   //---------------------------------
		
		connectOutlets: function(router){
			App.Router.openPage(router, "advertisers");
		},
		
      //-----------------------------------//
      
	});

	//==================================================================//

})();

