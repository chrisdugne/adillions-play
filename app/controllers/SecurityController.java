package controllers;

import static play.mvc.Controller.request;
import static play.mvc.Controller.response;
import models.Player;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import play.libs.Json;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import domain.AccountManager;

public class SecurityController extends Action.Simple {

	//----------------------------------------------------------------------------//
	
	public final static String AUTH_TOKEN_HEADER = "X-AUTH-TOKEN";
	public static final String AUTH_TOKEN = "authToken";

	//----------------------------------------------------------------------------//
	
	protected static Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

	//----------------------------------------------------------------------------//
	
	public Result call(Http.Context ctx) throws Throwable {
		Player player = null;
		String[] authTokenHeaderValues = ctx.request().headers().get(AUTH_TOKEN_HEADER);
		if ((authTokenHeaderValues != null) && (authTokenHeaderValues.length == 1) && (authTokenHeaderValues[0] != null)) {
			player = models.Player.findByAuthToken(authTokenHeaderValues[0]);
			if (player != null) {
				ctx.args.put("player", player);
				return delegate.call(ctx);
			}
		}

		System.out.println("unauthorized");
		return unauthorized("unauthorized");
	}

	//----------------------------------------------------------------------------//

	public static Player getPlayer() {
		return (Player)Http.Context.current().args.get("player");
	}

	//----------------------------------------------------------------------------//

	public static Result login() {
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");

		Player player = AccountManager.getPlayerWithCredentials(userJson);

		if(player != null){
			String authToken = player.createToken();
			ObjectNode authTokenJson = Json.newObject();
			authTokenJson.put(AUTH_TOKEN, authToken);
			response().setCookie(AUTH_TOKEN, authToken);
			return ok(authTokenJson);
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
			Player player = AccountManager.createNewPlayer(userJson);
			return ok(gson.toJson(player));
		}
		else{
			return ok(gson.toJson(null));
		}
		
	}
}