package controllers;

import org.codehaus.jackson.JsonNode;

import managers.LotteryManager;
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

    public static Result setCurrentPrices() 
    {
        JsonNode params             = request().body().asJson();
        Integer min                 = params.get("min").asInt();
        Integer max                 = params.get("max").asInt();
        String secret               = params.get("secret").asText();
        
        Lottery nextDrawing     = LotteryManager.getNextDrawing();
        
        System.out.println("=====");
        System.out.println(secret);
        System.out.println(new StringBuilder(nextDrawing.getUid()).reverse().toString());

        if(secret.equals(new StringBuilder(nextDrawing.getUid()).reverse().toString())){
            nextDrawing.setMinPrice(min);
            nextDrawing.setMaxPrice(max);
            
            Ebean.save(nextDrawing);
        }
        
        return ok();
    }
    
    //-----------------------------------------------------------//

}