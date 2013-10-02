package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Lottery extends Model { 

	@Id
	@Expose
	private String uid;

	@Expose
	private Long date;

	@Expose
	@OneToMany
	private List<LotteryTicket> winningNumbers;
   
	// -----------------------------------------------------------------------------------------------//
	// -- Queries

	public static Model.Finder<String, Lottery> find = new Finder<String, Lottery>(String.class, Lottery.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String accountUID) {
		this.uid = accountUID;
	}

	public List<LotteryTicket> getWinningNumbers() {
		return winningNumbers;
	}

	public void setWinningNumbers(List<LotteryTicket> winningNumbers) {
		this.winningNumbers = winningNumbers;
	}

	public Long getDate() {
		return date;
	}

	public void setDate(Long date) {
		this.date = date;
	}


	// -----------------------------------------------------------------------------------------------//

	/**
	 * 
	 */
   private static final long serialVersionUID = 1L;	
   
   
}
