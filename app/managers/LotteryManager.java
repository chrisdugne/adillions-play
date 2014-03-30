package managers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import com.avaje.ebean.SqlRow;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import models.Global;
import models.Lottery;
import models.LotteryTicket;
import models.Player;
import utils.Utils;
import controllers.Application;

public class LotteryManager {

    //------------------------------------------------------------------------------------//

    public static final int NB_POINTS_PER_TICKET                                = 1;
    public static final int NB_INSTANTS_PER_REFERRING                           = 2;
    public static final int NB_LOTTERIES_TO_PLAY_TO_BE_REFERRED                 = 2;

    public static final int FACEBOOK_FAN_TICKETS                                = 3;
    public static final int FACEBOOK_CONNECTION_TICKETS                         = 1;
    public static final int TWITTER_FAN_TICKETS                                 = 3;
    public static final int TWITTER_CONNECTION_TICKETS                          = 1;

    //------------------------------------------------------------------------------------//

    public static Global getGlobal()    {
        return Global.current();
    }

    //------------------------------------------------------------------------------------//

    public static Lottery getLottery(String lotteryUID) {
        return Lottery.findByUID(lotteryUID);
    }

    //------------------------------------------------------------------------------------//

    public static Lottery getNextLottery()    {
        
        Long now = new Date().getTime();
        Long nowPlus2h = now + 2 * 60 * 60 * 1000;

        Lottery lottery = Lottery.find
                .where().gt("date", nowPlus2h)
                .orderBy("date asc")
                .findList().get(0);

        //-------------------------------------

        findNbTicketsForLottery(lottery);

        //-------------------------------------

        return lottery;
    }

    //------------------------------------------------------------------------------------//

