package controllers;

import java.util.Map;

import models.Player;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import views.html.main;
import views.html.mobile.signin;
import views.html.mobile.signinFB;
import views.html.mobile.login;
import views.html.mobile.invite;
import views.html.mobile.video;
import views.html.mobile.logout;

public class Application extends Controller {

	// -----------------------------------------------------------------------------------//
	// facebook

	// PROD
	public static final String FACEBOOK_APP_ID 				= "170148346520274";
	public static final String FACEBOOK_API_SECRET 			= "887e8f7abb9b1cb9238a097e06585ae2";
	public static final String FACEBOOK_APP_NAMESPACE 		= "adillions";
	public static final String APP_HOSTNAME 					= "http://www.adillions.com";

	// DEV
//	public static final String FACEBOOK_APP_ID 				= "534196239997712";
//	public static final String FACEBOOK_API_SECRET 			= "46383d827867d50ef5d87b66c81f1a8e";
//	public static final String FACEBOOK_APP_NAMESPACE 		= "adillions-dev";
//	public static final String APP_HOSTNAME 					= "http://192.168.0.9:9000";

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
		String requestIds[] = queryParameters.get("request_ids");
		
		if(requestIds != null){
			String requestId = queryParameters.get("request_ids")[0].split(",")[0];
			System.out.println("requestId " + requestId);
			
			return ok(main.render(requestId));
		}
		else{
			return ok(main.render(null));
		}
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
	
	public static Result mobileLogout()
	{
		return ok(views.html.mobile.logout.render());
	}

	public static Result mobileFaq()
	{
		return ok(views.html.mobile.faq.render());
	}
	
	public static Result mobileTermsEN()
	{
	   return ok(views.html.mobile.termsEN.render());
	}
	
	public static Result mobileTermsFR()
	{
	   return ok(views.html.mobile.termsEN.render());
	}
}