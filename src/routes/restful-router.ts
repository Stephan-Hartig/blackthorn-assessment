import { Express, RequestHandler } from 'express';
import { CrudError, getMysqlStatus } from '../mysql/crud-error';

import { cache } from '../globals/index';


type RouteLogic = (params?: any, body?: any) => Promise<any>;

interface RouteOptions {
   route: string;
   logic: RouteLogic;
   deleteCache?: boolean | string[] | ((param: any) => string[]); /* true defaults to URI */
   getCache?: boolean | string | ((param: any) => string); /* true defaults to URI */
   cacheExpires?: number;
}

const EXPIRES_DEFAULT = 60; /* Zero is indefinite, everything else is in seconds. */

export class RestfulRouter {
   
   constructor(private _app: Express) { }
   static build(app: Express): RestfulRouter { return new RestfulRouter(app); }
   
   private wrapWithRequestHandler(fn: RouteLogic, options: RouteOptions): RequestHandler {
      return async (req, res) => {
         try {
            let value: any;
            
            
            if (options.getCache) { /* Just don't let the URL be a valid js falsy value. */
               const url =
                  (typeof options.getCache === 'string') ? options.getCache :
                  (typeof options.getCache === 'function') ? options.getCache(req.params) :
                  req.url;
               
               try {
                  value = JSON.parse((await cache.get(url)).value.toString('utf-8'));
               } catch (_) {
                  value = await fn(req.params, req.body);
                  
                  try { await cache.set(url, JSON.stringify(value), { expires: options.cacheExpires ?? EXPIRES_DEFAULT }); } catch (_) { }
               }
            } else {
               value = await fn(req.params, req.body);
            }
            
            
            if (options.deleteCache) { /* Just don't let the URL be a valid js falsy value. */
               const urls =
                  (Array.isArray(options.getCache)) ? options.deleteCache as string[] :
                  (typeof options.deleteCache === 'function') ? options.deleteCache(req.params) :
                  [req.url];
               
               for (let url of urls)
                  try { await cache.delete(url) } catch (_) { console.log('did not delete =(') }
            }
            
            
            res.json(value);
            return;
            
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
   
   
   public post(options: RouteOptions): RestfulRouter {
      this._app.post(options.route, this.wrapWithRequestHandler(options.logic, options));
      return this;
   }
   
   public get(options: RouteOptions): RestfulRouter {
      this._app.get(options.route, this.wrapWithRequestHandler(options.logic, options));
      return this;
   }
   
   public put(options: RouteOptions): RestfulRouter {
      this._app.put(options.route, this.wrapWithRequestHandler(options.logic, options));
      return this;
   }
   
   public patch(options: RouteOptions): RestfulRouter {
      this._app.patch(options.route, this.wrapWithRequestHandler(options.logic, options));
      return this;
   }
   
   public delete(options: RouteOptions): RestfulRouter {
      this._app.delete(options.route, this.wrapWithRequestHandler(options.logic, options));
      return this;
   }
}
