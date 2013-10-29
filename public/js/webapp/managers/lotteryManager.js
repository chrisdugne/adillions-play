//-------------------------------------------//
//LotteryManager
//-------------------------------------------//

this.LotteryManager = {};

//-------------------------------------------//

LotteryManager.refreshNextLottery = function()
{

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
         App.nextLottery.set("nbTickets",    lottery.nbTickets)   
         App.nextLottery.set("minPrice",     lottery.minPrice)   
         App.nextLottery.set("maxPrice",     lottery.maxPrice)   
         App.nextLottery.set("cpm",          lottery.cpm)   
         App.nextLottery.set("theme",        $.parseJSON(lottery.theme))  
         App.nextLottery.set("result",       lottery.result)

         odump(App.nextLottery)

      }
   });


}

//-------------------------------------------//

LotteryManager.storeLotteryTicket = function(){

   console.log("-----> storeLotteryTicket")
   var numbers = GameManager.currentSelection
   var extraTicket = App.user.extraTickets > 0
   App.wait()
   
   console.log(numbers)
   console.log("extraTicket ?  " + extraTicket)

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
      success: function (result)
      {
         App.free()
         console.log("-----> storeLotteryTicket response")
         console.log(result.response)

         var player = $.parseJSON(result.response)

         console.log("-----> player")
         console.log(player)

         if(player) 
            App.Globals.wasExtraTicket = extraTicket
//          userManager:receivedPlayer(player, router.openConfirmation)
//          else 
//          userManager:logout()
      }
   });
}

