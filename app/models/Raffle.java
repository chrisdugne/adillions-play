package models;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Version;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Raffle extends Model { 

    @Id
    @Expose
    private String uid;

    @Expose
    private Long date;

    @Expose
    @OneToMany
    private List<RaffleTicket> winningNumbers;

    // -----------------------------------------------------------------------------------------------//
    
    @Version
   public Timestamp lastUpdate;
    
    // -----------------------------------------------------------------------------------------------//
    // -- Queries

    public static Model.Finder<String, Raffle> find = new Finder<String, Raffle>(String.class, Raffle.class);

    // -----------------------------------------------------------------------------------------------//
    
    public String getUid() {
        return uid;
    }

    public void setUid(String accountUID) {
        this.uid = accountUID;
    }

    public List<RaffleTicket> getWinningNumbers() {
        return winningNumbers;
    }

    public void setWinningNumbers(List<RaffleTicket> winningNumbers) {
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
