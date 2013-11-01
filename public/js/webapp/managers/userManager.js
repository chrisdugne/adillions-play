//-------------------------------------------//
//UserManager
//-------------------------------------------//

this.UserManager = {};

//-------------------------------------------//

UserManager.receivedPlayer = function(player, next)
{
   console.log("receivedPlayer")
   App.user.set("loggedIn", true)   
   App.message("Welcome back " + player.userName + " !", true)

   UserManager.updatedPlayer(player, next)

   if(Facebook && Facebook.finalizeInit)
      Facebook.finalizeInit();


   UserManager.checkUserCurrentLottery()
}

//-------------------------------------------//

UserManager.checkUserCurrentLottery = function(){
   console.log("checkUserCurrentLottery")
   if(App.user.currentLotteryUID != App.nextLottery.uid){
      console.log("new Lottery settings")

      App.user.currentLotteryUID         = App.nextLottery.uid
      App.user.availableTickets          = App.Globals.START_AVAILABLE_TICKETS 
      App.user.playedBonusTickets        = 0

      App.user.hasTweet                  = false
      App.user.hasPostOnFacebook         = false
      App.user.hasTweetAnInvite          = false
      App.user.hasInvitedOnFacebook      = false

      UserManager.updatePlayer()
   }

}

//-------------------------------------------//

UserManager.updatedPlayer = function(player, next){

   App.user.set("uid",                 player.uid);
   App.user.set("email",               player.email);
   App.user.set("userName",            player.userName);
   App.user.set("firstName",           player.firstName);
   App.user.set("lastName",            player.lastName);
   App.user.set("birthDate",           player.birthDate);
   App.user.set("referrerId",          player.referrerId);
   App.user.set("sponsorCode",         player.sponsorCode);
   App.user.set("giftToReferrer",      player.giftToReferrer);

   App.user.set("isFacebookFan",        player.isFacebookFan);
   App.user.set("isTwitterFan",        player.isTwitterFan);

   App.user.set("currentLotteryUID",   player.currentLotteryUID);
   App.user.set("hasPostOnFacebook",   player.hasPostOnFacebook);
   App.user.set("hasTweet",            player.hasTweet);
   App.user.set("hasTweetAnInvite",    player.hasTweetAnInvite);
   App.user.set("hasInvitedOnFacebook", player.hasInvitedOnFacebook);

   App.user.set("currentPoints",       player.currentPoints);
   App.user.set("idlePoints",          player.idlePoints);
   App.user.set("totalPoints",         player.totalPoints);

   App.user.set("facebookId",          player.facebookId);
   App.user.set("twitterId",           player.twitterId);
   App.user.set("twitterName",         player.twitterName);

   App.user.set("lotteryTickets",      player.lotteryTickets);

   App.user.set("extraTickets",        player.extraTickets);
   App.user.set("availableTickets",    player.availableTickets);
   App.user.set("playedBonusTickets",  player.playedBonusTickets);
   App.user.set("totalPaidTickets",    player.totalPaidTickets);
   App.user.set("totalBonusTickets",   0);

   App.user.set("acceptEmails",        player.acceptEmails);

   console.log("updatedPlayer")
   odump(App.user)

   //----------------------------------------------//

   UserManager.checkIdlePoints()

// viewManager.refreshHeaderPoints(player.currentPoints)
// lotteryManager:sumPrices()

// UserManager.checkFanStatus(next)   

   //----------------------------------------------//

   if(next)
      next()
}


//-------------------------------------------//

UserManager.updatePlayer = function(next)
{
   console.log("updatePlayer")
   var params = new Object();
   params["user"] = App.user

   App.wait()

   $.ajax({
      type: "POST",  
      url: "/updatePlayer",
      data: JSON.stringify(params),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {"X-Auth-Token": App.authToken},
      success: function (player)
      {
         if(player){
            UserManager.updatedPlayer(player, next)
         }
         else{
            if(next)
               next()
         }

         App.free()
      }
   });
}

//-------------------------------------------//

