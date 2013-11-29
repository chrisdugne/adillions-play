//-------------------------------------------//
//LotteryManager
//-------------------------------------------//

this.LotteryManager = {};

//-------------------------------------------//

LotteryManager.isGameAvailable = function(){
   return App.user.get("ticketsToPlay") > 0;
}

//-------------------------------------------//

LotteryManager.refreshNextLottery = function()
{
   App.wait()
   
   $.ajax({
      type: "POST",  
      url: "/nextLottery",
      dataType: "json",
      success: function (result)
      {
         var nextLottery = result.nextLottery
         var nextDrawing = result.nextDrawing
         
         App.nextLottery.set("uid",          nextLottery.uid)   
         App.nextLottery.set("date",         nextLottery.date)   
         App.nextLottery.set("maxPicks",     nextLottery.maxPicks)
         App.nextLottery.set("maxNumbers",   nextLottery.maxNumbers)   
         App.nextLottery.set("nbPlayers",    nextLottery.nbPlayers)   
         App.nextLottery.set("toolPlayers",  nextLottery.toolPlayers)   
         App.nextLottery.set("nbTickets",    nextLottery.nbTickets)   
         App.nextLottery.set("minPrice",     nextLottery.minPrice)   
         App.nextLottery.set("maxPrice",     nextLottery.maxPrice)   
         App.nextLottery.set("cpm",          nextLottery.cpm)   
         App.nextLottery.set("theme",        $.parseJSON(nextLottery.theme))  
         App.nextLottery.set("prizes",       $.parseJSON(nextLottery.prizes))  
         App.nextLottery.set("result",       $.parseJSON(nextLottery.result))
         
         App.nextDrawing.set("uid",          nextDrawing.uid)   
         App.nextDrawing.set("date",         nextDrawing.date)   
         App.nextDrawing.set("maxPicks",     nextDrawing.maxPicks)   
         App.nextDrawing.set("maxNumbers",   nextDrawing.maxNumbers)   
         App.nextDrawing.set("nbPlayers",    nextDrawing.nbPlayers)   
         App.nextDrawing.set("toolPlayers",  nextDrawing.toolPlayers)   
         App.nextDrawing.set("nbTickets",    nextDrawing.nbTickets)   
         App.nextDrawing.set("minPrice",     nextDrawing.minPrice)   
         App.nextDrawing.set("maxPrice",     nextDrawing.maxPrice)   
         App.nextDrawing.set("cpm",          nextDrawing.cpm)   
         App.nextDrawing.set("theme",        $.parseJSON(nextDrawing.theme))  
         App.nextDrawing.set("prizes",       $.parseJSON(nextDrawing.prizes))  
         App.nextDrawing.set("result",       $.parseJSON(nextDrawing.result))
         
         App.free()
         
         if(App.Globals.currentPage == "home"){
            window.location.hash = "/"; //-> pour force refresh les handlebars 
            App.get('router').transitionTo('home.lottery')
         }
      }
   });

}

//-------------------------------------------//

LotteryManager.getFinishedLotteries = function()
{
   $.ajax({
      type: "POST",  
      url: "/finishedLotteries",
      dataType: "json",
      success: function (lotteries)
      {
         for(var i=0; i<lotteries.length; i++){
            lotteries[i].result = $.parseJSON(lotteries[i].result);
            lotteries[i].theme = $.parseJSON(lotteries[i].theme);
            lotteries[i].prizes = $.parseJSON(lotteries[i].prizes);
         }
         
         App.Globals.set("lotteries", lotteries)   
         
         console.log("finishedLotteries")
         console.log(App.Globals.lotteries)
      }
   });
   
   
}

//-------------------------------------------//

LotteryManager.storeLotteryTicket = function(){
   
   var numbers = GameManager.currentSelection
   var extraTicket = App.user.extraTickets > 0
   App.wait()

   var params = new Object();
   params["numbers"] = numbers
   params["extraTicket"] = extraTicket

   $.ajax({
      type: "POST",  
      url: "/storeLotteryTicket",
      data: JSON.stringify(params),
      dataType: "json",
      headers: {"X-Auth-Token": App.authToken},
      contentType: "application/json; charset=utf-8",
      success: function (player)
      {
         App.free()

         if(player) {
            App.Globals.wasExtraTicket = extraTicket
            UserManager.updatedPlayer(player, function(){
               App.get('router').transitionTo('game.confirmation');
            })
         }
         else{
            UserManager.logout()
         }
      }
   });
}

