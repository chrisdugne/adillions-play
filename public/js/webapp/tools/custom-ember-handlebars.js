
//---------------------------------------------------------------------------------------//
// Lottery
//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('lotteryPrice', function(lottery) {
    return "$ " + Math.min(lottery.maxPrice, Math.max(lottery.minPrice, lottery.nbTickets/1000 * lottery.cpm))
});

Ember.Handlebars.registerBoundHelper('themeImage', function(lottery) {
   console.log(lottery.theme.image)
   return new Handlebars.SafeString("<img class='themeImage' src=\""+lottery.theme.image+"\"/>")
});

Ember.Handlebars.registerHelper('langImage', function(options) {
   var customclass = options.hash.customclass
   var path = "/assets/images/bylang/" + App.translator.lang + "/" + options.hash.png
   var img = "<div><img id='"+options.hash.id+"' class='"+customclass+"' src='"+path+"'></img></div>"
   return new Handlebars.SafeString(img)
});

Ember.Handlebars.registerBoundHelper('pointsImage', function(user) {
   var path = "/assets/images/points/points." + user.currentPoints + ".png"
   var img = "<img class=\"mobileIcon touchable\" id='pointsImage' src='"+path+"'></img>"
   return new Handlebars.SafeString(img)
});

//---------------------------------------------------------------------------------------//
// Utils
//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerHelper('date', function(options) {
   var date = options.hash.value.split("-");
   var year = date[0];
   var month = date[1];
   var day = date[2];

   switch (App.translator.lang) {
      case "fr":
         return day + "/" + month + "/" + year;

      case "en":
      default:
         return year + "." + month + "." + day;
      
   }
});

/**
* transform 1356095267229 ==> 21/12/2012
*/
Ember.Handlebars.registerBoundHelper('formatDate', function(uploadTime, options) {
 return Utils.formatDate(uploadTime);
});

/**
* transform 1356095267229 ==> 21/12/2012
*/
Ember.Handlebars.registerBoundHelper('readableFullDate', function(uploadTime, options) {
 return Utils.readableFullDate(uploadTime);
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
