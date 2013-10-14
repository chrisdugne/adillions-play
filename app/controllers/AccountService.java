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
		
		AccountManager.updatePlayer(player, newUserJson);
		
		return ok(gson.toJson(player));
		
	}
	
	// ---------------------------------------------//
}