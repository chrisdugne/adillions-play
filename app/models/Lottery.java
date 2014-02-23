package models;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.persistence.Version;

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
    private Integer maxPicks;             // 5
    @Expose
    private Integer maxNumbers;         // 49

    @Expose
    private Integer nbPlayers;

    @Expose
    private Integer toolPlayers;         // seuil pour afficher les players

    
    @Expose
    private Integer minPrice;              
    @Expose
    private Integer maxPrice;             // lottery.price = min ( max (lottery.minPrice, nbPlayers/ratio) , lottery.maxPrice)
    @Expose
    private Double cpm;                     // nbTickets/1000 * cpm = price
    @Expose
    private Double charity;             // 

    @Expose
    @Column(columnDefinition = "TEXT")
    private String theme;                 // ["urlA","urlB",...]

    @Expose
    @Column(columnDefinition = "TEXT")
    private String rangs;                 // {"matches":[],"percents":[]}

    @Expose
    private String result;                 // [34,65,2,5,65,7]
    @Expose
    private Double finalPrice;         // 
    @Expose
    private String prizes;                 // [{"winners" : "2", "share" : "3.45"},{"winners" : "0", "share" : "0"},...]

    @Expose
    private Float rateUSDtoEUR;         // 1.34

    @Expose
    private int ticketTimer;         // min

    // -----------------------------------------------------------------------------------------------//

    @Transient
    @Expose
    private Integer nbTickets;

    @Transient
    @Expose
    private Integer nbWinners;
    
    // -----------------------------------------------------------------------------------------------//
    
    @Version
   public Timestamp lastUpdate;

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

    public Integer getMaxPicks() {
        return maxPicks;
    }

    public void setMaxPicks(Integer maxPicks) {
        this.maxPicks = maxPicks;
    }

    public Integer getNbPlayers() {
        return nbPlayers;
    }

    public void setNbPlayers(Integer nbPlayers) {
        this.nbPlayers = nbPlayers;
    }

    public Integer getNbTickets() {
        return nbTickets;
    }

    public Integer getNbWinners() {
        return nbWinners;
    }

    public void setNbWinners(Integer nbWinners) {
        this.nbWinners = nbWinners;
    }

    public void setNbTickets(Integer nbTickets) {
        this.nbTickets = nbTickets;
    }

    public Integer getMaxNumbers() {
        return maxNumbers;
    }

    public void setMaxNumbers(Integer maxNumbers) {
        this.maxNumbers = maxNumbers;
    }

    public Integer getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Integer minPrice) {
        this.minPrice = minPrice;
    }

    public Double getCpm() {
        return cpm;
    }

    public void setCpm(Double cpm) {
        this.cpm = cpm;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String additionalIcons) {
        this.theme = additionalIcons;
    }

    public String getRangs() {
      return rangs;
   }

   public void setRangs(String rangs) {
      this.rangs = rangs;
   }

   public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Double getCharity() {
        return charity;
    }

    public void setCharity(Double charity) {
        this.charity = charity;
    }

    public Integer getToolPlayers() {
        return toolPlayers;
    }

    public void setToolPlayers(Integer toolPlayers) {
        this.toolPlayers = toolPlayers;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Integer getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Integer maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    public int getTicketTimer() {
        return ticketTimer;
    }

    public void setTicketTimer(int ticketTimer) {
        this.ticketTimer = ticketTimer;
    }

    public Float getRateUSDtoEUR() {
        return rateUSDtoEUR;
    }

    public void setRateUSDtoEUR(Float rateUSDtoEUR) {
        this.rateUSDtoEUR = rateUSDtoEUR;
    }

    // -----------------------------------------------------------------------------------------------//

    /**
     * 
     */
   private static final long serialVersionUID = 1L;

}
