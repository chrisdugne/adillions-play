(function() {
	'use strict';

	var User = Ember.Object.extend({

	   //---------------------------//

	   uid                    : "",
	   email                  : "",
	   userName               : "",
	   firstName              : "",
	   lastName               : "",
	   birthDate              : "",
	   referrerId             : "",
	   sponsorCode            : "",
	   giftToReferrer         : "",

	   isFacebookFan          : "",
	   isTwitterFan           : "",
	   
	   currentLotteryUID      : "",
	   hasPostOnFacebook      : "",
	   hasTweet               : "",
	   hasTweetAnInvite       : "",
	   hasInvitedOnFacebook   : "",
	   
	   currentPoints          : "",
	   idlePoints             : "",
	   totalPoints            : "",

	   facebookId             : "",
	   twitterId              : "",
	   twitterName            : "",

	   lotteryTickets         : "",

	   extraTickets           : "",
	   availableTickets       : "",
	   playedBonusTickets     : "",
	   totalPaidTickets       : "",
	   totalBonusTickets      : "",  
	   
	   acceptEmails           : "",

	   //---------------------------//

	   loggedIn:    false,

	   //---------------------------//

	   ticketsToPlay: function() {
	      return this.get('availableTickets') + this.get('totalBonusTickets') - this.get('playedBonusTickets');
	   }.property('availableTickets', 'totalBonusTickets', 'playedBonusTickets')

	});
	
	App.user = User.create();
   App.user.set("lang", App.translator.lang);
	
})( App);
