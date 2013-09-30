package controllers;

import org.codehaus.jackson.JsonNode;

import models.Player;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import domain.AccountManager;

@With(SecurityController.class)
public class AccountService extends Application 
{
	public static Result getPlayer()
	{
		System.out.println("getplayer");
		String token = Http.Context.current().request().headers().get(SecurityController.AUTH_TOKEN_HEADER)[0];
		
		Player player = AccountManager.getPlayer(token);
		
		if(player != null){
			return ok(gson.toJson(player));
		}
		else{
			return ok(gson.toJson(null));
		}
		
	}

//	
//	// ---------------------------------------------//
//	
//	public static Result logIn()
//	{
//		JsonNode params = request().body().asJson();
//		JsonNode userJson = params.get("user");
//		
//		Player player = AccountManager.getPlayerWithCredentials(userJson);
//		
//		if(player != null){
//			session("email", player.getEmail());
//			return ok(gson.toJson(player));
//		}
//		else{
//			return ok(gson.toJson(null));
//		}
//		
//	}
//	
//	// ---------------------------------------------//
//	
//	public static Result autoLogIn()
//	{
//		String email = session("email");
//		if(email != null){
//			Player player = AccountManager.getPlayerByEmail(email);
//			
//			if(player != null){
//				session("email", player.getEmail());
//				return ok(gson.toJson(player));
//			}
//			else{
//				return ok(gson.toJson(null));
//			}
//		}
//		else{
//			return ok(gson.toJson(null));
//		}
//	}

	// ---------------------------------------------//
}