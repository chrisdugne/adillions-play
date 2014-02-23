package utils;


public class Twitter {


    public static void getRequestToken()
    {
        System.out.println("signinWithTwitter : signinWithTwitter");
    
        String response = HttpHelper.get("https://platform.twitter.com/widgets/follow_button.1383343979.html#_=1383766340212&id=twitterFollowButton&lang=en&screen_name=adillions&show_count=true&show_screen_name=true&size=m&original_redirect_referrer=");
        System.out.println(response);
        
    }
}
