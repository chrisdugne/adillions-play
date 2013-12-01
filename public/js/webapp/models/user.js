(function() {
	'use strict';

	var User = Ember.Object.extend({

	   //---------------------------//
	   // from back end

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
	   
	   acceptEmails           : "",

	   //---------------------------//
	   // set on front end
	   
	   totalBonusTickets      : "",  
	   totalGains             : "",  

	   lotteries              : "",
	   themeLiked             : false,
	   loggedIn               : false,

	   //---------------------------//

	   ticketsToPlay: function() {
	      return this.get('availableTickets') + this.get('totalBonusTickets') - this.get('playedBonusTickets');
	   }.property('availableTickets', 'totalBonusTickets', 'playedBonusTickets'),

	   hasFacebookAccount: function() {
	      return this.get('facebookId') != null;
	   }.property('facebookId'),

	   hasTwitterAccount: function() {
	      return this.get('twitterId') != null;
	   }.property('twitterId'),

	   //---------------------------//

	});
	
	App.user = User.create();
   App.user.set("lang", App.translator.lang);
   App.Globals.set("lang", App.translator.lang);
	
})( App);
