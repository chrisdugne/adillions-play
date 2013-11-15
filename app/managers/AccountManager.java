package managers;

import java.util.ArrayList;
import java.util.Date;

import models.LotteryTicket;
import models.RaffleTicket;
import models.Player;

import org.codehaus.jackson.JsonNode;

import play.db.ebean.Transactional;
import utils.Utils;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import com.avaje.ebean.ExpressionList;
import com.typesafe.plugin.MailerAPI;
import com.typesafe.plugin.MailerPlugin;

import controllers.Application;

public class AccountManager {

	//------------------------------------------------------------------------------------//
	
	public static final int START_AVAILABLE_TICKETS 		= 10;
	
	//------------------------------------------------------------------------------------//

	public static boolean existEmail(JsonNode userJson)
	{
		String email = userJson.get("email").asText();
		ExpressionList<Player> accounts = Player.find.where().ilike("email", email);

		return accounts.findRowCount() == 1;
	}

	public static boolean existNames(JsonNode userJson)
	{
		String firstName 		= userJson.get("firstName").asText().toUpperCase();
		String lastName 		= userJson.get("lastName").asText().toUpperCase();
		
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
		
		String email 			= userJson.get("email").asText();
		String firstName 		= userJson.get("firstName").asText();
		String lastName 		= userJson.get("lastName").asText();
		String birthDate 		= userJson.get("birthDate").asText();
		String lang 			= userJson.get("lang").asText();

		String userName 		= firstName + " " + lastName;

		//-------------------------------------//
		
		String referrerId = null;
		if(userJson.get("referrerId").asText().length() > 0){
			referrerId 	= userJson.get("referrerId").asText();
		}
		
		//-------------------------------------//
		
		String facebookId = null;
		if(userJson.get("facebookId") != null){
			facebookId 	= userJson.get("facebookId").asText();
			userName 	= userJson.get("facebookName").asText();
		}
		
		//-------------------------------------//
		
		String twitterId 		= null;
		String twitterName 	= null;
		if(userJson.get("twitterId") != null){
			twitterId 	= userJson.get("twitterId").asText();
			twitterName = userJson.get("twitterName").asText();
		}

		//-------------------------------------//
		
		String secret = null;
		if(userJson.get("password") != null){
			// password is SHA512 from client
			String password 		= userJson.get("password").asText();
			secret = Utils.SHA512(now + password);
		} // else : FB signin : no secret

		//-------------------------------------//
			
		Player player = new Player();

		player.setUid						(Utils.generateUID());
		player.setSponsorCode			(generateSponsorCode());
		player.setEmail					(email);
		player.setFirstName				(firstName);
		player.setLastName				(lastName);
		player.setSecret					(secret);
		player.setLang						(lang);
		player.setReferrerId				(referrerId);
		player.setBirthDate				(birthDate);
		player.setFacebookId				(facebookId);
		player.setTwitterId				(twitterId);
		player.setTwitterName			(twitterName);
		player.setUserName				(userName);
		player.setLotteryTickets		(new ArrayList<LotteryTicket>());
		player.setRaffleTickets			(new ArrayList<RaffleTicket>());
		
		player.setCurrentLotteryUID	("");
		player.setTweet					(false);
		player.setPostOnFacebook		(false);
		player.setTweetAnInvite			(false);
		player.setInvitedOnFacebook	(false);

		player.setAvailableTickets		(START_AVAILABLE_TICKETS);
		player.setPlayedBonusTickets	(0);
		player.setTotalPlayedTickets	(0);
		player.setTotalPaidTickets		(0);

		player.setFacebookFan			(false);
		player.setTwitterFan				(false);
		
		player.setCurrentPoints			(0);
		player.setTotalPoints			(0);
		player.setIdlePoints				(0);

		player.setCreationDate			(now);
		player.setStatus					(Player.ON);
		player.setAcceptEmails			(true);

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
				"<br/><p>" + text1 + "</p>" +
				"<br/><p>" + text2 + "</p>" +
				"<br/><ul>" + titleList +
				"<li>" + list1 + "</li>" +
				"<li>" + list2 + "</li>" +
				"<li>" + list3 + "</li>" +
				"<li>" + list4 + "</li></ul>" +

				"<br/><br/><p>" + final1 + "</p>" +
				"<br/><br/><p>" + final2 + "</p>" +
				"<br/><br/><p>" + final3 + "</p>" +
				
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

		System.out.println("updatePlayer");
	
		//-------------------------------------//

		String facebookId = null;
		String twitterId 	= null;
		String twitterName= null;
		String userName 	= newUserJson.get("userName").asText();
		
		//-------------------------------------//

		if(newUserJson.get("facebookId") != null && player.getFacebookId() == null){
			facebookId 	= newUserJson.get("facebookId").asText();
			userName 	= newUserJson.get("facebookName").asText();

			Player playerExisting = getPlayerByFacebookId(facebookId);
			
			if(playerExisting != null){
				return null; // merge with an existing FB account
			}
			
			player.setFacebookId			(facebookId);
			player.setUserName			(userName);
		}

		//-------------------------------------//
		
		if(newUserJson.get("twitterId") != null && player.getTwitterId() == null){
			twitterId 	= newUserJson.get("twitterId").asText();
			twitterName = newUserJson.get("twitterName").asText();
			
			player.setTwitterId			(twitterId);
			player.setTwitterName		(twitterName);
		}
		
		//-------------------------------------//
		
		player.setCurrentPoints			(newUserJson.get("currentPoints").asInt());
		player.setTotalPoints			(newUserJson.get("totalPoints").asInt());
		player.setIdlePoints				(newUserJson.get("idlePoints").asInt());

		//-------------------------------------//
		
		player.setCurrentLotteryUID	(newUserJson.get("currentLotteryUID").asText());
		player.setAvailableTickets		(newUserJson.get("availableTickets").asInt());
		player.setPlayedBonusTickets	(newUserJson.get("playedBonusTickets").asInt());
		player.setExtraTickets			(newUserJson.get("extraTickets").asInt());

		//-------------------------------------//

		System.out.println("hasTweet : " + newUserJson.get("hasTweet"));
		System.out.println("hasPostOnFacebook : " + newUserJson.get("hasPostOnFacebook"));
		System.out.println("hasTweetAnInvite : " + newUserJson.get("hasTweetAnInvite"));
		System.out.println("hasInvitedOnFacebook : " + newUserJson.get("hasInvitedOnFacebook"));
		
		player.setTweet					(newUserJson.get("hasTweet").asBoolean());
		player.setPostOnFacebook		(newUserJson.get("hasPostOnFacebook").asBoolean());
		player.setTweetAnInvite			(newUserJson.get("hasTweetAnInvite").asBoolean());
		player.setInvitedOnFacebook	(newUserJson.get("hasInvitedOnFacebook").asBoolean());

		//-------------------------------------//

		Ebean.save(player);  

		return player;
   }

