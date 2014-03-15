package controllers;

import java.util.List;

import org.codehaus.jackson.JsonNode;

import managers.AccountManager;
import models.LotteryTicket;
import models.Player;
import play.mvc.Result;
import play.mvc.With;

@With(SecurityController.class)
public class AccountService extends Application 
{

    public static Result fetchPlayer()
    {
        JsonNode params = request().body().asJson();
        Player player = Application.player();

        if(player == null){
            return ok(gson.toJson(null));
        }

        Double mobileVersion    = null;
        String country          = null;
        Boolean fromWeb         = false;

        if(params.get("fromWeb") != null)
            fromWeb = params.get("fromWeb").asBoolean(); 

        if(params.get("mobileVersion") != null)
            mobileVersion = params.get("mobileVersion").asDouble(); 
            
        if(params.get("country") != null)
            country = params.get("country").asText(); 
        
        AccountManager.refreshPlayer(player, fromWeb, mobileVersion, country);
        return ok(gson.toJson(player));

    }

    // ---------------------------------------------//

    public static Result getLotteryTickets() {
        
        JsonNode params = request().body().asJson();
        Player player = Application.player();
        String lastLotteryUID = params.get("lastLotteryUID").asText();
        
        List<LotteryTicket> tickets = AccountManager.getLotteryTickets(player, lastLotteryUID);
        return ok(gson.toJson(tickets));
    }
    
    // ---------------------------------------------//
    
    public static Result updatePlayer()
    {
        JsonNode params = request().body().asJson();
        JsonNode newUserJson = params.get("user");

        Player player = Application.player();

        player = AccountManager.updatePlayer(player, newUserJson);

        if(player != null){
            return ok(gson.toJson(player));
        }
        else{
            return ok(gson.toJson(null));
        }
    }

    // ---------------------------------------------//

    public static Result updateFanStatus()
    {
        JsonNode params = request().body().asJson();

        Boolean facebookFan = false;
        Boolean twitterFan  = false;

        //--------------------------------------------------//
        // from 1.2

        if(params.get("facebookFan") != null)
            facebookFan = params.get("facebookFan").asBoolean();

        if(params.get("twitterFan") != null)
            twitterFan = params.get("twitterFan").asBoolean();

        //--------------------------------------------------//
        // to remove : keep en attendant 1.2

        if(params.get("user") != null){
            JsonNode newUserJson = params.get("user");

            if(newUserJson.get("facebookFan") != null)
                facebookFan = newUserJson.get("facebookFan").asBoolean();

            if(newUserJson.get("twitterFan") != null)
                twitterFan = newUserJson.get("twitterFan").asBoolean();

        }

        //--------------------------------------------------//

        Player player = Application.player();

        AccountManager.updateFanStatus(player, facebookFan, twitterFan);

        return ok();

    }

    // ---------------------------------------------//

    public static Result giveToCharity(){
        Player player = Application.player();
        AccountManager.giveToCharity(player);
        return ok();
    }

    // ---------------------------------------------//

    public static Result cashout(){
        JsonNode params = request().body().asJson();
        String country = params.get("country").asText();

        Player player = Application.player();
        AccountManager.cashout(player, country);
        return ok();
    }


    // ---------------------------------------------//
}