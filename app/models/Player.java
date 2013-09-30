package models;

import java.util.List;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Player extends Model { 

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;

   
	@Expose
	private String email;
	@Expose
	private String firstName;
	@Expose
	private String lastName;
	
	@Expose
	private String referrerId;

	@Expose
	private String birthDate;
	
	@Expose
	private int points;
	
	@Expose 
	private List<String> awayPoints; // utilise pour les messages "points de parrainage" par exemple
	

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
          return find.where().eq("authToken", authToken).findUnique();
      }
      catch (Exception e) {
          return null;
      }
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
	
	// -----------------------------------------------------------------------------------------------//


	private static final long serialVersionUID = -8425213041824976820L;
	
}
