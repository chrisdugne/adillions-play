package managers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import models.Lottery;
import models.LotteryTicket;
import models.Player;
import models.RaffleTicket;

import org.codehaus.jackson.JsonNode;

import play.db.ebean.Transactional;
import utils.Utils;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import com.avaje.ebean.ExpressionList;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.typesafe.plugin.MailerAPI;
import com.typesafe.plugin.MailerPlugin;

import controllers.Application;

public class AccountManager {

    //------------------------------------------------------------------------------------//

    public static final int START_AVAILABLE_TICKETS         = 8;

    // -----------------------------------------------------------------------------------//

    public static boolean existEmail(JsonNode userJson)
    {
        String email = userJson.get("email").asText();
        Player player = Player.findByEmail(email);

        return player != null;
    }

    public static boolean existNames(JsonNode userJson)
    {
        String firstName         = userJson.get("firstName").asText().toUpperCase();
        String lastName         = userJson.get("lastName").asText().toUpperCase();

        ExpressionList<Player> accounts = Player.find.where()
                .and(Expr.eq("upper(firstName)", firstName), Expr.eq("upper(lastName)", lastName));

        return accounts.findRowCount() == 1;
    }

    //------------------------------------------------------------------------------------//

    public static Player getPlayerWithCredentials(JsonNode userJson)
    {
        String email = userJson.get("email").asText();
        String password = userJson.get("password").asText();
        ExpressionList<Player> accounts = Player.find.where().ilike("email", email);

        Player player = null;

        if(accounts.findRowCount() == 1){
            player = accounts.findUnique();

            String secret = Utils.SHA512(player.getCreationDate() + password);

            if(!player.getSecret().equals(secret)){
                player = null;
            }
        }

        return player;
    }

    //------------------------------------------------------------------------------------//

    public static Player getPlayer(String token) 
    {
        return Player.findByAuthToken(token);        
    }
    
    //------------------------------------------------------------------------------------//
    
    public static Player fetchPlayerByFacebookId(String facebookId, Boolean fromWeb, Double mobileVersion, String country) {
        Player player = Player.findByFacebookId(facebookId);
        
        if(player != null){
            refreshPlayer(player, fromWeb, mobileVersion, country);
            return player;
        }
        else return null; 
        
    }

    //------------------------------------------------------------------------------------//

    public static Player getPlayerByFacebookId(String facebookId) {
        return Player.findByFacebookId(facebookId);
    }

    //------------------------------------------------------------------------------------//

    public static Player getPlayerByUID(String playerUID) {
        return Player.findByUID(playerUID);
    }

    //------------------------------------------------------------------------------------//

    public static Player getPlayerBySponsorCode(String code) {
        return Player.findBySponsorCode(code);
    }

    //------------------------------------------------------------------------------------//

    private static boolean existSponsorCode(String code) {
        return Player.findBySponsorCode(code) != null;
    }

    //------------------------------------------------------------------------------------//

