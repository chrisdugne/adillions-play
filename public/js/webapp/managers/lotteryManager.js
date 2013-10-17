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
         App.nextLottery.set("theme",        lottery.theme)   
         App.nextLottery.set("result",       lottery.result)

         console.log(App.nextLottery)
         
      }
   });
   
   
}

