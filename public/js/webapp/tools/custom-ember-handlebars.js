
//---------------------------------------------------------------------------------------//
//Website
//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('themeWeb', function(theme) {
   var img = "<img id=\"themeWeb\" src='"+theme.webImage+"'></img>"
   return new Handlebars.SafeString(img)
});

Ember.Handlebars.registerBoundHelper('charityName', function(level) {
   
   if(!level)
      level = 0
      
   return App.translations.messages.Charities[level]
});

//---------------------------------------------------------------------------------------//
//Lottery
//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('price', function(price) {
   console.log("--------> ", App.Globals.country)
   return Utils.displayPrice(price, App.Globals.country)
});

Ember.Handlebars.registerBoundHelper('themeImage', function(lottery) {
   return new Handlebars.SafeString("<img class='themeImage rounded' src=\""+lottery.theme.image+"\"/>")
});

//--------------------------------------//

Ember.Handlebars.registerBoundHelper('langImage', function(lang, options) {
   
   if(lang == null)
      lang = "en"
   
   var customclass = options.hash.customclass
   var path = "/assets/images/bylang/" + lang + "/" + options.hash.png
   var img = "<div><img id='"+options.hash.id+"' class='"+customclass+"' src='"+path+"'></img></div>"
   return new Handlebars.SafeString(img)
});

//--------------------------------------//

Ember.Handlebars.registerBoundHelper('pointsImage', function(points) {
 
   if(!points)
      points = 0
   
   var path = "/assets/images/points/points." + points + ".png"
   var img = "<img class=\"mobileIcon touchable\" id='pointsImage' src='"+path+"'></img>"
  
   return new Handlebars.SafeString(img)
});

//--------------------------------------//

Ember.Handlebars.registerBoundHelper('staticPointsImage', function(points) {
   
   if(!points)
      points = 0
      
   var path = "/assets/images/points/points." + points + ".png"
   var img = "<img class=\"mobileIcon upper\" src='"+path+"'></img>"
   
   return new Handlebars.SafeString(img)
});

//==========================================================================================//

Ember.Handlebars.registerBoundHelper('newticket', function(numbers) {
   
   //-------------------------------------------------------//
   
   if(!jQuery.isArray(numbers))
      numbers = $.parseJSON(numbers)
   
   if(App.nextLottery.theme.icons[numbers.length-1] == null)
      return "";
   
   //-------------------------------------------------------//
   
   var div = "<div class='row-fluid marginbottom2'>";
   
   //-------------------------------------------------------//
   // balls
   
   for(var n = 0; n < numbers.length-1; n++){
      var ball   = "<div class='span2'><img src='/assets/images/balls/ball.small.green.png' class='ball'></img>"
      var num    = "<p class='numwhite'>"+numbers[n]+"</p></div>"
      
      div += ball
      div += num
   }
   
   //-------------------------------------------------------//
   // theme
   
   var luckyball   = "<div class='span2'><img src='"+App.nextLottery.theme.icons[numbers.length-1].image+"' class='smallThemeBall'></img>"
   var mask   = "<img src='/assets/images/balls/ball.mask.png' class='smallThemeBall'></img></div>"
   
   div += luckyball
   div += mask
   
   //-------------------------------------------------------//
   
   div += "</div>";
   
   return new Handlebars.SafeString(div)
});


//==========================================================================================//

Ember.Handlebars.registerBoundHelper('oldticket', function(numbers, options) {
   
   //-------------------------------------------------------//

   var lotteryNumbers = options.hash.lotteryNumbers;
   
   if(!jQuery.isArray(numbers))
      numbers = $.parseJSON(numbers);

   if(!jQuery.isArray(lotteryNumbers))
      lotteryNumbers = $.parseJSON(lotteryNumbers);
   
   if(App.nextLottery.theme.icons[numbers.length-1] == null)
      return "";
   
   //-------------------------------------------------------//

   var div = "<div class='row-fluid marginbottom2'>";
   
   //-------------------------------------------------------//
   // balls
   
   for(var n = 0; n < numbers.length-1; n++){
      
      var imageClass = "ball lost";
      var won  = false;
      for(var w = 0; w < lotteryNumbers.length-1; w++){
         if(numbers[n] == lotteryNumbers[w]){
            imageClass = "ball";
            won = true;
            break;
         }
      }
      
      var ball   = "<div class='span2'><img src='/assets/images/balls/ball.small.green.png' class='"+imageClass+"'></img>";
      var num    = "<p class='numwhite'>"+numbers[n]+"</p>";

      if(!won)
         num += "</div>"
      
      div += ball;
      div += num;
      
      if(won){
         var check   = "<img src='/assets/images/icons/check.png' class='checkIcon'></img></div>";
         div += check;
      }
      
   }
   
   //-------------------------------------------------------//
   // theme
   
   var imageClass = "smallThemeBall lost";
   var won  = numbers[numbers.length-1] == lotteryNumbers[lotteryNumbers.length-1];
   
   if(won){
      imageClass = "smallThemeBall";
   }
   
   var luckyball     = "<div class='span2'><img src='"+App.nextLottery.theme.icons[numbers.length-1].image+"' class='"+imageClass+"'></img>"
   var mask          = "<img src='/assets/images/balls/ball.mask.png' class='"+imageClass+"'></img>";

   if(!won)
      mask += "</div>";

   div += luckyball;
   div += mask;

   //-------------------------------------------------------//

   if(won){
      var check   = "<img src='/assets/images/icons/check.png' class='checkIcon'></img></div>";
      div += check;
   }

   //-------------------------------------------------------//

   div += "</div>";

   return new Handlebars.SafeString(div)
});

