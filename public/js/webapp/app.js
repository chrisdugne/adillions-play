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

    App.init = function(sponsorRequestId){

        //------------------------------------------------------//

        App.Globals.set("country", "us");
        
        $.ajax({ 
            type        : "GET",
            dataType    : "jsonp",
            url         : "https://freegeoip.net/json/", 
            timeout     : 2000,
            success     : function(response) {
                App.Globals.set("country", response["country_code"]);
            },
            complete    : function(response) {
                App.loadApp();
            } 
        });

    }

    //------------------------------------------------------//

    App.loadApp = function(){
        //------------------------------------------------------//
        //   App.youtubeManager = new YoutubeManager();
        LotteryManager.refreshNextLottery()
        LotteryManager.getFinishedLotteries()

        //------------------------------------------------------//

        var failure    = function(){
            App.loginAdillions()
        }

        var finalize   = function(){  
            App.Globals.APP_READY = true
        }

        Facebook.init({
            finalizeInit            : finalize,
            notConnectedCallback    : failure, 
            sponsorRequestId        : sponsorRequestId
        })
    }

    //------------------------------------------------------//

    App.loginAdillions = function(force){

        console.log("---------> App.loginAdillions")
        if(!$.cookie('facebookId') || force){
            $.removeCookie('facebookId')  
            UserManager.getPlayer();
        }
        else{
            // le authToken est lié à un compte FB : ne pas logguer le mec, il est deco de FB ! (donc pas de getPlayer)
            // delete authToken
            $.removeCookie('authToken');
        } 
    }

    //------------------------------------------------------//

    App.fillView = function(){
        console.log("fillView", $("#webappDiv").height() + App.Globals.FOOTER_HEIGHT, $(window).height())
        if(($("#webappDiv").height() + App.Globals.FOOTER_HEIGHT) < $(window).height()){
            $("#gameView").css({ "height" : ($(window).height() - App.Globals.FOOTER_HEIGHT - App.Globals.HEADER_HEIGHT) +"px" });
            $("#footerHome").css({ "position" : "absolute" });
        }
    }

    App.releaseFooter = function(){
        $("#footerHome").css({ "position" : "relative" });
    }

    //------------------------------------------------------//

    App.applyResize = function (){
        // Haven't resized in 100ms!
        App.fillView()
    }   

    var doit
    $(window).on("resize", function(){
        clearTimeout(doit);
        doit = setTimeout(App.applyResize, 100);   
    });

    //------------------------------------------------------//

    App.showSocialButtons = function (){
        $("#twitterFollowButtonContainer").append( $("#twitterFollowButton") );
        $("#facebookFollowButtonContainer").append( $("#facebookFollowButton") );
        $("#twitterShareButtonContainer").append( $("#twitterShareButton") );
    }

    App.hideSocialButtons = function (){
        $("#socialContainer").append( $("#twitterFollowButton") );
        $("#socialContainer").append( $("#facebookFollowButton") );   
        $("#socialContainer").append( $("#twitterShareButton") );
    }

    //------------------------------------------------------//

    App.authToken = $.cookie("authToken")

    //------------------------------------------------------//

})( this );