UserManager.getPlayer = function()
{
   $.ajax({
      type: "POST",  
      url: "/player",
      headers: {"X-Auth-Token": App.authToken},
      dataType: "json",
      success: function (player, textStatus, jqXHR)
      {
         UserManager.receivedPlayer(player, function(){
            App.get('router').transitionTo('game');
         })
      }
   });
}

//-------------------------------------------//

UserManager.getPlayerByFacebookId = function()
{
   console.log("--> getPlayerByFacebookId")

   var params = new Object();
   params["facebookData"] = Facebook.data
   params["accessToken"] = Facebook.accessToken

   $.ajax({
      type: "POST",  
      url: "/playerFromFB",
      data: JSON.stringify(params),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result)
      {
         console.log("---> getPlayerByFacebookId ok")
         console.log(result)
         App.authToken = result.authToken
         UserManager.receivedPlayer(result.player, function(){
            App.get('router').transitionTo('game');
         })
      },
      error:function(){
         console.log("--> unauthorized")
         UserManager.setupForms()
         UserManager.openSigninFB()
      }
   });
}

UserManager.openSigninFB = function(){

   $("#signinWindow").trigger("reveal:close");
   $("#loginWindow").trigger("reveal:close");
   $("#confirmFBWindow").trigger("reveal:close");

   $("#signinFBWindow").reveal({
      animation: 'fade',
      animationspeed: 100, 
   });

   $("#fbForm_title").text("Welcome " + Facebook.data.name + " !" )
   $("#fbForm_firstName").val(Facebook.data.first_name)
   $("#fbForm_lastName").val(Facebook.data.last_name)
   $("#fbForm_birthDate").val(Facebook.data.birthday)
   $("#facebookPicture").attr('src', Facebook.data.picture.data.url)
}

//-------------------------------------------//

UserManager.logout = function(){
   if(Facebook.accessToken){
      Facebook.logout()
      $.removeCookie('facebookId');
   }

   $.removeCookie('authToken');
   App.user.set("loggedIn", false)
   App.get('router').transitionTo('home');
}

//-------------------------------------------//

UserManager.signinFormReady = function(){

   var form1Ready = $("#signinForm1").valid()
   var form2Ready = $("#signinForm2").valid()
   var formReady = form1Ready && form2Ready

   return formReady
}

UserManager.signinFormFBReady = function(){
   return $("#fbForm").valid()
}


//-------------------------------------------//

UserManager.signin = function()
{
   App.user.email       = $("#email").val() 
   App.user.firstName   = $("#firstName").val() 
   App.user.lastName    = $("#lastName").val() 
   App.user.birthDate   = Utils.dateToString($("#birthDate").datepicker("getDate"))
   App.user.referrerId  = $("#referrerId").val() 

   delete App.user.facebookId
   delete App.user.facebookName 

   var passwordHash  = CryptoJS.SHA512($("#password").val());
   var password512   = passwordHash.toString(CryptoJS.enc.Hex)
   App.user.password = password512

   $("#signinWindow").trigger("reveal:close");
   App.wait()

   var params = new Object();
   params["user"] = App.user;

   $.ajax({
      type: "POST",  
      url: "/signin",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response){
         App.free()

         $("#loginWindow").reveal({
            animation: 'fade',
            animationspeed: 100, 
         });

         $("#loginemail").val(App.user.email)
      },
      error: function (data){
         //no json returned -> reach error
         App.free()
         if(data.responseText == "email"){
            App.message(App.translations.messages.AccountEmailExists, false)
         }
         else if(data.responseText == "names"){
            App.message(App.translations.messages.AccountNamesExist, false)
         }
      }
   });

}


//-------------------------------------------//

