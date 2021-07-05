import { Express, default as express } from 'express';
import { default as cors } from 'cors';

import { RestfulRouter } from './restful-router';
import * as crud from '../mysql/crud';
import { pool } from '../globals/mysql-connection';

export function init(): Express {
   let app: Express = express()
      .use(cors())
      .use(express.json())
      .get('/', (_, res) => { res.send("Use '/api/...' to access the API.") })
   ;
   
   RestfulRouter.build(app)
      
      /***** Items *****/
      .post({
         route: '/api/items',
         logic: (params, body) => crud.itemsCreate(pool, body),
         deleteCache: true
      })
      .get({
         route: '/api/items/:itemsID([0-9]+)',
         logic: (params) => crud.itemsRead(pool, params.itemsID),
         getCache: true
      })
      .get({
         route: '/api/items/:name',
         logic: (params) => crud.itemsRead(pool, params.name),
         getCache: true
      })
      
      
   
      
      /***** Shopping cart. *****/
      .post({
         route: '/api/carts',
         logic: (params, body) => crud.cartsCreate(pool, body)
      })
      .get({
         route: '/api/carts/:cartsID([0-9]+)',
         logic: (params) => crud.cartsRead(pool, params.cartsID),
         getCache: true
      })
      .patch({
         route: '/api/carts/:cartsID([0-9]+)',
         logic: (params, body) => crud.cartsUpdate(pool, params.cartsID, body),
         deleteCache: true
      })
      .delete({
         route: '/api/carts/:cartsID([0-9]+)',
         logic: (params) => crud.cartsDelete(pool, params.cartsID),
         deleteCache: true
      })
      
      
      
   
      /***** Shopping cart items. *****/
      .get({
         route: '/api/carts/:cartsID([0-9]+)/items',
         logic: (params) => crud.carts_itemsRead(pool, params.cartsID),
         getCache: true
      })
      .post({
         route: '/api/carts/:cartsID([0-9]+)/items/:itemsID([0-9]+)',
         logic: (params) => crud.carts_itemsCreate(pool, params.cartsID, params.itemsID),
         deleteCache: params => [`/api/carts/${params.cartsID}/items`]
      })
      .get({
         route: '/api/carts/:cartsID([0-9]+)/items/:itemsID([0-9]+)',
         logic: (params) => crud.carts_itemsRead(pool, params.cartsID, params.itemsID),
         getCache: true
      })
      .delete({
         route: '/api/carts/:cartsID([0-9]+)/items/:itemsID([0-9]+)',
         logic: (params) => crud.carts_itemsDelete(pool, params.cartsID, params.itemsID),
         deleteCache: params => [`/api/carts/${params.cartsID}`, `/api/carts/${params.cartsID}/items`]
      })
   ;

   return app;
}
