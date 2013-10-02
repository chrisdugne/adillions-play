package domain;

import java.util.Date;

import models.Draw;

public class DrawManager {

	//------------------------------------------------------------------------------------//

	public static Draw getNextDraw()
	{
		Long now = new Date().getTime();
		return Draw.find
				.where().gt("date", now)
				.orderBy("date asc")
				.findList().get(0);
	}

	//------------------------------------------------------------------------------------//
}
