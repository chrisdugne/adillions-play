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

GameManager.drawMyTickets = function() {
   
   //-----------------------------------//
   
   var xGap            =  45;
   var yGap            =  45;
   
   //-----------------------------------//

   var totalNums       = App.nextLottery.maxNumbers;  
   var nbNumPerLine    = GameManager.nbNumPerLine;
   
   var marginLeft      = $("#numbersToSelect").width()/2 - (nbNumPerLine+1)/2 * xGap - 17

   var nbLines         =  Math.floor(totalNums/nbNumPerLine);
   var nbOnlastLine    =  totalNums - Math.floor(nbLines)*nbNumPerLine;

   //-----------------------------------//
   
   for(var i = 0; i < nbNumPerLine; i++){
      for(var j = 0; j < nbLines; j++){
         var ballNum = j*nbNumPerLine + i + 1
         GameManager.drawBallToPick(ballNum, marginLeft + (i+1)*xGap, (j+1)*yGap)
      }
   }
   
   for(var i = 0; i < nbOnlastLine; i++){
      var ballNum = nbLines*nbNumPerLine+i+1
      GameManager.drawBallToPick(ballNum, marginLeft + (i+1)*xGap, (nbLines+1)*yGap)
   }

   //-----------------------------------//
   
   GameManager.startSelection()
   
   //-----------------------------------//
   
   var selector  = "<img id='selectorNumbers' src='/assets/images/hud/selector.green.png'></img>"
   $("#selectionTools").append(selector)

   //-----------------------------------//
   
   var validateButton  = "<img id='validateButton' src='/assets/images/bylang/"+App.translator.lang+"/ValidateOFF.png'></img>"
   $("#selectionTools").append(validateButton)
   
}

//==================================================================//

GameManager.refreshNumberSelectionDisplay = function()   {

   
   var xGap       = 45
   var marginLeft = $("#numbersToSelect").width()/2 - 85
   $("#numbersSelected").empty()
   
   GameManager.currentSelection.sort()

   for(var i = 0; i < GameManager.currentSelection.length; i++){
      GameManager.drawBallSelected(GameManager.currentSelection[i], marginLeft + xGap*i, 0);
   }
   

   if(GameManager.currentSelection.length == App.nextLottery.maxPicks){
      $("#validateButton").attr("src","/assets/images/bylang/"+App.translator.lang+"/ValidateON.png");
      $("#validateButton").addClass("enabled");
      $("#validateButton").click(function(){
         App.GameController.requireVideo( function(){
            App.get('router').transitionTo('game.selectAdditionalNumber')
         }) 
      })
   }
   else{
      $("#validateButton").removeClass("enabled");
      $("#validateButton").attr("src","/assets/images/bylang/"+App.translator.lang+"/ValidateOFF.png");
      $("#validateButton").off("click")
   }

}

//==================================================================//

GameManager.startSelection = function()   {
   GameManager.currentSelection          = []
   GameManager.currentAdditionalBall     = null
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