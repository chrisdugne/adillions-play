package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class LotteryTicket extends Model { 

	// -----------------------------------------------------------------------------------------------//

	public static final int blocked 	= 1;
	public static final int pending 	= 2;
	public static final int payed 	= 3;

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;

	@Expose
	private String numbers; // [12,34,45,6,33,31]

	@ManyToOne
	@Expose
	private Lottery lottery;

	@Expose
	private Double price;

	@Expose
	private Integer status;
	
	// -----------------------------------------------------------------------------------------------//
	
	@ManyToOne
	private Player player;

	// -----------------------------------------------------------------------------------------------//
	
	private Long creationDate;
	
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
	
	public Lottery getLottery() {
		return lottery;
	}

	public void setLottery(Lottery lottery) {
		this.lottery = lottery;
	}

	public String getNumbers() {
		return numbers;
	}

	public void setNumbers(String numbers) {
		this.numbers = numbers;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Long getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Long creationDate) {
		this.creationDate = creationDate;
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
