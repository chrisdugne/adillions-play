//==================================================================//

this.GameManager = {};

//==================================================================//

GameManager.init = function()   {
   GameManager.nbNumPerLine = 7;
}


//==================================================================//

/**
 *    Menu selection
 */
GameManager.setSelectedButton = function()   {

   $("#gameHomeButton").removeClass("selected")
   $("#myTicketsButton").removeClass("selected")
   $("#resultsButton").removeClass("selected")
   $("#profileButton").removeClass("selected")

   var view = App.get('router').currentState.name

   if($("#"+view+"Button")){
      $("#"+view+"Button").addClass("selected")
   }
}

//==================================================================//

GameManager.initFillLotteryTicket = function() {

   $("#randomButton").css('left', $(window).width()/2 - 150)
   $("#restartButton").css('left', $(window).width()/2 +25)
   $("#actionSeparator").css('left', $(window).width()/2)

   $("#randomButton").click(function(){
      GameManager.restartSelection()
      GameManager.randomSelection()
   })

   $("#restartButton").click(function(){
      if(GameManager.currentSelection.length > 0)
         GameManager.restartSelection()
   })

   GameManager.drawFillLotteryTicket()
}

//==================================================================//

GameManager.drawFillLotteryTicket = function() {

// -----------------------------------//

   var xGap            =  47;
   var yGap            =  47;

// -----------------------------------//

   var totalNums       = App.nextLottery.maxNumbers;  
   var nbNumPerLine    = GameManager.nbNumPerLine;

   var marginLeft      = $("#numbersToSelect").width()/2 - (nbNumPerLine+1)/2 * xGap - 17

   var nbLines         =  Math.floor(totalNums/nbNumPerLine);
   var nbOnlastLine    =  totalNums - Math.floor(nbLines)*nbNumPerLine;

// -----------------------------------//

   for(var i = 0; i < nbNumPerLine; i++){
      for(var j = 0; j < nbLines; j++){
         var ballNum = j*nbNumPerLine + i + 1
         GameManager.drawBallToPick(ballNum, marginLeft + (i+1)*xGap, (j)*yGap)
      }
   }

   for(var i = 0; i < nbOnlastLine; i++){
      var ballNum = nbLines*nbNumPerLine+i+1
      GameManager.drawBallToPick(ballNum, marginLeft + (i+1)*xGap, (nbLines+1)*yGap)
   }

// -----------------------------------//

   GameManager.startSelection();

// -----------------------------------//

   var selector  = "<img id='selectorNumbers' src='/assets/images/hud/selector.green.png'></img>";
   $("#selectionTools").append(selector);

// -----------------------------------//

   var validateButton  = "<img id='validateButton' src='/assets/images/bylang/"+App.translator.lang+"/ValidateOFF.png'></img>";
   $("#selectionTools").append(validateButton);

}


//==================================================================//

GameManager.clickOn = function(num) {

   var ballId = "ball_"+num
   var textId = "text_"+num

   if($("#"+ballId).hasClass("selected")){
      GameManager.removeFromSelection(num)

      $("#"+ballId).attr('src', "/assets/images/balls/ball.small.white.png")
      $("#"+ballId).removeClass("selected")
      $("#"+textId).addClass("numblack")
      $("#"+textId).removeClass("numwhite")
   }
   else{
      var added = GameManager.addToSelection(num)
      if(added){
         $("#"+ballId).attr('src', "/assets/images/balls/ball.small.green.png")
         $("#"+ballId).addClass("selected")
         $("#"+textId).addClass("numwhite")
         $("#"+textId).removeClass("numblack")
      }
   }

}

//==================================================================//

GameManager.drawBallToPick = function(ballNum, left, top)   {

   //----------------------------------------------------//

   var ballId = "ball_"+ballNum
   var textId = "text_"+ballNum

   var ball   = "<img id='"+ballId+"' src='/assets/images/balls/ball.small.white.png' class='ball'></img>"
   var num    = "<p id='"+textId+"' class='numblack'>"+ballNum+"</p>"

   //----------------------------------------------------//

   $("#numbersToSelect").append(ball)
   $("#numbersToSelect").append(num)

   //----------------------------------------------------//

   $("#"+ballId).css("left", left + "px")
   $("#"+ballId).css("top",  top + "px")

   $("#"+textId).css("left", left + "px")
   $("#"+textId).css("top",  top + "px")

   //----------------------------------------------------//

   $("#"+textId).click(function(){
      GameManager.clickOn(ballNum)
   })

   $("#"+ballId).click(function(){
      GameManager.clickOn(ballNum)
   })
}

//==================================================================//

