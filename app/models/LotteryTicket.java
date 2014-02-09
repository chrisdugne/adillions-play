package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class LotteryTicket extends Model { 

	// -----------------------------------------------------------------------------------------------//

   public static final int unseen 	= 0; // set as winning ticket, before notification
	public static final int blocked  = 1; // set as winning ticket, notification/popup read, cashout blocked (<10)
	public static final int pending 	= 2; // cashout requested
	public static final int payed 	= 3; // to set manually when paiement is done
	public static final int gift 		= 4; // gift to charity

	public static final int bonus1 	= 11; // rang 7
	public static final int bonus2 	= 12; // rang 8
	public static final int bonus3 	= 13; // rang 9
	public static final int bonus4 	= 14; // rang 10
	
	public static final int validatedBonus1 	= 111; // rang 7 converted
	public static final int validatedBonus2 	= 112; // rang 8 converted
	public static final int validatedBonus3 	= 113; // rang 9 converted
	public static final int validatedBonus4 	= 114; // rang 10 converted

	// -----------------------------------------------------------------------------------------------//

	public static final int CLASSIC_TICKET 		= 1;
	public static final int INSTANT_TICKET 		= 2;

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

	@Expose
	private Integer type;

   @Expose
   @Column(columnDefinition = "TEXT")
   private String bonus;            // {"stock":"x",instant:"x","maxTime":"lastLottery.date"}

	@Expose
	private Long creationDate;
	
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
	
	public Lottery getLottery() {
		return lottery;
	}

	public void setLottery(Lottery lottery) {
		this.lottery = lottery;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getBonus() {
      return bonus;
   }

   public void setBonus(String bonus) {
      this.bonus = bonus;
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

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
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
