package controllers;

import managers.LotteryManager;
import models.Player;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import play.mvc.With;

@With(SecurityController.class)
public class LotteryService extends Application 
{
    //------------------------------------------------------------------------------------//
    
    public static Result storeLotteryTicket()
    {
        JsonNode params             = request().body().asJson();
        String numbers             = params.get("numbers").toString();
        Boolean isExtraTicket     = params.get("extraTicket").asBoolean();
        Long creationTime         = params.get("creationTime").asLong();

        Player player = LotteryManager.storeLotteryTicket(numbers, isExtraTicket, creationTime);

        if(player != null){
            return ok(gson.toJson(player));
        }
        else{
            return unauthorized();
        }
    }
}