GameManager.drawBallSelected = function(ballNum, left, top) {

   //----------------------------------------------------//

   var ballId = "ballSelected_"+ballNum
   var textId = "textSelected_"+ballNum

   var ball   = "<img id='"+ballId+"' src='/assets/images/balls/ball.small.green.png' class='ball'></img>"
   var num    = "<p id='"+textId+"' class='numwhite'>"+ballNum+"</p>"

   //----------------------------------------------------//

   $("#numbersSelected").append(ball)
   $("#numbersSelected").append(num)

   //----------------------------------------------------//

   $("#"+ballId).css("left", left + "px")
   $("#"+ballId).css("top",  top + "px")

   $("#"+textId).css("left", left + "px")
   $("#"+textId).css("top",  top + "px")

   //----------------------------------------------------//

   $("#"+textId).click(function(){
      GameManager.clickOn(ballNum)
   })

   $("#"+ballId).click(function(){
      GameManager.clickOn(ballNum)
   })
}

//==================================================================//

GameManager.restartSelection = function() {
   $("#numbersToSelect").empty()
   $("#selectionTools").empty()
   GameManager.drawFillLotteryTicket()
}

//==================================================================//

GameManager.getNum = function() {

   var num   = Utils.random1(49)
   var alreadyChosen  = false

   for (var n = 0; n < GameManager.currentSelection.length; n++) {
      if(num == GameManager.currentSelection[n]) 
         alreadyChosen = true
   }

   if (!alreadyChosen)
      return num
      else  
         return GameManager.getNum()
}

GameManager.randomSelection = function() {
   for(var i = 0; i<5; i++) 
      GameManager.clickOn (GameManager.getNum())
}

//==================================================================//

GameManager.refreshNumberSelectionDisplay = function()   {

   var xGap       = 44
   var marginLeft = $(".container").width()/2 - $("#selectorNumbers").width()/2 + 7 
   $("#numbersSelected").empty()

   Utils.sortNumbers(GameManager.currentSelection)

   for(var i = 0; i < GameManager.currentSelection.length; i++){
      GameManager.drawBallSelected(GameManager.currentSelection[i], marginLeft + xGap*i, -9);
   }

   if(GameManager.currentSelection.length == App.nextLottery.maxPicks){
      $("#selectorNumbers").css("opacity","0.34");
      $("#validateButton").attr("src","/assets/images/bylang/"+App.translator.lang+"/ValidateON.png");
      $("#validateButton").addClass("enabled");
      $("#validateButton").click(function(){
//         App.GameController.requireVideo( function(){
//            App.get('router').transitionTo('game.selectAdditionalNumber')
//         }) 

         App.get('router').transitionTo('game.selectAdditionalNumber')
      })
   }
   else{
      $("#selectorNumbers").css("opacity","1");
      $("#validateButton").removeClass("enabled");
      $("#validateButton").attr("src","/assets/images/bylang/"+App.translator.lang+"/ValidateOFF.png");
      $("#validateButton").off("click")
   }

}

//==================================================================//

GameManager.startSelection = function()   {
   GameManager.currentSelection          = []
   GameManager.luckyBall     = null
   GameManager.refreshNumberSelectionDisplay()
}

//==================================================================//

GameManager.addToSelection = function(num){

   if(GameManager.canAddToSelection()){
      GameManager.currentSelection[GameManager.currentSelection.length] = num
      GameManager.refreshNumberSelectionDisplay()
      return true
   }
   else
      return false

}

GameManager.removeFromSelection = function(num) {

   var indexToDelete = -1
   for(var i = 0; i < GameManager.currentSelection.length; i++){
      if(GameManager.currentSelection[i] == num){
         indexToDelete = i;
         break;
      }
   }

   if(indexToDelete >= 0)
      GameManager.currentSelection.splice(indexToDelete, 1)

      console.log(GameManager.currentSelection)
      GameManager.refreshNumberSelectionDisplay()
}

GameManager.canAddToSelection = function()   {
   return GameManager.currentSelection.length < App.nextLottery.maxPicks
}

//==================================================================//
//SelectLuckyNumber
//==================================================================//


GameManager.initSelectAdditionalNumber = function() {
   GameManager.drawSelectAdditionalNumber()
}

GameManager.drawSelectAdditionalNumber = function() {

// -----------------------------------//

   var xGap            =  117;
   var yGap            =  147;
   
   var totalNums       = App.nextLottery.theme.icons.length  
   var nbNumPerLine    = 3
     
   //------------------

   var nbLines =  totalNums/nbNumPerLine
   var nbRows =  totalNums/nbLines
   var nbOnlastLine = totalNums - Math.floor(nbLines)*nbRows

   var marginLeft = $(".container").width()/2 - 275 
   
   //------------------

   for(var i = 0; i < nbRows; i++){
      for(var j = 0; j < nbLines; j++){
         var ballNum = j*nbNumPerLine + i + 1
         GameManager.drawThemeToPick(ballNum,  marginLeft + (i+1)*xGap, (j+1)*yGap)
      }
   }

   // -----------------------------------//

   var selector  = "<img id='selectorLuckyBall' src='/assets/images/hud/selector.green.2.png'></img>";
   $("#selectionTools").append(selector);

   //-----------------------------------//
   
   xGap = 45;
   var marginLeft = $(".container").width()/2 - 132 
   
   for(var i = 0; i < GameManager.currentSelection.length; i++){
      GameManager.drawBallSelected(GameManager.currentSelection[i], marginLeft + xGap*i, -8);
   }
   
   //-----------------------------------//

   var validateButton  = "<img id='validateButton' src='/assets/images/bylang/"+App.translator.lang+"/ValidateOFF.png'></img>";
   $("#selectionTools").append(validateButton);

}


