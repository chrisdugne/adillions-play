package managers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.SqlRow;

import models.Lottery;
import models.LotteryTicket;
import models.Player;
import utils.Utils;
import controllers.Application;

public class LotteryManager {

	//------------------------------------------------------------------------------------//

	public static final int NB_POINTS_PER_TICKET	 						= 1;
	public static final int NB_POINTS_PER_REFERRING 					= 4;
	public static final int NB_LOTTERIES_TO_PLAY_TO_BE_REFERRED 	= 2;
	
	//------------------------------------------------------------------------------------//

	public static Lottery getNextLottery()
	{
		//-------------------------------------
		
		Long now = new Date().getTime();
		Lottery lottery = Lottery.find
				.where().gt("date", now)
				.orderBy("date asc")
				.findList().get(0);

		//-------------------------------------

		findNbTicketsForLottery(lottery);

		//-------------------------------------

		return lottery;
	}

	//------------------------------------------------------------------------------------//
	
	public static List<Lottery> getFinishedLotteries()
	{
		//-------------------------------------
		
		List<Lottery> lotteries = Lottery.find
				.orderBy("date asc")
				.where().isNotNull("result")
				.findList();
		
		//-------------------------------------
		
		for(Lottery lottery : lotteries){
			findNbTicketsForLottery(lottery);
			findNbWinnersForLottery(lottery);
		}
		
		//-------------------------------------
		
		return lotteries;
	}

	//------------------------------------------------------------------------------------//
	
	private static void findNbTicketsForLottery(Lottery lottery) {
		String sql 		= "SELECT count(*) FROM lottery_ticket where lottery_uid='"+lottery.getUid()+"'";
		SqlRow result	= Ebean.createSqlQuery(sql).findUnique();  
		
		lottery.setNbTickets(result.getInteger("count"));
   }

	
	private static void findNbWinnersForLottery(Lottery lottery) {
		String sql 		= "select count(*)  from lottery_ticket where lottery_uid='"+lottery.getUid()+"' and \"price\" IS NOT NULL;";
		SqlRow result	= Ebean.createSqlQuery(sql).findUnique();  
		
		lottery.setNbWinners(result.getInteger("count"));
	}
	
	//------------------------------------------------------------------------------------//

	public static Player storeLotteryTicket(String numbers){

		Player player = Application.player();
		Lottery lottery = LotteryManager.getNextLottery();

		// -----------------------------------------------------//
		// A - securite : on check cote server si le nb de tickets est ok
		// coté client cest deja fait, mais un post 'dev tricheur' peut arriver ici sans pb
		// ou meme plusieurs connections sur plusieurs devices ! les coquins.
		//
		// B - on compte le nbre de lotteries jouees pour eventuel gift to referrer
		
		int nbTicketsPlayed = 0;
		ArrayList<String> playedLotteries = new ArrayList<String>();
		
		for(LotteryTicket t : player.getLotteryTickets()){
			if(t.getLottery().getUid().equals(lottery.getUid())){
				nbTicketsPlayed ++;
			}
			
			if(!playedLotteries.contains(t.getLottery().getUid())){
				playedLotteries.add(t.getLottery().getUid());
			}
		}
		
		if(nbTicketsPlayed >= player.getAvailableTickets())
			return null;
		
		// -----------------------------------------------------//
		// New player / First ticket
		
		if(nbTicketsPlayed == 0)
			incrementNbPlayers(lottery);
		
		// -----------------------------------------------------//
		// referring
		
		if(playedLotteries.size() >= NB_LOTTERIES_TO_PLAY_TO_BE_REFERRED 
		&& !player.hasGivenToReferrer()
		&& player.getReferrerId().length() > 0){
			System.out.println("---------->  gift to referrer !");
			Player referrer = AccountManager.getPlayerByUID(player.getReferrerId());
			player.setGiftToReferrer(true);
			referrer.setIdlePoints(referrer.getIdlePoints() + NB_POINTS_PER_REFERRING);
			referrer.save();
		}
		
		// -----------------------------------------------------//
		// give points
		
		player.setCurrentPoints(player.getCurrentPoints() + NB_POINTS_PER_TICKET);
		player.setTotalPoints(player.getTotalPoints() + NB_POINTS_PER_TICKET);

		// -----------------------------------------------------//
		// Store ticket
		
		LotteryTicket lotteryTicket = new LotteryTicket();
		lotteryTicket.setUid(Utils.generateUID());
		lotteryTicket.setNumbers(numbers);
		lotteryTicket.setLottery(lottery);
		lotteryTicket.setPlayer(player);
		lotteryTicket.setCreationDate(new Date().getTime());
		
		
		lotteryTicket.save();
		player.save();
		
		// -----------------------------------------------------//
		
		player.getLotteryTickets().add(0, lotteryTicket);
		return player;
	}

	//------------------------------------------------------------------------------------//

	private static void incrementNbPlayers(Lottery lottery){
		lottery.setNbPlayers(lottery.getNbPlayers()+1);
		tryToSaveLottery(lottery);
	}

	private static void tryToSaveLottery(Lottery lottery) {

		try{
			lottery.save();
		}
		catch(Exception e){
			Utils.sleepMillis(250);
			incrementNbPlayers(lottery);
		}
		
   }
	
	//------------------------------------------------------------------------------------//
}
