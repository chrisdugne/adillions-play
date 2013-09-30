package domain;

import java.util.Date;

import models.Player;

import org.codehaus.jackson.JsonNode;

import play.db.ebean.Transactional;
import utils.Utils;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import com.avaje.ebean.ExpressionList;

public class AccountManager {

	//------------------------------------------------------------------------------------//

	public static boolean existEmail(JsonNode userJson)
	{
		String email = userJson.get("email").asText();
		ExpressionList<Player> accounts = Player.find.where().ilike("email", email);

		return accounts.findRowCount() == 1;
	}

	public static boolean existNames(JsonNode userJson)
	{
		String firstName 		= userJson.get("firstName").asText();
		String lastName 		= userJson.get("lastName").asText();

		System.out.println(firstName);
		System.out.println(lastName);
		
		ExpressionList<Player> accounts = Player.find.where()
				.and(Expr.eq("firstName", firstName), Expr.eq("lastName", lastName));
		
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

	@Transactional
	public static Player createNewPlayer(JsonNode userJson) 
	{
		long now = new Date().getTime();
		
		String email 			= userJson.get("email").asText();
		String firstName 		= userJson.get("firstName").asText();
		String lastName 		= userJson.get("lastName").asText();
		String referrerId 	= userJson.get("referrerId").asText();
		String birthDate 		= userJson.get("birthDate").asText();

		String userName 		= firstName + " " + lastName;
		
		//-------------------------------------//
		
		String facebookId = null;
		if(userJson.get("facebookId") != null){
			System.out.println("fb id " + userJson.get("facebookId").asText());
			facebookId 	= userJson.get("facebookId").asText();
			userName 	= userJson.get("facebookName").asText();
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

		player.setUid			(Utils.generateUID());
		player.setEmail		(email);
		player.setFirstName	(firstName);
		player.setLastName	(lastName);
		player.setSecret		(secret);
		player.setReferrerId	(referrerId);
		player.setBirthDate	(birthDate);
		player.setFacebookId	(facebookId);
		player.setUserName	(userName);

		player.setCreationDate(now);

		//-------------------------------------//

		Ebean.save(player);  

		return player;
	}

	//------------------------------------------------------------------------------------//
}
