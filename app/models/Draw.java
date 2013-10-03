package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Draw extends Model { 

	@Id
	@Expose
	private String uid;

	@Expose
	private Long date;
   
	@Expose
	private Integer maxPicks; 			// 5
	@Expose
	private Integer maxNumbers; 		// 35

	@Expose
	private Double ratio; 				// nbjoueurs / ratio = cagnotte

	@Expose
	@Column(columnDefinition = "TEXT")
	private String theme; 	// {"A":"urlA", "B":"urlB", ...}

	@Expose
	private String result; 				// {[34,65,2,5,65,7]}

	// -----------------------------------------------------------------------------------------------//
	// -- Queries

	public static Model.Finder<String, Draw> find = new Finder<String, Draw>(String.class, Draw.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String accountUID) {
		this.uid = accountUID;
	}

	public Integer getMaxPicks() {
		return maxPicks;
	}

	public void setMaxPicks(Integer maxPicks) {
		this.maxPicks = maxPicks;
	}

	public Integer getMaxNumbers() {
		return maxNumbers;
	}

	public void setMaxNumbers(Integer maxNumbers) {
		this.maxNumbers = maxNumbers;
	}

	public Double getRatio() {
		return ratio;
	}

	public void setRatio(Double ratio) {
		this.ratio = ratio;
	}

	public String getTheme() {
		return theme;
	}

	public void setTheme(String additionalIcons) {
		this.theme = additionalIcons;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
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
