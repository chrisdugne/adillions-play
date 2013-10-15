package controllers;

import static play.mvc.Controller.request;
import static play.mvc.Controller.response;
import managers.AccountManager;
import models.Player;

import org.codehaus.jackson.JsonNode;

import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;


public class SecurityController extends Action.Simple {

	//----------------------------------------------------------------------------//
	
	public final static String AUTH_TOKEN_HEADER 	= "X-AUTH-TOKEN";
	public static final String AUTH_TOKEN 				= "authToken";

	//----------------------------------------------------------------------------//
	
	protected static Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

	//----------------------------------------------------------------------------//
	
	public Result call(Http.Context ctx) throws Throwable {
		Player player = null;
		String[] authTokenHeaderValues = ctx.request().headers().get(AUTH_TOKEN_HEADER);

		System.out.println("--------");
		System.out.println("authTokenHeaderValues.length " + authTokenHeaderValues.length);
		System.out.println("authTokenHeaderValues[0] " + authTokenHeaderValues[0]);
		
		if ((authTokenHeaderValues != null) && (authTokenHeaderValues.length == 1) && (authTokenHeaderValues[0] != null)) {
			player = models.Player.findByAuthToken(authTokenHeaderValues[0]);
			if (player != null) {
				System.out.println("player : " + player.getLotteryTickets().size() + " lottery tickets");
				ctx.args.put("player", player);
				return delegate.call(ctx);
			}
		}

		System.out.println("unauthorized");
		return unauthorized("unauthorized");
	}
	
	//----------------------------------------------------------------------------//

	public static Result login() {
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");

		Player player = AccountManager.getPlayerWithCredentials(userJson);

		if(player != null){
			String authToken = player.createToken();
			response().setCookie(AUTH_TOKEN, authToken);
			
			JsonObject authTokenJson = new JsonObject();
			authTokenJson.addProperty(AUTH_TOKEN, authToken);
			return ok(gson.toJson(authTokenJson));
		}
		else{
			return unauthorized();
		}
	}

	// ---------------------------------------------//

	public static Result signIn()
	{
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		
		if(!AccountManager.existEmail(userJson)){
			if(!AccountManager.existNames(userJson)){
				Player player = AccountManager.createNewPlayer(userJson);
				return ok(gson.toJson(player));
			}
			else{
				return ok("names");
			}
		}
		else{
			return ok("email");
		}
		
	}

	//----------------------------------------------------------------------------//
	
	public static Result getPlayerFromFB()
	{
		JsonNode params = request().body().asJson();
		JsonNode facebookData = params.get("facebookData");

		//----------------------

		String facebookId = facebookData.get("id").asText();
		
		//----------------------
		// verify token
		
//		String accessToken = params.get("accessToken").asText();
//		if(!validAccessToken(accessToken, facebookId))
//			return unauthorized();
		
		//----------------------
		
		Player player = AccountManager.getPlayerByFacebookId(facebookId);
		
		if(player != null){
			String authToken = player.createToken();
			response().setCookie(AUTH_TOKEN, authToken);

			JsonObject response = new JsonObject();
			response.addProperty(AUTH_TOKEN, authToken);
			response.addProperty("player", gson.toJson(player));
			return ok(gson.toJson(response));
		}
		else{
			// require signinFromFB
			return unauthorized();
		}
		
	}
	
	// ---------------------------------------------//
	
	public static Result signinFromFacebook()
	{
		JsonNode params = request().body().asJson();

		//----------------------

		JsonNode userJson = params.get("user");
		
		//----------------------
		// verify token
		
//		String facebookId = userJson.get("facebookId").asText();
//		String accessToken = params.get("accessToken").asText();
//		if(!validAccessToken(accessToken, facebookId))
//			return unauthorized();
		
		//----------------------
		
		if(!AccountManager.existNames(userJson)){
			Player player = AccountManager.createNewPlayer(userJson);

			String authToken = player.createToken();
			response().setCookie(AUTH_TOKEN, authToken);

			JsonObject response = new JsonObject();
			response.addProperty(AUTH_TOKEN, authToken);
			response.addProperty("player", gson.toJson(player));
			return ok(gson.toJson(response));
		}
		else{
			return ok(gson.toJson(null));
		}
		
	}
	
	// ---------------------------------------------//
	
//	private static boolean validAccessToken(String accessToken, String facebookId) {
//
//		// A REVOIR : You must provide an app access token or a user access token that is an owner or developer of the app
//		// surement app_access_token
//		
//		try{
//			String response= HttpHelper.get("https://graph.facebook.com/debug_token?access_token="+accessToken+"&input_token="+accessToken);
//			
//			JsonNode fbAnswer = Json.parse(response);
//			
//			String appId 		= fbAnswer.get("data").get("app_id").asText();
//			Boolean isValid 	= fbAnswer.get("data").get("is_valid").asBoolean();
//			String userId 		= fbAnswer.get("data").get("user_id").asText();
//
//			if(!appId.equals(FACEBOOK_APP_ID)){
//				System.out.println("ACCESS_TOKEN FOR WRONG APP_ID");
//				return false;
//			}
//			
//			if(!facebookId.equals(userId)){
//				System.out.println("ACCESS_TOKEN FOR WRONG USER_ID");
//				return false;
//			}
//
//			// timeout / logout
//			if(!isValid){
//				return false;
//			}
//		}
//		catch(Exception e){
//			System.out.println("COULDNT VALIDATE ACCESS_TOKEN WITH FACEBOOK");
//			return false;
//		}
//
//		return true;
//   }
}