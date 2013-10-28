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
      App.wait()
      App.translator.setLang(lang);
      var currentPage = App.Globals.currentPage
      App.get('router').transitionTo('home');
      App.get('router').transitionTo(currentPage);
      App.free()
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

      $.blockUI({ message: '<h1>'+message+'</h1>', 
         fadeIn: 700, 
         fadeOut: 700, 
         timeout: 2000, 
         showOverlay: false, 
         centerY: false, 
         css: { 
            width: '350px', 
            top: '70px', 
            left: '', 
            right: '10px', 
            border: 'none', 
            padding: '5px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .6, 
            color: '#fff' 
         } 
      }); 

      $(".blockUI h1").css("background","url(/assets/images/"+(ok ? "ok" : "ko")+".png) no-repeat 10px 10px")
      $(".blockUI h1").css("background-size","15%")
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