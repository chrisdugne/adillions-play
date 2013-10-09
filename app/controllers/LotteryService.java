package controllers;

import managers.LotteryManager;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import play.mvc.With;

@With(SecurityController.class)
public class LotteryService extends Application 
{

	//------------------------------------------------------------------------------------//
	
	public static Result getNextLottery()
	{
		return ok(gson.toJson(LotteryManager.getNextLottery()));
	}

	//------------------------------------------------------------------------------------//
	
	public static Result storeLotteryTicket()
	{
		JsonNode params = request().body().asJson();
		String numbers = params.get("numbers").toString();
		
		if(LotteryManager.storeLotteryTicket(numbers))
			return ok();
		else
			return unauthorized();
	}
}