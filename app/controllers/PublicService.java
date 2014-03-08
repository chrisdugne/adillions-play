package controllers;

import java.util.Date;

import com.google.gson.JsonObject;

import managers.LotteryManager;
import models.Global;
import models.Lottery;
import play.mvc.Result;

/**
 * ATTENTION DE NE PAS laisser des services tests ici : c'est ouvert sans sécurité !
 * @author mad
 *
 */
public class PublicService extends Application 
{
    //-----------------------------------------------------------//

    public static Result getFinishedLotteries()
    {
        return ok(gson.toJson(LotteryManager.getFinishedLotteries()));
    }

    //-----------------------------------------------------------//

    public static Result getNextLottery() 
    {
        Lottery nextLottery = LotteryManager.getNextLottery();
        Lottery nextDrawing = LotteryManager.getNextDrawing();

        JsonObject response = new JsonObject();
        response.add("nextLottery",    gson.toJsonTree(nextLottery));
        response.add("nextDrawing",    gson.toJsonTree(nextDrawing));

        return ok(gson.toJson(response));
    }
    
    //-----------------------------------------------------------//
    
    public static Result getGlobals()
    {
        Global global = LotteryManager.getGlobal();
        
        JsonObject response = new JsonObject();
        response.addProperty("serverTime",  new Date().getTime());
        response.add("global",         gson.toJsonTree(global));
        
        return ok(gson.toJson(response));
    }

    //-----------------------------------------------------------//

}