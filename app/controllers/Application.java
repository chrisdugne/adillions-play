package controllers;

import java.util.Map;

import models.Player;

import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import views.html.*;

public class Application extends Controller {

	public static final String FLASH_MESSAGE_KEY = "message";
	public static final String FLASH_ERROR_KEY = "error";
	public static final String USER_ROLE = "user";

	// ---------------------------------------------//

	protected static Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
	
	// -----------------------------------------------------------------------------------//
	// Web
	// ---------------------------------------------//

	public static Result home()
	{
		Map<String, String[]> queryParameters = request().queryString();
		String[] login = queryParameters.get("login");
		
		Boolean popupLoginWindow = login != null;
		
		// prod
		return ok(main.render(popupLoginWindow));
	}

	
	// -----------------------------------------------------------------------------------//
	// Common
	//----------------------------------------------------------------------------//

	public static Player player() {
		return (Player)Http.Context.current().args.get("player");
	}

	// -----------------------------------------------------------------------------------//
	// Mobile pages
	// -----------------------------------------------------------------------------------//
	
	public static Result mobileLogin()
	{
		return ok(views.html.mobile.login.render());
	}
	
	public static Result mobileSignin()
	{
		return ok(views.html.mobile.signin.render());
	}
	
	public static Result mobileSigninFromFacebook()
	{
		return ok(views.html.mobile.signinFB.render());
	}

	public static Result mobileVideo()
	{
		return ok(views.html.mobile.video.render());
	}
}