package controllers;

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
}