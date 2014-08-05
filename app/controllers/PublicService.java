package controllers;

import java.util.Date;

import org.codehaus.jackson.JsonNode;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

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
        Global global           = LotteryManager.getGlobal();
        Lottery nextLottery     = LotteryManager.getNextLottery();
        Lottery nextDrawing     = LotteryManager.getNextDrawing();

        JsonObject response = new JsonObject();
        response.add("nextLottery",    gson.toJsonTree(nextLottery));
        response.add("nextDrawing",    gson.toJsonTree(nextDrawing));
        response.addProperty("appStatus",    global.getAppStatus());
        
        response().setHeader("Access-Control-Allow-Origin", "*");
        return ok(gson.toJson(response));
    }
    
    //-----------------------------------------------------------//
    
    public static Result getGlobals()
    {
        Global global = LotteryManager.getGlobal();
        
        JsonObject response = new JsonObject();
        response.addProperty("serverTime",  new Date().getTime());
        response.add("global", gson.toJsonTree(global));
        
        return ok(gson.toJson(response));
    }

    //-----------------------------------------------------------//

    public static Result checkAppStatus()
    {
        Global global           = LotteryManager.getGlobal();
        JsonParser parser       = new JsonParser();
        JsonObject appStatus    = (JsonObject)parser.parse(global.getAppStatus());
        JsonObject response     = new JsonObject();

        if(appStatus.get("lottery") != null){
            String lotteryUID       = appStatus.get("lottery").getAsString();
            Lottery lottery         = LotteryManager.getLottery(lotteryUID);
            response.add("lottery", gson.toJsonTree(lottery));
        }
        
        response.addProperty("appStatus", global.getAppStatus());
        
        return ok(gson.toJson(response));
    }
    
    //-----------------------------------------------------------//

}