//==========================================================================================//


Ember.Handlebars.registerBoundHelper('availableTickets', function(user) {
   return new Handlebars.SafeString(user.availableTickets + user.totalBonusTickets - user.playedBonusTickets)
});

//---------------------------------------------------------------------------------------//
//Utils
//---------------------------------------------------------------------------------------//
//
//Ember.Handlebars.registerBoundHelper('date', function(lang, options) {
//   
//   console.log(options)
//   if(options.hash.date === undefined)
//      return "-"
//   
//   var date = options.hash.date.split("-");
//   var year = date[0];
//   var month = date[1];
//   var day = date[2];
//
//   var newDate = month+","+day+","+year;
//   var timestamp = new Date(newDate).getTime()
//
//   new Handlebars.SafeString(Utils.readableFullDate(timestamp, lang))
//});
//
///**
// * transform 1356095267229 ==> 21/12/2012
// */
//Ember.Handlebars.registerBoundHelper('formatDate', function(uploadTime, options) {
//   console.log("formatDate", uploadTime)
//   return Utils.formatDate(uploadTime);
//});

/**
 * transform 1356095267229 ==> Monday....2012
 */
Ember.Handlebars.registerBoundHelper('readableFullDate', function(lang, options) {
   return new Handlebars.SafeString(Utils.readableFullDate(options.hash.date, lang, options.hash.type));
});


//---------------------------------------------------------------------------------------//

/**
 * data contains the file to upload
 */
Ember.Handlebars.registerBoundHelper('fileName', function(data, options) {
   return data.files[0].name;
});


//---------------------------------------------------------------------------------------//

/**
 * defines a progressBar
 */
Ember.Handlebars.registerBoundHelper('progressBar', function(percentage, options) {
   var customclass = "";

   if(options.hash.class)
      customclass += " " + options.hash.class;
   else
      customclass += " progress";

   if(options.hash.span)
      customclass += " " + options.hash.span;

   return new Handlebars.SafeString("<div class=\""+customclass+"\"><div class=\"bar\" style=\"width: "+percentage+"%;\"></div></div>");
});

//---------------------------------------------------------------------------------------//

/**
 * transform 40303 ==> 40.30 KB
 */
Ember.Handlebars.registerBoundHelper('fileSize', function(size, options) {
   return Utils.formatFileSize(size);
});

//---------------------------------------------------------------------------------------//

/**
 * Display a specific html template whether data == value
 * Static version : need a view refresh but may use Ember {{action}} in templates
 * 
 * note using registerBoundHelper instead of registerHelper so that the data is not a string
 */
Ember.Handlebars.registerBoundHelper('equals', function(data, options) {
   if(data == options.hash.value)
      return options.fn(this);
   else
      return options.inverse(this);
});

/**
 * Display a specific html template whether data == value
 * Bound version : no need to refresh but CANNOT use Ember {{action}} in templates
 * See isset below for specific actions
 */
Ember.Handlebars.registerBoundHelper('bound_equals', 
      function(data, options) 
      {
   if(data == options.hash.value){
      return new Handlebars.SafeString(Utils.toHtml(options.hash.yes));
   }
   else{
      return new Handlebars.SafeString(Utils.toHtml(options.hash.no));
   }
      }
);

//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('textInput', 
      function(defaultValue, options) 
      {
   return new Handlebars.SafeString("<input id=\""+options.hash.id+"\" name=\""+options.hash.id+"\" class=\""+options.hash.class+"\" type=\"text\" value=\""+defaultValue+"\"/>");
      }
);

//---------------------------------------------------------------------------------------//
