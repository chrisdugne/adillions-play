package controllers;

import managers.LotteryManager;
import play.mvc.Result;

public class PublicService extends Application 
{
	public static Result incTest()
	{
		System.out.println("inctest");
		LotteryManager.incTest();
		return ok();
	}
}