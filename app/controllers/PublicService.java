package controllers;

import java.util.Date;

import org.codehaus.jackson.JsonNode;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import managers.LotteryManager;
import models.Global;
import models.Lottery;
import play.mvc.Result;
import play.mvc.Http;
import play.mvc.With;

/**
 * ATTENTION DE NE PAS laisser des services tests ici : c'est ouvert sans sécurité !
 * @author mad
 *
 */
@With(CorsController.class)
public class PublicService extends Application 
{
    // /* http://stackoverflow.com/a/14437068/959219 */
    public static Result checkPreFlight() {
        System.out.println("----> checkPreFlight in pub");
        response().setHeader("Access-Control-Allow-Origin", "*");       // Need to add the correct domain in here!!
        response().setHeader("Access-Control-Allow-Methods", "POST");   // Only allow POST
        response().setHeader("Access-Control-Max-Age", "300");          // Cache response for 5 minutes
        response().setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");         // Ensure this header is also allowed!  
        return ok();
    }

    //-----------------------------------------------------------//

    public static Result getFinishedLotteries()
    {
        return ok(gson.toJson(LotteryManager.getFinishedLotteries()));
    }

    //-----------------------------------------------------------//

    public static Result getNextLottery() 
    {
        System.out.println("----> getNextLottery");
        Global global       = LotteryManager.getGlobal();
        Lottery nextLottery = LotteryManager.getNextLottery();
        Lottery nextDrawing = LotteryManager.getNextDrawing();
        JsonObject result   = new JsonObject();

        result.add("nextLottery",       gson.toJsonTree(nextLottery));
        result.add("nextDrawing",       gson.toJsonTree(nextDrawing));
        result.addProperty("appStatus", global.getAppStatus());

        return ok(gson.toJson(result));
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