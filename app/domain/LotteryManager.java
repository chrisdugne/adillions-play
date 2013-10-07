package domain;

import java.util.Date;

import models.Lottery;

public class LotteryManager {

	//------------------------------------------------------------------------------------//

	public static Lottery getNextLottery()
	{
		Long now = new Date().getTime();
		return Lottery.find
				.where().gt("date", now)
				.orderBy("date asc")
				.findList().get(0);
	}

	//------------------------------------------------------------------------------------//
}
