package controllers;

import java.util.Map;

import play.mvc.Result;

import views.html.objectpages.theme;

public class OpenGraph extends Application
{

    // ---------------------------------------------//

    /**
     * Facebook dynamic Object Page pour Theme
     */
    public static Result theme()
    {

        Map<String, String[]> queryParameters = request().queryString();

        String uid           = null;
        String title         = null;
        String description   = null;
        String imageURL      = null;
        String objectPageURL = null;
        String locale        = null;

        try
        {
            uid           = queryParameters.get("uid")[0];
            description   = queryParameters.get("description")[0];
            title         = queryParameters.get("title")[0];
            imageURL      = queryParameters.get("imageURL")[0];
            locale        = queryParameters.get("locale")[0];
            objectPageURL = APP_HOSTNAME + request().uri();
        }
        catch (Exception e)
        {
            if (description == null)
                description = "";
            if (title == null)
                title = "";
        }

        return ok(theme.render(
                FACEBOOK_APP_NAMESPACE,
                FACEBOOK_APP_ID,
                uid,
                title,
                description,
                imageURL,
                objectPageURL,
                locale));
    }

    // ---------------------------------------------//
}