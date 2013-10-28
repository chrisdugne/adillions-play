//----------------------------//
//Utils
//----------------------------//

this.Utils = {};

//----------------------------//

//Utils.blackScrollTrack = function(){
//var rules = document.styleSheets[0].cssRules;
//for(var i=0; i < rules.length; i++) {
//if(rules[i].type != 1)
//console.log(rules[i]);
//}

//document.styleSheets[0].addRule("::-webkit-scrollbar-track", "background: rgba(0,0,0,0);");
//} 

/*
 * zeroPad(5, 2) 	--> "05"
   zeroPad(1234, 2) --> "1234"
 */
Utils.zeroPad = function(num, places) 
{
   var zero = places - num.toString().length + 1;
   return Array(+(zero > 0 && zero)).join("0") + num;
}

/*
 * now as YYYY-MM-DD
 */
Utils.dateTime = function()
{
   var now = new Date();
   return now.getFullYear() + "-" 
   + Utils.zeroPad(now.getMonth()+1, 2) + "-" 
   + Utils.zeroPad(now.getDate(), 2);
}

/*
 * date as YYYY-MM-DD
 */
Utils.dateToString = function(date)
{
   return date.getFullYear() + "-" 
   + Utils.zeroPad(date.getMonth()+1, 2) + "-" 
   + Utils.zeroPad(date.getDate(), 2);
}

//----------------------------------------------------------------------------------------//

Utils.alert = function (area, type, title, message) {
   $("#" + area).append($("<div class='alert-message alert-" + type + " fade in' data-alert><a class=\"btn btn-rounded btn-icon-only btn-dark closer\" data-dismiss=\"alert\"> <i class=\"icon icon-ex-white-outline\"></i></a><h4 class=\"alert-heading\">"+title+"</h4> " + message + " </div>"));
   //$(".alert-message").delay(2000).fadeOut("slow", function () { $(this).remove(); });
}

//----------------------------------------------------------------------------------------//

/*
 * helpers for html encoding and decoding
 */
Utils.htmlEncode = function (value){
   return $('<div/>').text(value).html();
}

Utils.htmlDecode = function(value){
   return $('<div/>').html(value).text();
}

//----------------------------------------------------------------------------------------//

/*
 */
Utils.replaceAll = function(chain, value, replacement)
{
   return chain.replace(new RegExp(value, 'g'), replacement);
}

//----------------------------------------------------------------------------------------//

Utils.rgbToHex = function (r, g, b) {
   if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
   return ((r << 16) | (g << 8) | b).toString(16);
}

//----------------------------------------------------------------------------------------//

/***
 * bytes = 36550
 * return 36.55 KB
 */
Utils.formatFileSize = function (bytes) 
{
   if (typeof bytes !== 'number') {
      return '';
   }
   if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(2) + ' GB';
   }
   if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(2) + ' MB';
   }
   return (bytes / 1000).toFixed(2) + ' KB';
}
//----------------------------------------------------------------------------------------//

/***
 * timestamp = 1355342389711
 * return 12/12/2012
 * 
 * timestamp = undefined => use today.
 * 
 * @Improve #MAP-12
 */
Utils.formatDate = function(timestamp) 
{
   var now     = timestamp == undefined ? new Date() : new Date(timestamp);
   var day     = Utils.zeroPad(now.getDate(), 2);
   var month   = Utils.zeroPad(now.getMonth() + 1, 2); //Months are zero based
   var year    = now.getFullYear();
   
   if(App.translator){
      console.log(App.translator)
      
      if(App.translator.lang == "fr")
         return day + "/" + month + "/" + year;
      
      if(App.translator.lang == "en")
         return month + "/" + day + "/" + year ;
   }
   
   return day + "/" + month + "/" + year;
}

Utils.readableFullDate = function(timestamp) 
{
   var now        = timestamp == undefined ? new Date() : new Date(timestamp);
   var day        = Utils.zeroPad(now.getDate(), 2);
   var month      = Utils.zeroPad(now.getMonth() + 1, 2); //Months are zero based
   var year       = now.getFullYear();
   var dayName    = App.translations.messages.Days[now.getDay()];
   var monthName  = App.translations.messages.Months[month-1];
   
   if(App.translator){
      
      if(App.translator.lang == "fr")
         return dayName + " " + day + " " + monthName + " " + year;
      
      if(App.translator.lang == "en"){
         var suffix = Utils.getNumberSuffix(now.getDate())
         return dayName+ ", " + monthName + " " + day + suffix + ", " + year ;
      }
            
   }
   
   return day + "/" + month + "/" + year;
}

//----------------------------------------------------------------------------------------//

Utils.getNumberSuffix = function(num){

   var suffix = "";

   if(num == 1) 
      suffix = "st";
   else if(num == 2)
      suffix = "nd";
   else if(num == 3)
      suffix = "rd";
   else
      suffix = "th";

   return suffix;

}

//----------------------------------------------------------------------------------------//

//return 1->i
Utils.random1 = function(i){
   return Math.floor(Math.random()*i) + 1;
}

//return 0->i
Utils.random0 = function(i){
   return Math.floor(Math.random()*(i+1));
}

//----------------------------------------------------------------------------------------//

Utils.generateGuid = function() 
{
   var result, i, j;
   result = '';
   for(j=0; j<32; j++) {
      if( j == 8 || j == 12|| j == 16|| j == 20)
         result = result + '_';
      i = Utils.random0(15).toString(16).toUpperCase();
      result = result + i;
   }
   return result;
}

//----------------------------------------------------------------------------------------//

Utils.popup = function(url, title, width, height) 
{
   var left = (screen.width/2)-(width/2);
   var top = (screen.height/2)-(height/2);
   return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);
}

//----------------------------------------------------------------------------------------//

/**
 * custom mustache evaluation : )
 * data is used for the functions-in-customMustache parameters 
 * 
 * http://map.x-ray.fr/wiki/display/IDEES/Custom+Mustaches
 */
Utils.toHtml = function(template)
{
   while(template.indexOf("{") != -1)
   {
      var customMustache = template.substring(template.indexOf("{"), template.indexOf("}")+1);

      var html = eval(customMustache);
      template = template.replace(customMustache, html);
   }

   return template;
}

//----------------------------------------------------------------------------------------//

Utils.isObject = function(stuff) 
{
   return Object.prototype.toString.call( stuff ) === '[object Object]' ;
}

/**
 * Ember : edition + binding of objects contained in an array : thanks to ObjectProxy
 */
Utils.editObjectInArray = function(object, property, value)
{
   var proxy = Ember.ObjectProxy.create({
      content: object
   });

   proxy.set(property, value);
}

//----------------------------------------------------------------------------------------//

Utils.apply = function (toObject, methodName){
   return (function(param1, param2, param3, param4, param5, param6){toObject[methodName](param1, param2, param3, param4, param5, param6)});
}

Utils.randomRotate = function (element) {

   var rotation = Utils.random0(15) - 8
   if(Math.abs(rotation) < 2)
      Utils.randomRotate(element)
   else{
      $("#"+element).css("-webkit-transform", "rotate("+rotation+"deg)")
      $("#"+element).css("-moz-transform", "rotate("+rotation+"deg)")
   }
      
}

//----------------------------------------------------------------------------------------//

Utils.getURLParameter = function (name) {
   return decodeURI(
       (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
   );
}

//----------------------------------------------------------------------------------------//

Utils.cloneJsonObject = function (jsonObject) {
   return $.parseJSON(JSON.stringify(jsonObject));
}

function odump(o){
   console.log(Utils.cloneJsonObject(o));
}
