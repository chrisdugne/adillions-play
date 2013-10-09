package models;

import java.util.List;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import play.db.ebean.Model;

import com.avaje.ebean.Query;
import com.google.gson.annotations.Expose;

@Entity
public class Player extends Model { 

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;

	@Expose
	private String facebookId;

	// FB : facebookData.name
	// A	: firstName + lastName 
	@Expose
	private String userName;
   
	@Expose
	private String email;
	@Expose
	private String firstName;
	@Expose
	private String lastName;
	

	@Expose
	private String birthDate;
	
	@Expose
	private int currentPoints;
	
	@Expose
	private int idlePoints;

	@Expose
	private int totalPoints;

	@Expose
	private int availableTickets;

	@Expose
	private String referrerId;
	@Expose
	private boolean giftToReferrer;

	// -----------------------------------------------------------------------------------------------//

	@OneToMany
	@Expose
	private List<LotteryTicket> lotteryTickets;
	
	@OneToMany
	@Expose
	private List<RaffleTicket> raffleTickets;

	// -----------------------------------------------------------------------------------------------//

	private String authToken;
	private String secret;
	private Long creationDate;

	// -----------------------------------------------------------------------------------------------//

	public String createToken() {
		authToken = UUID.randomUUID().toString();
		save();
		return authToken;
	}

	public void deleteAuthToken() {
		authToken = null;
		save();
	}

	// -----------------------------------------------------------------------------------------------//
	// -- Queries

	public static Model.Finder<String, Player> find = new Finder<String, Player>(String.class, Player.class);

	// -----------------------------------------------------------------------------------------------//

	public static Player findByAuthToken(String authToken) {
		
		if (authToken == null) {
			return null;
		}

		try  {
			return playerQuery()
					.where().eq("authToken", authToken)
					.findUnique();
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	// -----------------------------------------------------------------------------------------------//
	
	public static Player findByFacebookId(String facebookId) {
		if (facebookId == null) {
			return null;
		}
		
		try  {
			return playerQuery()
					.where().eq("facebookId", facebookId)
					.findUnique();
		}
		catch (Exception e) {
			return null;
		}
	}
	
	// -----------------------------------------------------------------------------------------------//
	
	public static Player findByUID(String playerUID) {
		try  {
			return playerQuery()
					.where().eq("uid", playerUID)
					.findUnique();
		}
		catch (Exception e) {
			return null;
		}
	}
	
	// -----------------------------------------------------------------------------------------------//
	
	private static Query<Player> playerQuery() {
		return find
				.fetch("lotteryTickets")
				.fetch("lotteryTickets.lottery")
				.orderBy("lotteryTickets.lottery.date desc, lotteryTickets.creationDate desc");
	}
	
	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String accountUID) {
		this.uid = accountUID;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getReferrerId() {
		return referrerId;
	}

	public void setReferrerId(String referrerId) {
		this.referrerId = referrerId;
	}

	public boolean hasGivenToReferrer() {
		return giftToReferrer;
	}

	public void setGiftToReferrer(boolean giftToReferrer) {
		this.giftToReferrer = giftToReferrer;
	}

	public String getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(String birthDate) {
		this.birthDate = birthDate;
	}

	public Long getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Long creationDate) {
		this.creationDate = creationDate;
	}
	public String getFacebookId() {
		return facebookId;
	}

	public void setFacebookId(String facebookId) {
		this.facebookId = facebookId;
	}

	public List<LotteryTicket> getLotteryTickets() {
		return lotteryTickets;
	}

	public void setLotteryTickets(List<LotteryTicket> lotteryTickets) {
		this.lotteryTickets = lotteryTickets;
	}

	public List<RaffleTicket> getRaffleTickets() {
		return raffleTickets;
	}

	public void setRaffleTickets(List<RaffleTicket> raffleTickets) {
		this.raffleTickets = raffleTickets;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public int getAvailableTickets() {
		return availableTickets;
	}

	public void setAvailableTickets(int availableTickets) {
		this.availableTickets = availableTickets;
	}

	public int getCurrentPoints() {
		return currentPoints;
	}

	public void setCurrentPoints(int currentPoints) {
		this.currentPoints = currentPoints;
	}

	public int getIdlePoints() {
		return idlePoints;
	}

	public void setIdlePoints(int idlePoints) {
		this.idlePoints = idlePoints;
	}

	public int getTotalPoints() {
		return totalPoints;
	}

	public void setTotalPoints(int totalPoints) {
		this.totalPoints = totalPoints;
	}
	
	// -----------------------------------------------------------------------------------------------//


	private static final long serialVersionUID = -8425213041824976820L;
	
}
