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

public class AccountManager {

	//------------------------------------------------------------------------------------//
	
	public static final int START_AVAILABLE_TICKETS 		= 10;
	public static final int FACEBOOK_ACCOUNT_POINTS 		= 8;
	public static final int TWITTER_ACCOUNT_POINTS 			= 8;
	
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

		System.out.println(firstName);
		System.out.println(lastName);
		
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

		int points 				= 0;
		
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
			points		+= FACEBOOK_ACCOUNT_POINTS;
		}
		
		//-------------------------------------//
		
		String twitterId 		= null;
		String twitterName 	= null;
		if(userJson.get("twitterId") != null){
			twitterId 	= userJson.get("twitterId").asText();
			twitterName = userJson.get("twitterName").asText();
			points		+= TWITTER_ACCOUNT_POINTS;
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

		player.setFacebookFan			(false);
		player.setTwitterFan				(false);
		
		player.setCurrentPoints			(0);
		player.setTotalPoints			(0);
		player.setIdlePoints				(points);

		player.setCreationDate			(now);
		player.setStatus					(Player.ON);
		player.setAcceptEmails			(true);

		//-------------------------------------//

		Ebean.save(player);  

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
		int idlePoints 	= newUserJson.get("idlePoints").asInt();
		
		//-------------------------------------//

		if(newUserJson.get("facebookId") != null && player.getFacebookId() == null){
			facebookId 	= newUserJson.get("facebookId").asText();
			userName 	= newUserJson.get("facebookName").asText();
			idlePoints	+= FACEBOOK_ACCOUNT_POINTS;

			player.setFacebookId			(facebookId);
			player.setUserName			(userName);
		}

		//-------------------------------------//
		
		System.out.println(newUserJson.get("twitterId"));
		if(newUserJson.get("twitterId") != null && player.getTwitterId() == null){
			twitterId 	= newUserJson.get("twitterId").asText();
			twitterName = newUserJson.get("twitterName").asText();
			

			System.out.println(twitterId);
			System.out.println(twitterName);
			
			idlePoints	+= TWITTER_ACCOUNT_POINTS;
			
			player.setTwitterId			(twitterId);
			player.setTwitterName		(twitterName);
		}
		
		//-------------------------------------//
		
		player.setCurrentPoints			(newUserJson.get("currentPoints").asInt());
		player.setTotalPoints			(newUserJson.get("totalPoints").asInt());
		player.setIdlePoints				(idlePoints);

		//-------------------------------------//
		
		if(newUserJson.get("facebookFan") != null)
			player.setFacebookFan (newUserJson.get("facebookFan").asBoolean());

		if(newUserJson.get("twitterFan") != null)
			player.setTwitterFan (newUserJson.get("twitterFan").asBoolean());

		//-------------------------------------//
		
		player.setCurrentLotteryUID	(newUserJson.get("currentLotteryUID").asText());
		player.setAvailableTickets		(newUserJson.get("availableTickets").asInt());
		player.setPlayedBonusTickets	(newUserJson.get("playedBonusTickets").asInt());

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
}