    @Transactional
    public static Player createNewPlayer(JsonNode userJson) 
    {
        long now = new Date().getTime();

        String email                = userJson.get("email").asText().toLowerCase();
        String firstName            = userJson.get("firstName").asText();
        String lastName             = userJson.get("lastName").asText();
        String birthDate            = userJson.get("birthDate").asText();
        String lang                 = userJson.get("lang").asText();

        String userName             = firstName + " " + lastName;

        //-------------------------------------//

        String referrerId   = null;
        if(userJson.get("referrerId").asText().length() > 0){
            referrerId      = userJson.get("referrerId").asText();
        }

        //-------------------------------------//

        String facebookId   = null;
        if(userJson.get("facebookId") != null){
            facebookId      = userJson.get("facebookId").asText();
            userName        = userJson.get("facebookName").asText();
        }

        //-------------------------------------//

        String twitterId    = null;
        String twitterName  = null;
        if(userJson.get("twitterId") != null){
            twitterId       = userJson.get("twitterId").asText();
            twitterName     = userJson.get("twitterName").asText();
        }

        //-------------------------------------//

        String secret       = null;
        if(userJson.get("password") != null){
            // password is SHA512 from client
            String password         = userJson.get("password").asText();
            secret = Utils.SHA512(now + password);
        } // else : FB signin : no secret

        //-------------------------------------//

        Player player = new Player();

        player.setUid                           (Utils.generateUID());
        player.setSponsorCode                   (generateSponsorCode());
        player.setEmail                         (email);
        player.setFirstName                     (firstName);
        player.setLastName                      (lastName);
        player.setSecret                        (secret);
        player.setLang                          (lang);
        player.setReferrerId                    (referrerId);
        player.setBirthDate                     (birthDate);
        player.setFacebookId                    (facebookId);
        player.setTwitterId                     (twitterId);
        player.setTwitterName                   (twitterName);
        player.setUserName                      (userName);
        player.setLotteryTickets                (new ArrayList<LotteryTicket>());
        player.setRaffleTickets                 (new ArrayList<RaffleTicket>());
        
        player.setCurrentLotteryUID             ("-");
        player.setMobileVersion                 (1d);
        player.setCountry                       ("US");

        player.setTweet                         (false);
        player.setTweetTheme                    (false);
        player.setPostOnFacebook                (false);
        player.setTweetAnInvite                 (false);
        player.setInvitedOnFacebook             (false);

        player.setAvailableTickets              (START_AVAILABLE_TICKETS);
        player.setTemporaryBonusTickets         (0);
        player.setPlayedBonusTickets            (0);
        player.setTotalPlayedTickets            (0);
        player.setTotalPaidTickets              (0);

        player.setFacebookFan                   (false);
        player.setTwitterFan                    (false);

        player.setCurrentPoints                 (0);
        player.setTotalPoints                   (0);
        player.setIdlePoints                    (0);

        player.setCreationDate                  (now);
        player.setStatus                        (Player.ON);
        player.setAcceptEmails                  (true);

        //-------------------------------------//

        Ebean.save(player);  

        //-------------------------------------//

        String subject = getSignupSubject(lang);
        String content = getSignupEmail(lang, player);

        MailerAPI mail = play.Play.application().plugin(MailerPlugin.class).email();
        mail.setSubject(subject);
        mail.addRecipient(email);
        mail.addFrom("noreply@adillions.com");

        try{
            mail.sendHtml("<html>"+content+"</html>" );
        }
        catch(Exception e){
            System.out.println("couldn't email " + player.getEmail());
        }

        //-------------------------------------//

        return player;
    }

    //------------------------------------------------------------------------------------//

    private static String getSignupSubject(String lang) {

        String subject = "";
        if(lang.equals("fr")){
            subject = "Welcome to Adillions !";
        }
        else{
            subject = "Bienvenue sur Adillions !";
        }

        return subject;
    }

