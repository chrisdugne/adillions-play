(function( win ) {
   'use strict';

   //------------------------------------------------------//
   
   win.App = win.App || {}
   
   //------------------------------------------------------//

   App.spinOpts = {
     lines: 13, // The number of lines to draw
     length: 20, // The length of each line
     width: 10, // The line thickness
     radius: 30, // The radius of the inner circle
     corners: 1, // Corner roundness (0..1)
     rotate: 0, // The rotation offset
     direction: 1, // 1: clockwise, -1: counterclockwise
     color: '#fff', // #rgb or #rrggbb or array of colors
     speed: 1, // Rounds per second
     trail: 60, // Afterglow percentage
     shadow: false, // Whether to render a shadow
     hwaccel: false, // Whether to use hardware acceleration
     className: 'spinner', // The CSS class to assign to the spinner
     zIndex: 2e9, // The z-index (defaults to 2000000000)
     top: 'auto', // Top position relative to parent in px
     left: 'auto' // Left position relative to parent in px
   };
   
   //------------------------------------------------------//
   
   App.changeLang = function(lang) {
      App.translator.setLang(lang);
      App.user.set("lang", lang);
   }
   
   //------------------------------------------------------//
   
   App.wait = function() {
      $.blockUI({ message: '<div id="waitingDiv"></div>' });
      var target = document.getElementById("waitingDiv");
      App.spinner = new Spinner(App.spinOpts).spin(target);
      $(".blockMsg").css("border","0px")
   }
   
   App.lock = function() {
      $.blockUI({ message: '<div id="waitingDiv"></div>' });
      var target = document.getElementById("waitingDiv");
      $(".blockMsg").css("border","0px")
   }

   App.free = function() {
      $.unblockUI() 
   }

   App.message = function(message, ok) {
      
      if($(".container").length > 0){
         console.log($(".container").length)
         var width = $(".container").css("width").split("px")[0]
      }
      else
         var width = $(window).width()
      
      $.unblockUI();
      $.blockUI({ message: '<p>'+message+'</p>', 
         fadeIn: 400, 
         fadeOut: 100, 
         timeout: 2000, 
         showOverlay: false, 
         css: { 
            width: width+'px', 
            top: '67px', 
            left:'',
            height:'35px',
            border: 'none', 
            paddingTop:'18px',
            backgroundColor: '#fff', 
            opacity: 1, 
            color: '#333', 
            fontSize: '20px', 
         } 
      }); 
      
      $('.blockUI').click($.unblockUI)
   }

   //------------------------------------------------------//

   App.openPrezi = function() 
   {
      $('#preziWindow').off('reveal:hidden');
      $('#preziWindow').off("reveal:revealed");
      
      $("#preziWindow").reveal({
         animation: 'fade',
         animationspeed: 100, 
      });

      $('#preziWindow').on('reveal:hidden', function(){
         $("#maperialPrezi").remove()
      });

      $('#preziWindow').append("<div class='row-fluid darkest' id='maperialPrezi'>" +
            "<object data='http://prezi.com/e6x5_urdmufe/view' width='100%' height='600px'  ></object >" +
      "</div>")
      
      // center.....dont ask me about the + 285 stuff
      var left = ($(window).width()/2 - $("#preziWindow").width()/2) + 285
      
      $("#preziWindow").css("left",left+"px");
   }

   
   //------------------------------------------------------//

   App.changedTranslations = function(event, messages) {
      App.translations.set("messages", messages);
   }

   //------------------------------------------------------//

})( this );