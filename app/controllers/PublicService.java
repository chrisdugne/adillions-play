package controllers;

import managers.LotteryManager;
import play.mvc.Result;

/**
 * ATTENTION DE NE PAS laisser des services tests ici : c'est ouvert sans sécurité !
 * @author mad
 *
 */
public class PublicService extends Application 
{

	//-----------------------------------------------------------//
	
	public static Result getNextLottery()
	{
		return ok(gson.toJson(LotteryManager.getNextLottery()));
	}

	//-----------------------------------------------------------//
	
//	public static Result incTest()
//	{
//		System.out.println("incrementNbPlayers");
//		LotteryManager.incrementNbPlayers();
//		return ok();
//	}
	
	
}