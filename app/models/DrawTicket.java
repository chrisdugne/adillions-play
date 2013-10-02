package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class DrawTicket extends Model { 

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;

	@Expose
	private String numbers; // {[12,34,45,6,33,31]}

	@ManyToOne
	@Expose
	private Draw draw;
	
	// -----------------------------------------------------------------------------------------------//
	
	@ManyToOne
	private Player player;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries

	public static Model.Finder<String, DrawTicket> find = new Finder<String, DrawTicket>(String.class, DrawTicket.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String accountUID) {
		this.uid = accountUID;
	}
	
	public Draw getDraw() {
		return draw;
	}

	public void setDraw(Draw draw) {
		this.draw = draw;
	}

	public String getNumbers() {
		return numbers;
	}

	public void setNumbers(String numbers) {
		this.numbers = numbers;
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
