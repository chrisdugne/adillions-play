package managers;

import java.util.ArrayList;
import java.util.Date;

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
		Long now = new Date().getTime();
		return Lottery.find
				.where().gt("date", now)
				.orderBy("date asc")
				.findList().get(0);
	}

	//------------------------------------------------------------------------------------//
	
	public static boolean storeLotteryTicket(String numbers){
		
		System.out.println("storeLotteryTicket proceed");
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
		
		System.out.println("nbLotteriesPlayed : " + playedLotteries.size());
		System.out.println("nbTicketsPlayed : " + nbTicketsPlayed);
		
		if(nbTicketsPlayed >= player.getAvailableTickets())
			return false;
		
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
		
		lotteryTicket.save();
		player.save();
		
		// -----------------------------------------------------//
		
		return true;
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
