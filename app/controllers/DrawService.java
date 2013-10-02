package controllers;

import play.mvc.Result;
import play.mvc.With;
import domain.DrawManager;

@With(SecurityController.class)
public class DrawService extends Application 
{
	public static Result getNextDraw()
	{
		return ok(gson.toJson(DrawManager.getNextDraw()));
	}
}