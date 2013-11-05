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

		MailerAPI mail = play.Play.application().plugin(MailerPlugin.class).email();
		mail.setSubject("Adillions - Welcome !");
		mail.addRecipient(email);
		mail.addRecipient("chris.dugne@gmail.com");
		mail.addFrom("noreply@adillions.com");

		String content = "<p>Welcome "+player.getFirstName()+" !" +
				"<br/><br/>Your account is now ready" +
				"<br/>"+player.getFirstName() + " " + player.getLastName() +
				"<br/>"+email+"</p>" +
				"<span style=\"color: #888888;\"><img id=\"logo\" style=\"width: 180px;\" src=\""+Application.APP_HOSTNAME+"/assets/images/logo.png\" alt=\"\" /></span>" +
				"<p style=\"padding-left: 20px;margin-top:2px\"><span style=\"color: #888888;\">"+Application.APP_HOSTNAME+"</span></p>";
		
		mail.sendHtml("<html>"+content+"</html>" );

		//-------------------------------------//

		return player;
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
}
