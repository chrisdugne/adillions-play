package domain;

import java.util.Date;

import models.Lottery;

public class DrawManager {

	//------------------------------------------------------------------------------------//

	public static Lottery getNextDraw()
	{
		Long now = new Date().getTime();
		return Lottery.find
				.where().gt("date", now)
				.orderBy("date asc")
				.findList().get(0);
	}

	//------------------------------------------------------------------------------------//
}