	//------------------------------------------------------------------------------------//
	
	public static Player updateFanStatus(Player player, JsonNode newUserJson) {
		
		System.out.println("updateFanStatus");
		
		//-------------------------------------//

		if(newUserJson.get("facebookFan") != null)
			player.setFacebookFan (newUserJson.get("facebookFan").asBoolean());
		
		if(newUserJson.get("twitterFan") != null)
			player.setTwitterFan (newUserJson.get("twitterFan").asBoolean());
		
		//-------------------------------------//
		
		Ebean.save(player);  
		
		return player;
	}

	//------------------------------------------------------------------------------------//
	
	public static void giveToCharity(Player player) {
	   for(LotteryTicket ticket : player.getLotteryTickets()){
	   	
	   	if(ticket.getPrice() == null)
	   		continue;
	   	
	   	if(ticket.getStatus() == LotteryTicket.blocked){
				System.out.println("gift : " + ticket.getPrice());
	   		ticket.setStatus(LotteryTicket.gift);
	   		Ebean.save(ticket);  
	   	}
	   }
   }

	//------------------------------------------------------------------------------------//
	
	public static void cashout(Player player) {

		Double amount = 0d;
		
		for(LotteryTicket ticket : player.getLotteryTickets()){

			if(ticket.getPrice() == null)
				continue;
			
			if(ticket.getStatus() == LotteryTicket.blocked){
				ticket.setStatus(LotteryTicket.pending);
				amount += ticket.getPrice();
			}
		}

		//-------------------------------------//

		String subject = "[Adillions - Cashout request]";

		String content = "<p>Cashout</p>" + 
				"<br/><p>date : " + new Date().toString()  + "</p>" +
				"<br/><p>player : " + player.getUid() + "</p>" + 
				"<br/><p>firstName : " + player.getFirstName() + "</p>" + 
				"<br/><p>lastName : " + player.getLastName() + "</p>" + 
				"<br/><p>birthdate : " + player.getBirthDate() + "</p>" + 
				"<br/><p>amount : " + amount + " euros</p>" ; 
		
		MailerAPI mail = play.Play.application().plugin(MailerPlugin.class).email();
		mail.setSubject(subject);
		mail.addRecipient("chris.dugne@gmail.com");
		mail.addFrom(player.getEmail());
		
		try{
			mail.sendHtml("<html>"+content+"</html>" );
		}
		catch(Exception e){
			System.out.println("couldn't cashout " + player.getEmail() + " | amount : " + amount);
		}
		
		Ebean.save(player);  
	   
   }

	//------------------------------------------------------------------------------------//
}