    public static Lottery getNextDrawing()    {

        Long now = new Date().getTime();

        Lottery nextDrawing = Lottery.find
                .where().gt("date", now)
                .orderBy("date asc")
                .findList().get(0);

        //-------------------------------------

        findNbTicketsForLottery(nextDrawing);

        //-------------------------------------

        return nextDrawing;
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

    public static List<String> getLotteryUIDsAfter(String lastLotteryUID, int nb) {

        Query<Lottery> query = Lottery.find
                .orderBy("date desc")
                .setMaxRows(nb);

        List<Lottery> lotteries;

        if(lastLotteryUID != null){
            Lottery lastLottery = Lottery.find.where().eq("uid", lastLotteryUID).findUnique();
            lotteries = query
                    .where().lt("date", lastLottery.getDate())
                    .findList();
        }
        else{
            lotteries = query.findList();
        }

        ArrayList<String> lotteryUIDs = new ArrayList<String>();

        for(Lottery lottery : lotteries)
            lotteryUIDs.add(lottery.getUid());

        return lotteryUIDs;
    }

    //------------------------------------------------------------------------------------//

    private static void findNbTicketsForLottery(Lottery lottery) {
        String sql          = "SELECT count(*) FROM lottery_ticket where lottery_uid='"+lottery.getUid()+"'";
        SqlRow result       = Ebean.createSqlQuery(sql).findUnique();  

        lottery.setNbTickets(result.getInteger("count"));
    }

    private static void findNbWinnersForLottery(Lottery lottery) {
        String sql          = "select count(*)  from lottery_ticket where lottery_uid='"+lottery.getUid()+"' and \"price\" IS NOT NULL and \"price\" > 0;";
        SqlRow result       = Ebean.createSqlQuery(sql).findUnique();  

        lottery.setNbWinners(result.getInteger("count"));
    }

    //------------------------------------------------------------------------------------//
    
    private static Integer getNbLotteriesPlayed(String playerUID) {
        String sql          = "select count (*) from ( select distinct lottery_uid from lottery_ticket where player_uid = '"+playerUID+"' ) as lotteries";
        SqlRow result       = Ebean.createSqlQuery(sql).findUnique();  
        return result.getInteger("count");
    }
    
    private static Integer getNbTicketsPlayed(String playerUID, String lotteryUID) {
        String sql          = "select count (*) from lottery_ticket where player_uid = '"+playerUID+"' and lottery_uid = '"+lotteryUID+"'";
        SqlRow result       = Ebean.createSqlQuery(sql).findUnique();  
        return result.getInteger("count");
    }
    
    //------------------------------------------------------------------------------------//

    /**
     * 
     * @param numbers
     * @param isExtraTicket utilise uniquement pour check de triche de joueur (multi connection) 
     *     pour le decompte on utilise la donnee server player.getExtraTickets(), au cas ou l'appel serait une triche de developpeur (set isExtraTicket = false) 
     * @param creationTime 
     * @return
     */
    public static Player storeLotteryTicket(String numbers, Boolean isExtraTicket, Long creationTime){

        Player player           = Application.player();
        Lottery lottery         = LotteryManager.getNextLottery();
        Global global           = LotteryManager.getGlobal();
        JsonParser parser       = new JsonParser();
        JsonObject appStatus    = (JsonObject)parser.parse(global.getAppStatus());

        // -----------------------------------------------------//
        
        System.out.println("state : " + appStatus.get("state").getAsInt());
        if(appStatus.get("state").getAsInt() != 1){
            return null;
        }
        
        // -----------------------------------------------------//

//        int facebookFanBonus = 0;
//        int twitterFanBonus = 0;
//
//        if(player.getFacebookId() != null)
//            facebookFanBonus += FACEBOOK_CONNECTION_TICKETS;
//
//        if(player.isFacebookFan())
//            facebookFanBonus += FACEBOOK_FAN_TICKETS;
//
//        if(player.getTwitterId() != null)
//            twitterFanBonus += TWITTER_CONNECTION_TICKETS;
//
//        if(player.isTwitterFan())
//            twitterFanBonus += TWITTER_FAN_TICKETS;

        // -----------------------------------------------------//
        // Triches 
//        
//        System.out.println("storeLotteryTicket");
//        System.out.println(player.getAvailableTickets() );
//        System.out.println(player.getTemporaryBonusTickets() );
//        System.out.println(facebookFanBonus );
//        System.out.println(twitterFanBonus );
//        System.out.println( player.getPlayedBonusTickets() );
//
//        if(player.getAvailableTickets() + player.getTemporaryBonusTickets() + facebookFanBonus + twitterFanBonus - player.getPlayedBonusTickets() <= 0){ 
//            System.out.println("triche1");
//            return player;
//        }
//
//        if(isExtraTicket && player.getExtraTickets() <= 0){
//            System.out.println("triche2");
//            return player;
//        }


        // -----------------------------------------------------//
        // New player / First ticket

        if(getNbTicketsPlayed(player.getUid(), lottery.getUid()) == 0)
            incrementNbPlayers(lottery);

        // -----------------------------------------------------//
        // referring
        
        if(!player.hasGivenToReferrer()
            && player.getReferrerId() != null
            && player.getReferrerId().length() > 0
            && getNbLotteriesPlayed(player.getUid()) >= NB_LOTTERIES_TO_PLAY_TO_BE_REFERRED ){

            player.setGiftToReferrer(true);

            Player referrer = AccountManager.getPlayerBySponsorCode(player.getReferrerId());

            if(referrer != null){
                player.setIdlePoints(player.getIdlePoints() + NB_INSTANTS_PER_REFERRING);
                referrer.setIdlePoints(referrer.getIdlePoints() + NB_INSTANTS_PER_REFERRING);
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
            player.setAvailableTickets    (player.getAvailableTickets() - 1);
        else
            player.setPlayedBonusTickets (player.getPlayedBonusTickets() + 1);

        
        if(player.getExtraTickets() > 0)
            player.setExtraTickets(player.getExtraTickets() - 1);
        else
            player.setTotalPaidTickets (player.getTotalPaidTickets() + 1);

        
        player.setTotalPlayedTickets    (player.getTotalPlayedTickets() + 1);

        // -----------------------------------------------------//
        // Store ticket

        LotteryTicket lotteryTicket = new LotteryTicket();
        lotteryTicket.setUid(Utils.generateUID());
        lotteryTicket.setNumbers(numbers);
        lotteryTicket.setLottery(lottery);
        lotteryTicket.setPlayer(player);
        lotteryTicket.setCreationDate(creationTime);

        if(isExtraTicket)
            lotteryTicket.setType(LotteryTicket.INSTANT_TICKET);
        else
            lotteryTicket.setType(LotteryTicket.CLASSIC_TICKET);


        lotteryTicket.save();
        player.save();

        // -----------------------------------------------------//

        if(player.getMobileVersion() >= 1.3)
            player.setLotteryTickets(AccountManager.getLotteryTickets(player, null));
        else
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