//==================================================================//

GameManager.drawThemeToPick = function(ballNum, left, top)   {

   //----------------------------------------------------//

   var ballId = "ball_"+ballNum
   var maskId = "mask_"+ballNum
   var textId = "text_"+ballNum
   
   var ball   = "<img id='"+ballId+"' src='"+App.nextLottery.theme.icons[ballNum-1].image+"' class='themeBall'></img>"
   var mask   = "<img id='"+maskId+"' src='/assets/images/balls/ball.mask.png' class='themeBall'></img>"
   var text   = "<p id='"+textId+"' class='themeText'>"+App.nextLottery.theme.icons[ballNum-1].name+"</p>"

   //----------------------------------------------------//

   $("#ballsToSelect").append(ball)
   $("#ballsToSelect").append(mask)
   $("#ballsToSelect").append(text)

   //----------------------------------------------------//

   $("#"+ballId).css("left", left + "px")
   $("#"+ballId).css("top",  top + "px")

   $("#"+maskId).css("left", left + "px")
   $("#"+maskId).css("top",  top + "px")

   $("#"+textId).css("left", (left - 40) + "px")
   $("#"+textId).css("top",  (top + 90)  + "px")

   //----------------------------------------------------//

   $("#"+maskId).click(function(){
      GameManager.pickTheme(ballNum)
   })
}


GameManager.pickTheme = function(num) {

   var ballId = "ball_"+num

   if($("#"+ballId).hasClass("selected")){
      GameManager.cancelLuckySelection()
      $("#"+ballId).removeClass("selected")
   }
   else{
      var added = GameManager.addToLuckySelection(num)
      if(added){
         addClass("selected")
      }
   }

}

//-----------------------------------------------------------------------------------------

GameManager.addToLuckySelection = function(num) {

   if(GameManager.luckyBall) {
      GameManager.cancelLuckySelection();
   }
  
   var ballId = "ball_"+num
   GameManager.luckyBall = num
   $("#"+ballId).addClass("selected")
   
   GameManager.refreshThemeSelectionDisplay()
}

GameManager.cancelLuckySelection = function(){

   var prevousId  = "ball_"+GameManager.luckyBall
   $("#"+prevousId).removeClass("selected")
   GameManager.luckyBall = null
   
   GameManager.refreshThemeSelectionDisplay()
}

//-----------------------------------------------------------------------------------------

GameManager.refreshThemeSelectionDisplay = function(){
   
   var ballId = "luckyBall";
   var maskId = "luckyBallMask";
   
   if(GameManager.luckyBall){
      
      var left = $(".container").width()/2 + 93 
      var top   = -8;
      
      var ball   = "<img id='"+ballId+"' src='"+App.nextLottery.theme.icons[GameManager.luckyBall - 1].image+"' class='smallThemeBall'></img>"
      var mask   = "<img id='"+maskId+"' src='/assets/images/balls/ball.mask.png' class='smallThemeBall'></img>"

      $("#numbersSelected").append(ball)
      $("#numbersSelected").append(mask)
      
      $("#"+ballId).css("left", left + "px")
      $("#"+ballId).css("top",  top + "px")

      $("#"+maskId).css("left", left + "px")
      $("#"+maskId).css("top",  top + "px")
      
      
      $("#"+maskId).click(function(){
         GameManager.cancelLuckySelection()
      })
      
      //-----------------------------------------------//

      $("#selectorLuckyBall").css("opacity","0.34");
      $("#validateButton").attr("src","/assets/images/bylang/"+App.translator.lang+"/ValidateON.png");
      $("#validateButton").addClass("enabled");
      $("#validateButton").click(function(){
         GameManager.currentSelection[GameManager.currentSelection.length] = GameManager.luckyBall
         LotteryManager.storeLotteryTicket()
      })
      
   }
   else{
      $("#"+ballId).remove()
      $("#"+maskId).remove()

      $("#selectorLuckyBall").css("opacity","1");
      $("#validateButton").removeClass("enabled");
      $("#validateButton").attr("src","/assets/images/bylang/"+App.translator.lang+"/ValidateOFF.png");
      $("#validateButton").off("click")
   }
   
//==================================================================//
// Confirmation
//==================================================================//

 GameManager.initConfirmation = function(){
    
    // if App.user.currentPoints == 0 -> conversion + message extra ticket.
    if(!App.Globals.wasExtraTicket && App.user.currentPoints > 0){
       App.message("+1 point")
    }
       
    App.Globals.wasExtraTicket      = false
 }
   
}