    private static String getSignupEmail(String lang, Player player) {

        String welcome = "";
        String text1 = "";
        String text2 = "";

        String titleList = "";
        String list1 = "";
        String list2 = "";
        String list3 = "";
        String list4 = "";

        String final1 = "";
        String final2 = "";
        String final3 = "";


        if(lang.equals("fr")){
            welcome = "Bonjour "+player.getFirstName()+" !";
            text1 = "Bienvenue sur Adillions, la loterie gratuite avec des gains d’argent réel financés par la publicité !";
            text2 = "Félicitations ! Vous venez de rejoindre notre communauté internationale de joueurs, vous pouvez dorénavant jouer à Adillions sur votre smartphone (iOS et Android) ou sur internet à l'adresse : www.adillions.com ou directement sur Facebook";

            titleList = "Chaque semaine sur Adillions, ce sont:";
            list1 = "plusieurs tickets de loterie à remplir";
            list2 = "un nouveau thème à découvrir";
            list3 = "un tirage en direct sur Youtube";
            list4 = "des gains d'argent réel à gagner";

            final1 = "Invitez vos amis pour faire augmenter la cagnotte !";
            final2 = "Bonne chance,";
            final3 = "L’équipe d’Adillions";
        }
        else{
            welcome = "Hi "+player.getFirstName()+" !";
            text1 = "Welcome to Adillions, the free lottery with real cash prizes funded by advertising !";
            text2 = "Congratulations! You have now joined our international community of players. You can now play Adillions on your smartphone (iOS and Android), on the web at www.adillions.com or directly on Facebook.";

            titleList = "Each week on Adillions, it is:";
            list1 = "Several lottery tickets to fill out";
            list2 = "A new theme to discover";
            list3 = "Draw results live on Youtube";
            list4 = "Prizes to win";

            final1 = "Invite your friends to increase the jackpot !";
            final2 = "Good luck,";
            final3 = "The Adillions Team.";
        }

        String content = "<p>" + welcome + "</p>" + 
                "<p>" + text1 + "</p>" +
                "<p>" + text2 + "</p>" +
                "<p>" + titleList + "</p>" +
                "<ul>" + 
                "<li>" + list1 + "</li>" +
                "<li>" + list2 + "</li>" +
                "<li>" + list3 + "</li>" +
                "<li>" + list4 + "</li></ul>" +

                "<br/><p>" + final1 + "</p>" +
                "<br/><p>" + final2 + "</p>" +
                "<br/><p>" + final3 + "</p>" +

                "<span style=\"color: #888888;\"><img id=\"logo\" style=\"width: 180px;\" src=\""+Application.APP_HOSTNAME+"/assets/images/logo.png\" alt=\"\" /></span>" +
                "<p style=\"padding-left: 20px;margin-top:2px\"><span style=\"color: #888888;\">"+Application.APP_HOSTNAME+"</span></p>";

        return content;
    }

    //------------------------------------------------------------------------------------//

    private static String generateSponsorCode() {

        String code = Utils.generateSponsorCode();

        if(existSponsorCode(code))
            return generateSponsorCode();
        else
            return code;
    }

    //------------------------------------------------------------------------------------//

    public static Player updatePlayer(Player player, JsonNode newUserJson) {

        //-------------------------------------//

        String facebookId           = null;
        String twitterId            = null;
        String twitterName          = null;
        String userName             = newUserJson.get("userName").asText();

        //-------------------------------------//

        if(newUserJson.get("facebookId") != null && player.getFacebookId() == null){
            facebookId      = newUserJson.get("facebookId").asText();
            userName        = newUserJson.get("facebookName").asText();

            Player playerExisting = getPlayerByFacebookId(facebookId);

            if(playerExisting != null){
                System.out.println("playerExisting !");
                return null; // merge with an existing FB account
            }

            player.setFacebookId            (facebookId);
            player.setUserName            (userName);
        }

        //-------------------------------------//

        if(newUserJson.get("twitterId") != null && player.getTwitterId() == null){
            twitterId       = newUserJson.get("twitterId").asText();
            twitterName     = newUserJson.get("twitterName").asText();

            player.setTwitterId             (twitterId);
            player.setTwitterName           (twitterName);
        }

        //-------------------------------------//

        player.setIdlePoints                (newUserJson.get("idlePoints").asInt());

        //-------------------------------------//

        player.setCurrentLotteryUID         (newUserJson.get("currentLotteryUID").asText());
        player.setAvailableTickets          (newUserJson.get("availableTickets").asInt());
        player.setPlayedBonusTickets        (newUserJson.get("playedBonusTickets").asInt());
        player.setExtraTickets              (newUserJson.get("extraTickets").asInt());

        //-------------------------------------//

        player.setTweet                     (newUserJson.get("hasTweet").asBoolean());
        player.setPostOnFacebook            (newUserJson.get("hasPostOnFacebook").asBoolean());
        player.setTweetAnInvite             (newUserJson.get("hasTweetAnInvite").asBoolean());
        player.setInvitedOnFacebook         (newUserJson.get("hasInvitedOnFacebook").asBoolean());
        
        if(player.getMobileVersion() >= 1.3 && newUserJson.get("hasTweetTheme") != null){
            player.setTweetTheme                (newUserJson.get("hasTweetTheme").asBoolean());
            player.setPostThemeOnFacebook       (newUserJson.get("hasPostThemeOnFacebook").asBoolean());
        }
        

        //-------------------------------------//

        Ebean.save(player);  
        
        return player;
    }