UserManager.signinFB = function()
{
   App.user.email                = Facebook.data.email
   App.user.facebookName         = Facebook.data.name
   App.user.facebookId           = Facebook.data.id
   App.user.firstName            = $("#fbForm_firstName").val() 
   App.user.lastName             = $("#fbForm_lastName").val() 
   App.user.birthDate            = Utils.dateToString($("#fbForm_birthDate").datepicker("getDate"))
   App.user.referrerId           = $("#fbForm_referrerId").val() 

   $("#signinFBWindow").trigger("reveal:close");
   App.wait()

   var params = new Object();
   params["user"] = App.user;
   params["accessToken"] = Facebook.accessToken;

   $.ajax({
      type: "POST",  
      url: "/signinFromFacebook",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response){
         if(response){
            console.log("---> signinFB ok")
            console.log(response)
            App.free()
            App.authToken = response.authToken
            UserManager.receivedPlayer(response.player)
         }
         else{
            // todo merge
            App.message(App.translations.messages.AccountNamesExist, false)
         }
      }
   });

}

//-------------------------------------------//

UserManager.login = function()
{
   if($("#loginForm").valid()){
      var user = {}
      user.email       = $("#loginemail").val() 

      var passwordHash  = CryptoJS.SHA512($("#loginpassword").val());
      var password512   = passwordHash.toString(CryptoJS.enc.Hex)
      user.password = password512

      $("#loginWindow").trigger("reveal:close");
      App.wait()

      var params = new Object();
      params["user"] = user;

      $.ajax({
         type: "POST",  
         url: "/login",
         data: JSON.stringify(params),  
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (response){
            App.free()
            if(response){
               App.authToken = response.authToken
               UserManager.getPlayer()
            }
         },
         error: function(){
            App.free()
            App.message("Wrong login/password", false)
         }
      });

   }
}

//-------------------------------------------//

UserManager.mobileLogin = function(callback)
{
   if($("#loginForm").valid()){
      var user = {}
      user.email       = $("#loginemail").val() 

      var passwordHash  = CryptoJS.SHA512($("#loginpassword").val());
      var password512   = passwordHash.toString(CryptoJS.enc.Hex)
      user.password = password512

      App.wait()

      var params = new Object();
      params["user"] = user;

      $.ajax({
         type: "POST",  
         url: "/login",
         data: JSON.stringify(params),  
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (result){
            App.free()
            callback(result)
         },
         error: function(){
            App.free()
            App.message("Wrong login/password", false)
         }
      });

   }
}

//-------------------------------------------//

UserManager.mobileSignin = function(callback)
{
   var user = {}

   user.email       = $("#email").val() 
   user.firstName   = $("#firstName").val() 
   user.lastName    = $("#lastName").val() 
   user.birthDate   = Utils.dateToString($("#birthDate").datepicker("getDate"))
   user.referrerId  = $("#referrerId").val() 

   var passwordHash  = CryptoJS.SHA512($("#password").val());
   var password512   = passwordHash.toString(CryptoJS.enc.Hex)
   user.password = password512

   App.wait()

   var params = new Object();
   params["user"] = user;

   $.ajax({
      type: "POST",  
      url: "/signin",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (){
         App.free()
         callback()
      },
      error: function (data){
         //no json returned -> reach error
         App.free()
         if(data.responseText == "email"){
            App.message(Translator.messages["AccountEmailExists"], false)
         }
         else if(data.responseText == "names"){
            App.message(Translator.messages["AccountNamesExist"], false)
         }
      }
   });
}

//-------------------------------------------//

UserManager.mobileSigninFB = function(callback)
{
   if($("#fbForm").valid()){
      var user = {}
      user.email                = Utils.getURLParameter("email")
      user.facebookName         = Utils.getURLParameter("facebookName")
      user.facebookId           = Utils.getURLParameter("facebookId")
      user.firstName            = $("#fbForm_firstName").val() 
      user.lastName             = $("#fbForm_lastName").val() 
      user.birthDate            = Utils.dateToString($("#fbForm_birthDate").datepicker("getDate"))
      user.referrerId           = $("#fbForm_referrerId").val() 

      App.wait()

      var params = new Object();
      params["user"] = user;

      $.ajax({
         type: "POST",  
         url: "/signinFromFacebook",
         data: JSON.stringify(params),  
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (result){
            if(result){
               console.log("---> signinFromFacebook",result)
               App.free()
               callback(result)
            }
            else{
               // todo merge
               App.message(App.translations.messages.AccountNamesExist, false)
            }
         }
      });

   }
}

