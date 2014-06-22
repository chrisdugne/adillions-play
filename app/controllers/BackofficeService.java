package controllers;

import org.codehaus.jackson.JsonNode;

import managers.LotteryManager;
import models.Global;
import models.Lottery;
import play.mvc.Result;

import com.avaje.ebean.Ebean;

/**
 * ATTENTION DE NE PAS laisser des services tests ici : c'est ouvert sans sécurité !
 * @author mad
 *
 */
public class BackofficeService extends Application 
{
    //-----------------------------------------------------------//

    public static Result setCurrentState() 
    {
        JsonNode params             = request().body().asJson();
        Integer startJackpot        = params.get("startJackpot").asInt();
        Integer endJackpot          = params.get("endJackpot").asInt();
        Double rateUSDtoEUR         = params.get("rateEuroToUSD").asDouble(); // attention nommage INVERSE et faux dans DB et PLAY
        String secret               = params.get("secret").asText();
        JsonNode banners            = params.get("banners");
        
        Lottery nextDrawing         = LotteryManager.getNextDrawing();
        Global global               = LotteryManager.getGlobal();
        
        System.out.println(banners.toString());
        
        if(secret.equals(new StringBuilder(nextDrawing.getUid()).reverse().toString())){
            nextDrawing.setRateUSDtoEUR(rateUSDtoEUR);
            Ebean.save(nextDrawing);
            
            global.set(min);
            nextDrawing.setMaxPrice(max);
            global.setBanners(banners.toString());
            Ebean.save(global);
        }
        
        return ok();
    }
    
    //-----------------------------------------------------------//

}