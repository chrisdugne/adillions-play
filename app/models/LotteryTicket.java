package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class LotteryTicket extends Model { 

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;

	@Expose
	private String number;

	@ManyToOne
	@Expose
	private Lottery lottery;
	
	// -----------------------------------------------------------------------------------------------//
	
	@ManyToOne
	private Player player;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries

	public static Model.Finder<String, LotteryTicket> find = new Finder<String, LotteryTicket>(String.class, LotteryTicket.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String accountUID) {
		this.uid = accountUID;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public Lottery getLottery() {
		return lottery;
	}

	public void setLottery(Lottery lottery) {
		this.lottery = lottery;
	}

	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}


	// -----------------------------------------------------------------------------------------------//

	/**
	 * 
	 */
   private static final long serialVersionUID = 1L;	
   
	// -----------------------------------------------------------------------------------------------//
}