//-------------------------------------------//

UserManager.setupForms = function() 
{
   $( "#birthDate" ).datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:-12"
   });

   $( "#fbForm_birthDate" ).datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:-12"
   });

   $.validator.addMethod(
         "same",
         function(value, element, params) {
            var target = $(params).val();
            return target == value
         }
   );

   $("#signinForm1").validate({
      rules: {
         firstName: {
            required: true,
         },
         lastName: {
            required: true,
         },
         email: {
            required: true,
            email: true
         },
      },
      messages: {
         firstName: {
            required: "Required",
         },
         lastName: {
            required: "Required",
         },
         email: {
            required: "Required",
         },
      }
   });

   $("#signinForm2").validate({
      rules: {
         birthDate: {
            required: true,
         },
         password: {
            required: true,
         },
         repeatPassword: {
            required: true,
            same: "#password"
         },
      },
      messages: {
         birthDate: {
            required: "Required",
         },
         password: {
            required: "Required",
         },
         repeatPassword: {
            required: "Required",
            same: "Must match password !"
         }
      }
   });


   $("#fbForm").validate({
      rules: {
         firstName: {
            required: true,
         },
         lastName: {
            required: true,
         },
         birthDate: {
            required: true,
         },
      },
      messages: {
         firstName: {
            required: "Required",
         },
         lastName: {
            required: "Required",
         },
         birthDate: {
            required: "Required",
         }
      }
   });

   $("#loginForm").validate({
      rules: {
         loginemail: {
            required: true,
            email: true
         },
         loginpassword: {
            required: true,
         },
      },
      messages: {
         loginemail: {
            required: "Required",
         },
         loginpassword: {
            required: "Required",
         },
      }
   });
}

//-------------------------------------------------------------------//

UserManager.checkIdlePoints = function() {

   console.log("checkIdlePoints")
   if(App.user.idlePoints > 0){
      var points = App.user.idlePoints + App.user.currentPoints
      var nbTickets = Math.floor(points/App.Globals.POINTS_TO_EARN_A_TICKET)

      var message = App.translations.messages.YouHaveEarned + " : ";
      message += points + " pts";

      if(nbTickets > 0){

         var plural = ""
            if(nbTickets > 1) { plural = "s" }

         message += " = " + nbTickets + " " + App.translations.messages.Ticket + plural
      }

      App.message(message);
      UserManager.convertIdlePoints()
   }

   else if(App.user.currentPoints >= App.Globals.POINTS_TO_EARN_A_TICKET){

      var message = App.translations.messages.YouHaveEarnedExtra;
      message += " (" + App.Globals.POINTS_TO_EARN_A_TICKET + " pts = 1 " + App.translations.messages.Ticket + ")";

      App.Globals.confirmationMessage = message;

      console.log("convertCurrentPoints", message)
      odump(App.Globals)

      UserManager.convertCurrentPoints()
   }
}


//-------------------------------------------------------------------//

UserManager.convertIdlePoints = function() {

   App.user.set("currentPoints", App.user.currentPoints + App.user.idlePoints)
   App.user.set("totalPoints", App.user.totalPoints + App.user.idlePoints)
   App.user.set("idlePoints", 0)

   UserManager.convertCurrentPoints()
}

//-------------------------------------------------------------------//

UserManager.convertCurrentPoints = function() {
   UserManager.convertPointsToTickets()
   UserManager.updatePlayer()
}

//-----------------------------------------------------------------------------------------

UserManager.convertPointsToTickets = function() {

   var conversion = 0

   while (App.user.currentPoints >= App.Globals.POINTS_TO_EARN_A_TICKET) {
      App.user.set("currentPoints", App.user.currentPoints - App.Globals.POINTS_TO_EARN_A_TICKET)
      App.user.set("extraTickets", App.user.extraTickets + 1)

      conversion++
   }

   return conversion
}
