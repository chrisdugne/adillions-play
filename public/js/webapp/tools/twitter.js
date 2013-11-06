//----------------------------------------------------------------//

window.Twitter = window.Twitter || {}

//----------------------------------------------------------------//

Twitter.init = function(options) 
{

};

//----------------------------------------------------------------//

Twitter.isTwitterFan = function(next){
   App.user.set("isTwitterFan", false);
   next();
}