    //------------------------------------------------------------------------------------//

    public static Player updateFanStatus(Player player, Boolean facebookFan, Boolean twitterFan) {

        player.setFacebookFan (facebookFan);
        player.setTwitterFan (twitterFan);

        Ebean.save(player);  

        return player;
    }

    //------------------------------------------------------------------------------------//

    public static void giveToCharity(Player player) {
        
        List<LotteryTicket> tickets = null;

        //-------------------------------------//

        if(player.getMobileVersion() >= 1.3){
            tickets = getAllLotteryTickets(player);
        }

        else{
            // 1.2 ------------- DEPRECATED -------
            tickets = player.getLotteryTickets();
        }

        //-------------------------------------//

        for(LotteryTicket ticket : tickets){

            if(ticket.getPrice() == null)
                continue;

            if(ticket.getStatus() == LotteryTicket.blocked){
                ticket.setStatus(LotteryTicket.gift);
                Ebean.save(ticket);  
            }
        }
    }

    //------------------------------------------------------------------------------------//

    public static void cashout(Player player, String country) {

        Double euros    = 0d;
        Double usd      = 0d;
        
        List<LotteryTicket> tickets = null;

        //-------------------------------------//
        
        if(player.getMobileVersion() >= 1.3){
            tickets = getAllLotteryTickets(player);
        }
        
        else{
            // 1.2 ------------- DEPRECATED -------
            tickets = player.getLotteryTickets();
        }

        //-------------------------------------//

        for(LotteryTicket ticket : tickets){
            
            if(ticket.getPrice() == null)
                continue;
            
            if(ticket.getStatus() == LotteryTicket.blocked){
                ticket.setStatus(LotteryTicket.pending);
                Ebean.save(ticket);  
                euros   += ticket.getPrice();
                usd     += Utils.countryPrice(euros, player.getCountry(), ticket.getLottery().getRateUSDtoEUR());
            }
        }

        //-------------------------------------//
        // to winners@adillions.com
        
        String subject = "[Adillions - Cashout request]";

        String content = "<p>Cashout</p>" + 
                "<p>date : "        + new Date().toString()             + "</p>" +
                "<p>player : "      + player.getUid()                   + "</p>" + 
                "<p>email : "       + player.getEmail()                 + "</p>" + 
                "<p>firstName : "   + player.getFirstName()             + "</p>" + 
                "<p>lastName : "    + player.getLastName()              + "</p>" + 
                "<p>birthdate : "   + player.getBirthDate()             + "</p>" + 
                "<p>amount : "      + Utils.roundOneDecimals(euros)     + "</p>" + 
                "<p>country : "     + country                           + "</p>" ; 

        MailerAPI mail = play.Play.application().plugin(MailerPlugin.class).email();
        mail.setSubject(subject);
        mail.addRecipient("winners@adillions.com");
        mail.addFrom("winners@adillions.com");

        try{
            mail.sendHtml("<html>"+content+"</html>" );
        }
        catch(Exception e){
            System.out.println("couldn't cashout " + player.getEmail() + " | amount : " + euros);
        }

        //-------------------------------------//
        // to player
        
        String price = "";
        if(Utils.isEuroCountry(player.getCountry()))
            price = Utils.displayPrice(euros, player.getCountry());
        else
            price = Utils.displayPrice(usd, player.getCountry());
        
        String subject2         = "[Adillions - Cashout request]";
        String cashoutOK        = "";
        String congratulations  = "";
        
        if(player.getLang().equals("fr")){
            cashoutOK = "Your cash out request of "+ price + " has been successfully sent.";
            congratulations = "Congratulations !";
        }
        else{
            cashoutOK = "Votre demande de paiement de "+ price + " a été reçue avec succès.";
            congratulations = "Félicitations !";
        }

        String content2 = "<p>" + cashoutOK + "</p>" + 
                "<p>" + congratulations + "</p>" +

                "<span style=\"color: #888888;\"><img id=\"logo\" style=\"width: 180px;\" src=\""+Application.APP_HOSTNAME+"/assets/images/logo.png\" alt=\"\" /></span>" +
                "<p style=\"padding-left: 20px;margin-top:2px\"><span style=\"color: #888888;\">"+Application.APP_HOSTNAME+"</span></p>";

        
        
        MailerAPI mail2 = play.Play.application().plugin(MailerPlugin.class).email();
        mail.setSubject(subject2);
        mail.addRecipient(player.getEmail());
        mail.addFrom("winners@adillions.com");
        
        try{
            mail2.sendHtml("<html>"+content2+"</html>" );
        }
        catch(Exception e){
            System.out.println("couldn't tell player " + player.getEmail() + " | amount : " + euros);
        }
    }

