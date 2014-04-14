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
        
        System.out.println("=====");
        System.out.println(min);
        System.out.println(max);
        System.out.println(secret);
        
        Lottery nextDrawing     = LotteryManager.getNextDrawing();
        nextDrawing.setMinPrice(min);
        nextDrawing.setMaxPrice(max);

        Ebean.save(nextDrawing);
        
        return ok();
    }
    
    //-----------------------------------------------------------//

}