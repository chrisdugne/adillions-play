//---------------------------------------------------------------------------------------//

/**
 * data contains the file to upload
 */
Handlebars.registerHelper('email', function(options) {

   var email = "";
   var guymal_enc;
   switch(options.hash.name){

      case "chris":
         guymal_enc= "entou(bsahcFkgvctogj(eik";
         break;

      case "contact":
      default:
         guymal_enc= "eihrgerFkgvctogj(eik";
      break;

   }

   for(guymal_i=0;guymal_i<guymal_enc.length;++guymal_i)
      email += String.fromCharCode(6^guymal_enc.charCodeAt(guymal_i));

   return email;
});

//---------------------------------------------------------------------------------------//