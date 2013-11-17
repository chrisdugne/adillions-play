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
      success: function (lottery, textStatus, jqXHR)
      {
         App.nextLottery.set("uid",          lottery.uid)   
         App.nextLottery.set("date",         lottery.date)   
         App.nextLottery.set("maxPicks",     lottery.maxPicks)   
         App.nextLottery.set("maxNumbers",   lottery.maxNumbers)   
         App.nextLottery.set("nbPlayers",    lottery.nbPlayers)   
         App.nextLottery.set("toolPlayers",  lottery.toolPlayers)   
         App.nextLottery.set("nbTickets",    lottery.nbTickets)   
         App.nextLottery.set("minPrice",     lottery.minPrice)   
         App.nextLottery.set("maxPrice",     lottery.maxPrice)   
         App.nextLottery.set("cpm",          lottery.cpm)   
         App.nextLottery.set("theme",        $.parseJSON(lottery.theme))  
         App.nextLottery.set("prizes",       $.parseJSON(lottery.prizes))  
         App.nextLottery.set("result",       lottery.result)
         
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

