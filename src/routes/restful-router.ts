import { Express, RequestHandler } from 'express';
import { CrudError, getMysqlStatus } from '../mysql/crud-error';


type routeLogic = (params?: any, body?: any) => Promise<any>;

export class RestfulRouter {
   
   constructor(private _app: Express) { }
   static build(app: Express): RestfulRouter { return new RestfulRouter(app); }
   
   private wrapWithRequestHandler(fn: routeLogic): RequestHandler {
      return async (req, res) => {
         try {
            res.json(await fn(req.params, req.body));
         } catch (e) {
            if (e instanceof CrudError) {
               res.status(e.getStatus()).send(e.message);
            } else {
               let status = getMysqlStatus(e.code) ?? 400;
               res.status(status).send(e.message);
            }
         }
      };
   }
   
   public post(path: string, fn: routeLogic): RestfulRouter {
      this._app.post(path, this.wrapWithRequestHandler(fn));
      return this;
   }
   
   public get(path: string, fn: routeLogic): RestfulRouter {
      this._app.get(path, this.wrapWithRequestHandler(fn));
      return this;
   }
   
   public put(path: string, fn: routeLogic): RestfulRouter {
      this._app.put(path, this.wrapWithRequestHandler(fn));
      return this;
   }
   
   public patch(path: string, fn: routeLogic): RestfulRouter {
      this._app.patch(path, this.wrapWithRequestHandler(fn));
      return this;
   }
   
   public delete(path: string, fn: routeLogic): RestfulRouter {
      this._app.delete(path, this.wrapWithRequestHandler(fn));
      return this;
   }
}
