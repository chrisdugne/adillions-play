//----------------------------------------------------------------//

window.Twitter = window.Twitter || {}

//----------------------------------------------------------------//

Twitter.init = function(options) 
{

};

//----------------------------------------------------------------//

Twitter.tweet = function(){
   App.message("+ " + App.Globals.NB_POINTS_PER_TWEET + " Pts !");
   App.user.set("currentPoints", App.user.currentPoints + App.Globals.NB_POINTS_PER_TWEET)
   App.user.set("hasTweet", true);
   
   UserManager.updatePlayer();
}

Twitter.follow = function(){
   App.user.set("isTwitterFan", true);
   UserManager.refreshFanStatus()
   App.message(App.translations.messages.TwoMoreBonusTickets)
}

Twitter.unfollow = function(){
   App.user.set("isTwitterFan", false);
   UserManager.refreshFanStatus()
   App.message(App.translations.messages.TwoLostBonusTickets)
}

//----------------------------------------------------------------//

Twitter.todo = function(){
   
}

//----------------------------------------------------------------//
// init Twitter + intent_events

window.twttr = (function (d,s,id) {
   var t, js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
   js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
   return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
 }(document, "script", "twitter-wjs"));

twttr.ready(function (twttr) {
   
   twttr.events.bind('click', Twitter.todo);
   twttr.events.bind('retweet', Twitter.todo);
   twttr.events.bind('favorite', Twitter.todo);
   
   twttr.events.bind('tweet', Twitter.tweet);
   twttr.events.bind('follow', Twitter.follow);
   twttr.events.bind('unfollow', Twitter.unfollow);
 })
 