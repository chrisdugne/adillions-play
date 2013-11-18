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
	public static final int NB_POINTS_PER_REFERRING 					= 1;
	public static final int NB_LOTTERIES_TO_PLAY_TO_BE_REFERRED 	= 2;

	public static final int FACEBOOK_FAN_TICKETS 						= 2;
	public static final int FACEBOOK_CONNECTION_TICKETS 				= 2;
	public static final int TWITTER_FAN_TICKETS 							= 2;
	public static final int TWITTER_CONNECTION_TICKETS 				= 2;
	
	//------------------------------------------------------------------------------------//

	public static Lottery getNextLottery()
	{
		//-------------------------------------
		
		Long now = new Date().getTime();
		Long nowPlus2h = now + 2 * 60 * 60 * 1000;
		
		Lottery lottery = Lottery.find
				.where().gt("date", nowPlus2h)
				.orderBy("date asc")
				.findList().get(0);

		//-------------------------------------

		findNbTicketsForLottery(lottery);
		System.out.println("tickets : " + lottery.getNbTickets());

		//-------------------------------------

		return lottery;
	}

	//------------------------------------------------------------------------------------//
	
	public static List<Lottery> getFinishedLotteries()
	{
		//-------------------------------------
		
		List<Lottery> lotteries = Lottery.find
				.orderBy("date desc")
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

	/**
	 * 
	 * @param numbers
	 * @param isExtraTicket utilise uniquement pour check de triche de joueur (multi connection) 
	 * 	pour le decompte on utilise la donnee server player.getExtraTickets(), au cas ou l'appel serait une triche de developpeur (set isExtraTicket = false) 
	 * @return
	 */
	public static Player storeLotteryTicket(String numbers, Boolean isExtraTicket){

		Player player = Application.player();
		Lottery lottery = LotteryManager.getNextLottery();

		// -----------------------------------------------------//
		// A - securite : on check cote server si le nb de tickets est ok
		// coté client cest deja fait, mais un post 'dev tricheur' peut arriver ici sans pb
		// ou meme plusieurs connections sur plusieurs devices ! les coquins.
		
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

		// -----------------------------------------------------//
		
		int facebookFanBonus = 0;
		int twitterFanBonus = 0;
		
		if(player.getFacebookId() != null)
			facebookFanBonus += FACEBOOK_CONNECTION_TICKETS;

		if(player.isFacebookFan())
			facebookFanBonus += FACEBOOK_FAN_TICKETS;

		if(player.getTwitterId() != null)
			twitterFanBonus += TWITTER_CONNECTION_TICKETS;
		
		if(player.isTwitterFan())
			twitterFanBonus += TWITTER_FAN_TICKETS;

		// -----------------------------------------------------//
		// Triches 
		
		System.out.println("---------------");
		System.out.println(player.getAvailableTickets() + facebookFanBonus + twitterFanBonus - player.getPlayedBonusTickets());
		System.out.println(player.getExtraTickets());
		System.out.println(isExtraTicket);
		if(player.getAvailableTickets() + facebookFanBonus + twitterFanBonus - player.getPlayedBonusTickets() <= 0) 
			return null;

		if(isExtraTicket && player.getExtraTickets() <= 0){
			return null;
		}
		
		// -----------------------------------------------------//
		// New player / First ticket
		// on ne check pas simplement avec getAvailableTickets car availableTickets peut avoir eu des bonus
		
		if(nbTicketsPlayed == 0)
			incrementNbPlayers(lottery);
		
		// -----------------------------------------------------//
		// referring
		
		if(playedLotteries.size() >= NB_LOTTERIES_TO_PLAY_TO_BE_REFERRED 
		&& !player.hasGivenToReferrer()
		&& player.getReferrerId() != null
		&& player.getReferrerId().length() > 0){
			System.out.println("---------->  gift to referrer !");
			player.setGiftToReferrer(true);

			Player referrer = AccountManager.getPlayerBySponsorCode(player.getReferrerId());
			
			if(referrer != null){
				player.setIdlePoints(player.getIdlePoints() + NB_POINTS_PER_REFERRING);
				referrer.setIdlePoints(referrer.getIdlePoints() + NB_POINTS_PER_REFERRING);
				referrer.save();
			}
			// else : referrerId doesnt exist
		}
		
		// -----------------------------------------------------//
		// give points
		
		if(player.getExtraTickets() <= 0){
			player.setCurrentPoints(player.getCurrentPoints() + NB_POINTS_PER_TICKET);
			player.setTotalPoints(player.getTotalPoints() + NB_POINTS_PER_TICKET);
		}

		// -----------------------------------------------------//
		// count down availble/played tickets
		
		if(player.getAvailableTickets() > 0)
			player.setAvailableTickets	(player.getAvailableTickets() - 1);
		else
			player.setPlayedBonusTickets (player.getPlayedBonusTickets() + 1);

		if(player.getExtraTickets() > 0){
			player.setExtraTickets(player.getExtraTickets() - 1);
		}
		else{
			player.setTotalPaidTickets (player.getTotalPaidTickets() + 1);
		}
			
		player.setTotalPlayedTickets	(player.getTotalPlayedTickets() + 1);
		
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
