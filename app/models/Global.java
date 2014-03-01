package models;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Version;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Global extends Model { 

    @Id
    @Expose
    private String id;

    @Expose
    @Column(columnDefinition = "TEXT")
    private String tweet;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String tweetTheme;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String fbPost;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String subheader;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String confirmation;

    // -----------------------------------------------------------------------------------------------//
    
    @Expose
    public Long lastUpdate;

    // -----------------------------------------------------------------------------------------------//
    // -- Queries

    public static Model.Finder<String, Global> find = new Finder<String, Global>(String.class, Global.class);

   // -----------------------------------------------------------------------------------------------//
   
   public static Global current() {
      try  {
         return find
               .where().eq("id", "current")
               .findUnique();
      }
      catch (Exception e) {
         return null;
      }
   }
   
    // -----------------------------------------------------------------------------------------------//

   public String getId() {
      return id;
   }

   public void setId(String id) {
      this.id = id;
   }

   public String getTweet() {
      return tweet;
   }

   public void setTweet(String tweet) {
      this.tweet = tweet;
   }

   public String getTweetTheme() {
      return tweetTheme;
   }

   public void setTweetTheme(String tweetTheme) {
      this.tweetTheme = tweetTheme;
   }

   public String getFbPost() {
      return fbPost;
   }

   public void setFbPost(String fbPost) {
      this.fbPost = fbPost;
   }

   public String getSubheader() {
       return subheader;
   }

   public void setSubheader(String subheader) {
       this.subheader = subheader;
   }

   public Long getLastUpdate() {
       return lastUpdate;
   }

   public void setLastUpdate(Long lastUpdate) {
       this.lastUpdate = lastUpdate;
   }

   public String getConfirmation() {
       return confirmation;
   }

   public void setConfirmation(String confirmation) {
       this.confirmation = confirmation;
   }

   // -----------------------------------------------------------------------------------------------//

   /**
    * 
    */
   private static final long serialVersionUID = 1L;

}
