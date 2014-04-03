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
       hasPostThemeOnFacebook : "",
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

       timer                  : 0,

       //---------------------------//

       hasInstantTicket: function() {
          return this.get('extraTickets') > 0;
       }.property('extraTickets'),
       
       ticketsToPlay: function() {
          return this.get('availableTickets') + this.get('totalBonusTickets') - this.get('playedBonusTickets');
       }.property('availableTickets', 'totalBonusTickets', 'playedBonusTickets'),

       hasFacebookAccount: function() {
          return this.get('facebookId') != null;
       }.property('facebookId'),

       hasTwitterAccount: function() {
          return this.get('twitterId') != null;
       }.property('twitterId'),

       enoughToCashout: function() {
          return this.get('balance') >= App.minToCashout();
       }.property('balance'),

       waitForPaiement: function() {
          return this.get('pendingWinnings') > 0;
       }.property('pendingWinnings'),

       //---------------------------//

    });
    
    App.user = User.create();
   App.user.set("lang", App.translator.lang);
   App.Globals.set("lang", App.translator.lang);
    
})( App);
