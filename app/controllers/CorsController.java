package controllers;

import static play.mvc.Controller.request;
import static play.mvc.Controller.response;

import play.mvc.Action;
import play.mvc.Http.Context;
import play.mvc.Http.Response;
import play.mvc.Result;

public class CorsController extends Action.Simple {

    // public Result call(Http.Context ctx) throws Throwable {
    //     System.out.println("----> CorsController");
    //     Http.Response response = ctx.response();
    //     response.setHeader("Access-Control-Allow-Origin", "*");       // Need to add the correct domain in here!!
    //     response.setHeader("Access-Control-Allow-Methods", "POST");   // Only allow POST
    //     response.setHeader("Access-Control-Max-Age", "0");          // Cache response for 5 minutes
    //     response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");         // Ensure this header is also allowed!  
    //     return delegate.call(ctx);
    // }
     public Result call(Context context) throws Throwable{
        System.out.println("----> CorsController 2 ");
        Response response = context.response();
        response.setHeader("Access-Control-Allow-Origin", "*");

        //Handle preflight requests
        if(context.request().method().equals("OPTIONS")) {
            System.out.println("----> options ");
            response.setHeader("Access-Control-Allow-Methods", "POST");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");

            return ok();
        }

        response.setHeader("Access-Control-Allow-Headers","X-Requested-With");
        return delegate.call(context);
    }
    
}
