package controllers;

import models.Player;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import play.mvc.With;
import domain.LotteryManager;

@With(SecurityController.class)
public class LotteryService extends Application 
{
	public static Result getNextLottery()
	{
		return ok(gson.toJson(LotteryManager.getNextLottery()));
	}

	public static Result storeLotteryTicket()
	{
		System.out.println("storeLotteryTicket proceed");
		Player player = Application.player();
		
		System.out.println(player.getEmail());
		System.out.println(player.getUid());
		
		JsonNode params = request().body().asJson();
		String ticket = params.get("ticket").toString();
				
		System.out.println(ticket);
		
		return ok();
	}
}