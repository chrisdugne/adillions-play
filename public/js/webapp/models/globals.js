(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 30,

      //-------------------------------------------//
      
      APP_READY:false,

      //-------------------------------------------//

      FACEBOOK_PAGE_ID              : "379432705492888",
      TWITTER_ID                    : "1922939570",

      //-------------------------------------------//
      //--- lottery tickets status

      BLOCKED                       : 1,          // set as winning ticket, notification/popup read, cashout blocked (<10)
      PENDING                       : 2,          // cashout requested
      PAYED                         : 3,          // to set manually when paiement is done
      GIFT                          : 4,          //  gift to charity

      BONUS_1                       : 11,         // rang 7
      BONUS_2                       : 12,         // rang 8
      BONUS_3                       : 13,         // rang 9
      BONUS_4                       : 14,         // rang 10

      //-------------------------------------------//

      START_AVAILABLE_TICKETS       : 8,
      
      NB_INSTANTS_PER_TWEET         : 1,
      NB_INSTANTS_PER_POST          : 1,
      NB_INSTANTS_PER_THEME_LIKED   : 1,
      
//      POINTS_TO_EARN_A_TICKET       : 8,
//      NB_POINTS_PER_TICKET          : 1,
//      NB_POINTS_PER_TWEET           : 2,
//      NB_POINTS_PER_POST            : 2,
//      NB_POINTS_PER_LIKE            : 2,
//      NB_POINTS_PER_THEME_LIKED     : 2,

      FACEBOOK_CONNECTION_TICKETS   : 1,
      TWITTER_CONNECTION_TICKETS    : 1,

      FACEBOOK_FAN_TICKETS          : 3,
      TWITTER_FAN_TICKETS           : 3,

      //-----------------------------------------------------------------------------------------
      //--- charity levels

      SCOUT           : 1,     // 1
      CONTRIBUTOR     : 2,     // 50
      JUNIOR_DONOR    : 3,     // 100
      DONOR           : 4,     // 200
      BENEFACTOR      : 5,     // 500
      MAJOR           : 6,     // ?
      PATRON          : 7,     // ?
      PHILANTHROPIST  : 8,     // ?

      CHARITY         : ["Boy Scout", "Contributor", "Junior donor", "Donor", "Benefactor", "Major Donor", "Patron", "Philanthropist"],

      //-------------------------------------------//

      isDev          : window.location.hostname == "192.168.0.9",
      isProd         : window.location.hostname == "www.adillions.com",
      debug          : false,
      
      //-------------------------------------------//
      
      lotteries      :  "",
      country        :  "US",
      lang           :  "en",

      //-------------------------------------------//

      // if login/signin clicked -> set true -> fb.init may open signinFromFB popup.
      // default : home -> false
      signinRequested    : false,

      //-------------------------------------------//

      isEn: function() {
         return this.get('lang') == "en";
      }.property('lang'),
      
      minToCashout: function() {
         return App.minToCashout();
      }.property('country'),

      isGameHome: function() {
          return this.get("currentView") == "gameHome";
      }.property('currentView'),
      
      isProfile: function() {
          return this.get("currentView") == "profile";
      }.property('currentView'),
      
      isMyTickets: function() {
          return this.get("currentView") == "myTickets";
      }.property('currentView'),
      
      isResults: function() {
          return this.get("currentView") == "results";
      }.property('currentView'),

   });

   //------------------------------------------------------//

   App.Globals = Globals.create();
   
   //------------------------------------------------------//
  
})( App);
