import play.*;
import play.mvc.*;
import play.libs.F.Promise;

public class Global extends GlobalSettings {

  @Override
  public Result onHandlerNotFound(RequestHeader request) {
    return controllers.Application.home();
  }  

  private class ActionWrapper extends Action.Simple {
    public ActionWrapper(Action<?> action) {
      this.delegate = action;
    }

    @Override
    public Promise<Result> call(Http.Context ctx) throws java.lang.Throwable {
      Promise<Result> result = this.delegate.call(ctx);
      Http.Response response = ctx.response();
      response.setHeader("Access-Control-Allow-Origin", "*");       // Need to add the correct domain in here!!
      response.setHeader("Access-Control-Allow-Methods", "POST");   // Only allow POST
      response.setHeader("Access-Control-Max-Age", "300");          // Cache response for 5 minutes
      response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");         // Ensure this header is also allowed!  
      return result;
    }
  }

  @Override
  public Action<?> onRequest(Http.Request request, java.lang.reflect.Method actionMethod) {
    return new ActionWrapper(super.onRequest(request, actionMethod));
  }

}