package controllers;

import java.util.Map;

import models.Player;

import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import views.html.mobile.login;
import views.html.mobile.signin;
import views.html.mobile.signinFB;
import views.html.mobile.video;
import views.html.mobile.invite;
import views.html.main;

public class Application extends Controller {

	// -----------------------------------------------------------------------------------//
	// facebook

	protected static final String FACEBOOK_APP_ID 				= "170148346520274";
	protected static final String FACEBOOK_API_SECRET 			= "887e8f7abb9b1cb9238a097e06585ae2";
	protected static final String FACEBOOK_APP_NAMESPACE 		= "adillions";

//	protected static final String APP_HOSTNAME 					= "https://kdo-serendi.herokuapp.com";
	protected static final String APP_HOSTNAME 					= "http://192.168.0.9:9000";

	// -----------------------------------------------------------------------------------//

	public static final String FLASH_MESSAGE_KEY 				= "message";
	public static final String FLASH_ERROR_KEY 					= "error";
	public static final String USER_ROLE 							= "user";

	// -----------------------------------------------------------------------------------//

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
	
	public static Result mobileInvite()
	{
		return ok(views.html.mobile.invite.render());
	}
}