    //---------------------------------------------------------------------------------------------------------------//

    /**
     * - Check if the player is reset and ready for the current Lottery
     * - Then Check for bonus/winnings notifications
     * 
     * @param player
     * @param fromWeb 
     * @param country 
     * @param version 
     */
    public static void refreshPlayer(Player player, Boolean fromWeb, Double mobileVersion, String country) {
        
        if(mobileVersion != null)
            player.setMobileVersion(mobileVersion);

        if(country != null)
            player.setCountry(country);
        
        Ebean.save(player);
        
        // set lastest tickets on player's list
        player.setLotteryTickets(getLotteryTickets(player, null));
        
        System.out.println("----> refresh player | " + player.getMobileVersion() + " : " + fromWeb);
        if(!fromWeb && player.getMobileVersion() >= 1.3){
            System.out.println("----> proceed");
            checkLottery(player);
            retrieveBonusTickets(player);
            calculateWinnings(player);
        }
    }

    //------------------------------------------------------------------------------------//
    
    /*
     * 1.2- : allTickets
     * 1.3+ : tickets for specific lotteries
     */
    public static List<LotteryTicket> getLotteryTickets(Player player, String lastLotteryUID) {
        if(player.getMobileVersion() >= 1.3){
            List<String> lotteryUIDs = getLotteryUIDsFrom(lastLotteryUID, player, 2);
            return findLotteryTickets(player, lotteryUIDs);
        }
        else
            return getAllLotteryTickets(player);
    }
    
    private static List<String> getLotteryUIDsFrom(String lastLotteryUID, Player player, int nb) {
        ArrayList<String> lotteryUIDs = new ArrayList<String>();
        
        while(lotteryUIDs.size() < nb){
            List<String> nextUIDs = LotteryManager.getLotteryUIDsAfter(lastLotteryUID, nb);
            
            for(String nextUID : nextUIDs){
                if(lotteryUIDs.size() < nb){
                    lastLotteryUID = nextUID;
                    if(findOneLotteryTicket(player, nextUID) != null){
                        lotteryUIDs.add(nextUID);
                    }
                }
            }
            
            if(nextUIDs.size() == 0)
                break;
        }
        
        return lotteryUIDs;
    }

    private static List<LotteryTicket> findLotteryTickets(Player player, List<String> lotteryUIDs) {
        return LotteryTicket.find
                .fetch("lottery")
                .where().in("lottery.uid", lotteryUIDs)
                .where().eq("player.uid", player.getUid())
                .orderBy("creationDate desc")
                .findList();
   }
    
    private static LotteryTicket findOneLotteryTicket(Player player, String lotteryUID) {

        return LotteryTicket.find
                .where().eq("lottery.uid", lotteryUID)
                .where().eq("player.uid", player.getUid())
                .setMaxRows(1)
                .findUnique();
    }

    //------------------------------------------------------------------------------------//
    
    public static List<LotteryTicket> getAllLotteryTickets(Player player) {
        return LotteryTicket.find
                .fetch("lottery")
                .where().eq("player.uid", player.getUid())
                .orderBy("creationDate desc")
                .findList();
    }
    
    //------------------------------------------------------------------------------------//

