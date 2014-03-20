package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Global extends Model { 

    // -----------------------------------------------------------------------------------------------//

    @Id
    @Expose
    private String id;

    // -----------------------------------------------------------------------------------------------//

    @Expose
    @Column(columnDefinition = "TEXT")
    private String tweet;

    @Expose
    @Column(columnDefinition = "TEXT")
    private String tweetTheme;

    // -----------------------------------------------------------------------------------------------//
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String fbPost;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String fbSharePrize;

    // -----------------------------------------------------------------------------------------------//

    @Expose
    @Column(columnDefinition = "TEXT")
    private String banners;

    // -----------------------------------------------------------------------------------------------//

    @Expose
    @Column(columnDefinition = "TEXT")
    private String sms;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String email;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String text48h;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    private String text3min;
    
    // -----------------------------------------------------------------------------------------------//
    
    @Expose
    @Column(columnDefinition = "TEXT")
    public String appStatus;
    
    @Expose
    @Column(columnDefinition = "TEXT")
    public String minMoney;

    // -----------------------------------------------------------------------------------------------//
    
    @Expose
    public Double versionRequired;

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

    public String getBanners() {
        return banners;
    }

    public void setBanners(String banners) {
        this.banners = banners;
    }

    public Double getVersionRequired() {
        return versionRequired;
    }

    public void setVersionRequired(Double versionRequired) {
        this.versionRequired = versionRequired;
    }

    public String getAppStatus() {
        return appStatus;
    }

    public void setAppStatus(String appStatus) {
        this.appStatus = appStatus;
    }

    public String getFbSharePrize() {
        return fbSharePrize;
    }

    public void setFbSharePrize(String fbSharePrize) {
        this.fbSharePrize = fbSharePrize;
    }

    public String getSms() {
        return sms;
    }

    public void setSms(String sms) {
        this.sms = sms;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getText48h() {
        return text48h;
    }

    public void setText48h(String text48h) {
        this.text48h = text48h;
    }

    public String getMinMoney() {
        return minMoney;
    }

    public void setMinMoney(String minMoney) {
        this.minMoney = minMoney;
    }

    public String getText3min() {
        return text3min;
    }

    public void setText3min(String text3min) {
        this.text3min = text3min;
    }

    public Long getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Long lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    // -----------------------------------------------------------------------------------------------//

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

}
