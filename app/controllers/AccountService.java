package controllers;

import org.codehaus.jackson.JsonNode;

import managers.AccountManager;
import models.Player;
import play.mvc.Result;
import play.mvc.With;

@With(SecurityController.class)
public class AccountService extends Application 
{
	
	public static Result fetchPlayer()
	{
		Player player = Application.player();
		
		if(player != null){
			return ok(gson.toJson(player));
		}
		else{
			return ok(gson.toJson(null));
		}
		
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
            facebookFan = params.get("facebookFan").asBoolean();
         
         if(newUserJson.get("twitterFan") != null)
            twitterFan = params.get("twitterFan").asBoolean();
         
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