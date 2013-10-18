//----------------------------------------------------------------//
//javascript for views.home

//try to connect to facebook and get the userInfo

//----------------------------------------------------------------//
//Appels immédiats au chargement de la page

//added for IE : ajax calls : It enables cross-site scripting in jQuery
jQuery.support.cors = true;

//----------------------------------------------------------------//

window.Facebook = window.Facebook || {}

//----------------------------------------------------------------//

Facebook.init = function(finalizeInit, notConnectedCallback, openApp) 
{
   console.log("Connection to FB", App.prod)
   
   //---------------------------------------------------------------
   
   if(App && App.prod){
      this.FACEBOOK_APP_ID          = "170148346520274";
      this.FACEBOOK_APP_SECRET      = "887e8f7abb9b1cb9238a097e06585ae2";
   }
   else{
      this.FACEBOOK_APP_ID          = "534196239997712";
      this.FACEBOOK_APP_SECRET      = "46383d827867d50ef5d87b66c81f1a8e";
   }

   console.log("Connection to FB", this.FACEBOOK_APP_ID)

   //---------------------------------------------------------------

   this.FACEBOOK_APP_NAMESPACE   = "adillions";
   this.SERVER_OG_URL            = "http://www.adillions.com/"
   
   //---------------------------------------------------------------

   this.finalizeInit         = finalizeInit
   
   if(openApp === undefined)
      Facebook.openApp = Facebook.defaultOpenApp;
   else
      Facebook.openApp = openApp
   
   //---------------------------------------------------------------
   
   FB.init({
      appId      : this.FACEBOOK_APP_ID, // App ID
      channelUrl : '//'+window.location.hostname+'/channel', // Path to your Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true,  // parse XFBML
      frictionlessRequests: true
   });

   FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
         // the user is logged in and has authenticated your
         // app, and response.authResponse supplies
         // the user's ID, a valid access token, a signed
         // request, and the time the access token 
         // and signed request each expire
         
         Facebook.finalizeInit()
         Facebook.checkPermissions(response);
      } 
      else if (response.status === 'not_authorized') 
      {
         // the user is logged in to Facebook, 
         // but has not authenticated your app
         // the user isn't logged in to Facebook.
         //Facebook.popupLogin();
//         UserManager.getPlayer()
         
         Facebook.finalizeInit()
         notConnectedCallback()
      }
      else 
      {
         // the user isn't logged in to Facebook.
         //         Facebook.popupLogin(); -- force popup to login

         // then try Application autologin
//         UserManager.getPlayer()

         Facebook.finalizeInit()
         notConnectedCallback()
      }
   });

};

//----------------------------------------------------------------//

Facebook.checkPermissions = function(responseConnection)
{
   Facebook.facebookId     = responseConnection.authResponse.userID;
   Facebook.accessToken    = responseConnection.authResponse.accessToken;
   $.cookie('facebookId', Facebook.facebookId);

   FB.api('/me/permissions', function (response) {

      if(response.data == undefined)
      {
         Facebook.popupLogin();
         Facebook.finalizeInit()
         return;
      }

      var perms = response.data[0];

      if(perms.publish_stream
            && perms.email 
            && perms.user_birthday 
            && perms.user_likes
            && perms.friends_birthday 
            && perms.publish_actions) 
      {
         // permissions OK
         Facebook.openApp();
      }
      else
      {                
         // User DOESN'T have all permissions.
         // force Logout then ask him again

         Facebook.logout(function(){
            Facebook.popupLogin()
         })
      }                                            
   } );
}

Facebook.popupLogin = function()
{
   FB.login(function (response) {
      if(response.authResponse)
         Facebook.checkPermissions(response);
   }, { scope: 'publish_stream, email, user_likes, user_birthday, friends_birthday, publish_actions' });
}

Facebook.logout = function(next)
{
   if(Facebook.accessToken){
      FB.logout(function () {
         if(next)
            next()
      })
   }
}

//----------------------------------------------------------------//

Facebook.defaultOpenApp = function()
{
   Facebook.getAppAccessToken();

   Facebook.getMe( function (){
      UserManager.getPlayerByFacebookId()
   }); 

   // passage par controller/register pour mettre facebookUID en session
   // redirection sur dashboard au retour.
   //register("myFacebookId", myFacebookId);


//   _gaq.push(['_setCustomVar', 1, 'VISITOR_ID', myFacebookId, 1]); 
}

//----------------------------------------------------------------//

Facebook.getAppAccessToken = function()
{
   $.ajax({  
      type: "GET",  
      url: "https://graph.facebook.com/oauth/access_token?client_id=" + this.FACEBOOK_APP_ID + "&client_secret=" + this.FACEBOOK_APP_SECRET + "&grant_type=client_credentials",
      success: function (data, textStatus, jqXHR)
      {
         if(data.indexOf("access_token") == -1){
            Facebook.appAccessToken = data 
         }
         else{
            // IE
            Facebook.appAccessToken = data.split("=")[1] 
         }

      },
      error: function(jqXHR, textStatus, errorThrown)
      {
         alert(textStatus);
      }
   });
}

Facebook.getMe = function(next)
{
   console.log("getMe", this.accessToken)
   $.ajax({  
      type: "GET",  
      url: "https://graph.facebook.com/me?fields=name,first_name,last_name,picture,locale,birthday,email&access_token="+ this.accessToken,
      dataType: "jsonp",
      success: function (data, textStatus, jqXHR)
      {
         Facebook.data = data
         next();
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
         alert(textStatus);
      }
   });
}