    /**
     * sum winnings from all tickets
     * @param player
     */
    private static void calculateWinnings(Player player) {

        player.setTotalWinnings     (0d);
        player.setBalance           (0d);
        player.setTotalGift         (0d);
        player.setPendingWinnings   (0d);
        player.setReceivedWinnings  (0d);
        
        for(LotteryTicket ticket : getAllLotteryTickets(player)){
            Double value = Utils.countryPrice(ticket.getPrice(), player.getCountry(), ticket.getLottery().getRateUSDtoEUR());
            player.setTotalWinnings(player.getTotalWinnings() + value);

            if(ticket.getStatus() != null){
                if(ticket.getStatus() == LotteryTicket.blocked)
                    player.setBalance(player.getBalance() + value);
                
                else if(ticket.getStatus() == LotteryTicket.gift)
                    player.setTotalGift(player.getTotalGift() + value);
                
                else if(ticket.getStatus() == LotteryTicket.pending)
                    player.setPendingWinnings(player.getPendingWinnings() + value);
                
                else
                    player.setReceivedWinnings(player.getReceivedWinnings() + value);
            }
        }
    }
    
    //------------------------------------------------------------------------------------//
    
    /**
     * reset for new lottery to play
     * @param player
     */
    private static void checkLottery(Player player) {

        Lottery currentLottery = LotteryManager.getNextLottery();

        if(!player.getCurrentLotteryUID().equals(currentLottery.getUid())){

            player.setCurrentLotteryUID     (currentLottery.getUid());
            player.setAvailableTickets      (START_AVAILABLE_TICKETS);
            player.setPlayedBonusTickets    (0);
            player.setTemporaryBonusTickets (0);

            player.setTweet                 (false);
            player.setTweetTheme            (false);
            player.setPostOnFacebook        (false);
            player.setInvitedOnFacebook     (false);
        }
    }

    //------------------------------------------------------------------------------------//

    /**
     * on fetch player only
     * convert ticket as "notification done"
     * sum the notifications
     * 
     * @param player
     */
    private static void retrieveBonusTickets(Player player) {

        int instants            = 0;
        int stocks              = 0;
        double prizes           = 0;
        double prizesUSD        = 0;

        long now = new Date().getTime();

        System.out.println("----> retrieveBonusTickets");

        for(LotteryTicket ticket : getAllLotteryTickets(player)){

            //--------------------------------------------//
            // losing ticket

            if(ticket.getStatus() == null){
                continue;
            }

            //--------------------------------------------//
            // money prizes 

            System.out.println("----> ticket " + ticket.getUid() + " | status : " + ticket.getStatus());
            if(ticket.getStatus() == LotteryTicket.unseen){
                ticket.setStatus(LotteryTicket.blocked);
                prizes        += ticket.getPrice();
                prizesUSD     += Utils.roundOneDecimals(ticket.getPrice() * ticket.getLottery().getRateUSDtoEUR());
                Ebean.save(ticket);  
            }

            //--------------------------------------------//
            // bonus 
            // 11,12,13,14 --> 111,112,113,114 

            if(ticket.getStatus() > 10 && ticket.getStatus() < 100 ){
                ticket.setStatus(ticket.getStatus() + 100);

                JsonParser parser = new JsonParser();
                JsonObject bonus = (JsonObject)parser.parse(ticket.getBonus());

                long maxTime = bonus.get("maxTime").getAsLong();

                if(now < maxTime)
                    stocks += bonus.get("stocks").getAsLong();

                instants += bonus.get("instants").getAsLong();

                System.out.println("----> ticket " + ticket.getUid() + " | IT : " + instants + " | BT : " + stocks);
                Ebean.save(ticket);  
            }

            //--------------------------------------------//
        }

        JsonObject notifications = new JsonObject();
        notifications.addProperty("instants", instants);
        notifications.addProperty("stocks", stocks);
        notifications.addProperty("prizes", prizes);
        notifications.addProperty("prizesUSD", Utils.roundOneDecimals(prizesUSD));

        player.setNotifications(notifications.toString());

        player.setTemporaryBonusTickets(player.getTemporaryBonusTickets() + stocks);
        player.setExtraTickets(player.getExtraTickets() + instants);

        Ebean.save(player);  
    }

}

