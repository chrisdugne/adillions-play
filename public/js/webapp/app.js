(function( win ) {
   'use strict';
   
   win.App = null 
   win.App = Ember.Application.create({
      VERSION: '1.0',
      rootElement: '#webappDiv',
      //storeNamespace: 'todos-emberjs',
      // Extend to inherit outlet support
      ApplicationController: Ember.Controller.extend(),
      ready: function() {
         //	initialisation is done inside model.Globals
      }
   });
   
   //------------------------------------------------------//
   
   App.Page = Em.Route.extend({
       enter: function(router) {
          window.scrollTo(0, 0);
       }
   });
   
   //------------------------------------------------------//

   App.fillView = function(){
      if(($("#webappDiv").height() + App.Globals.FOOTER_HEIGHT) <= $(window).height()){
         $("#webappDiv").css({ "height" : ($(window).height() - App.Globals.FOOTER_HEIGHT) +"px" });
      }
   }

   //------------------------------------------------------//

   $(window).on("resize", function(){
      App.fillView()
   });
   
   //------------------------------------------------------//

   App.authToken = $.cookie("authToken")

   //------------------------------------------------------//

})( this );