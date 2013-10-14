//-------------------------------------------//
//UserManager
//-------------------------------------------//

this.UserManager = {};

//-------------------------------------------//

UserManager.receivedPlayer = function(player)
{
   App.user.set("uid",              player.uid);
   App.user.set("email",            player.email);
   App.user.set("userName",         player.userName);
   App.user.set("firstName",        player.firstName);
   App.user.set("lastName",         player.lastName);
   App.user.set("birthDate",        player.birthDate);
   App.user.set("referrerId",       player.referrerId);

   App.user.set("currentPoints",    player.currentPoints);
   App.user.set("idlePoints",       player.idlePoints);
   App.user.set("totalPoints",      player.totalPoints);

   App.user.set("facebookId",       player.facebookId);

   App.user.set("drawTickets",      player.drawTickets);
   App.user.set("lotteryTickets",   player.lotteryTickets);
   
   App.user.set("loggedIn",         true)   

   App.message("Welcome back " + player.userName + " !", true)

   //----------------------------------

   if(Facebook && Facebook.finalizeInit)
      Facebook.finalizeInit();

   //----------------------------------

   $.ajax({
      type: "POST",  
      url: "/nextLottery",
      headers: {"X-AUTH-TOKEN": App.authToken},
      dataType: "json",
      success: function (lottery, textStatus, jqXHR)
      {
         console.log(lottery)
      }
   });
}


//-------------------------------------------//

UserManager.getPlayer = function()
{
   $.ajax({
      type: "POST",  
      url: "/player",
      headers: {"X-AUTH-TOKEN": App.authToken},
      dataType: "json",
      success: function (player, textStatus, jqXHR)
      {
         UserManager.receivedPlayer(player)
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
         UserManager.receivedPlayer(result.player)
      },
      error:function(){

         console.log("--> unauthorized")
         UserManager.setupForms()
         
         if(App.Globals && App.Globals.signinRequested){
            try{

               $("#signinWindow").trigger("reveal:close");
               $("#loginWindow").trigger("reveal:close");
               
               $("#signinFBWindow").reveal({
                  animation: 'fade',
                  animationspeed: 100, 
               });
            }catch(e){}
         }
         
         $("#fbForm_title").text("Welcome " + Facebook.data.name + " !" )
         $("#fbForm_firstName").val(Facebook.data.first_name)
         $("#fbForm_lastName").val(Facebook.data.last_name)
         $("#fbForm_birthDate").val(Facebook.data.birthday)
         $("#facebookPicture").attr('src', Facebook.data.picture.data.url)
      }
   });
}

//-------------------------------------------//

UserManager.signin = function()
{
   var form1Ready = $("#signinForm1").valid()
   var form2Ready = $("#signinForm2").valid()
   var formReady = form1Ready && form2Ready
   
   if(formReady){
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
               App.message("_An account with this email exists", false)
            }
            else if(data.responseText == "names"){
               App.message("_An account with these names exists", false)
            }
         }
      });

   }
}


//-------------------------------------------//

UserManager.signinFB = function()
{
   if($("#fbForm").valid()){
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
               App.message("_An account with these names exists", false)
            }
         }
      });
      
   }
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
   var form1Ready = $("#signinForm1").valid()
   var form2Ready = $("#signinForm2").valid()
   var formReady = form1Ready && form2Ready
   
   if(formReady){
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
         }
      });
   }
}

//-------------------------------------------//

UserManager.mobileSigninFB = function(callback)
{
   if($("#fbForm").valid()){
      var user = {}
      user.email                = Facebook.data.email
      user.facebookName         = Facebook.data.name
      user.facebookId           = Facebook.data.id
      user.firstName            = $("#fbForm_firstName").val() 
      user.lastName             = $("#fbForm_lastName").val() 
      user.birthDate            = Utils.dateToString($("#fbForm_birthDate").datepicker("getDate"))
      user.referrerId           = $("#fbForm_referrerId").val() 

      App.wait()

      var params = new Object();
      params["user"] = user;
      params["accessToken"] = Facebook.accessToken;

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
               App.message("_An account with these names exists", false)
            }
         }
      });

   }
}

//-------------------------------------------//

UserManager.setupForms = function() 
{
   $(function() {
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