import { Express, default as express } from 'express';
import { default as cors } from 'cors';

import { RestfulRouter } from './restful-router';
import * as crud from '../mysql/crud';
import { pool } from '../bootstrap/mysql-connection';

export function init(): Express {
   let app: Express = express()
      .use(cors())
      .use(express.json())
      .get('/', (_, res) => { res.send("Use '/api/...' to access the API.") })
   ;
   
   RestfulRouter.build(app)
      
      /* Items */
      .post('/api/items',
         (params, body) => crud.itemsCreate(pool, body))
      .get('/api/items/:itemsID([0-9]+)',
         (params) => crud.itemsRead(pool, params.itemsID))
      .get('/api/items/:name',
         (params) => crud.itemsRead(pool, params.name))
   
      /* Shopping cart. */
      .post('/api/carts',
         (params, body) => crud.cartsCreate(pool, body))
      .get('/api/carts/:cartsID([0-9]+)',
         (params) => crud.cartsRead(pool, params.cartsID))
      .patch('/api/carts/:cartsID([0-9]+)',
         (params, body) => crud.cartsUpdate(pool, params.cartsID, body))
      .delete('/api/carts/:cartsID([0-9]+)',
         (params) => crud.cartsDelete(pool, params.cartsID))
      
      /* Shopping cart items. */
      .get('/api/carts/:cartsID([0-9]+)/items',
         (params) => crud.carts_itemsRead(pool, params.cartsID))
      .post('/api/carts/:cartsID([0-9]+)/items/:itemsID([0-9]+)',
         (params) => crud.carts_itemsCreate(pool, params.cartsID, params.itemsID))
      .get('/api/carts/:cartsID([0-9]+)/items/:itemsID([0-9]+)',
         (params) => crud.carts_itemsRead(pool, params.cartsID, params.itemsID))
      .delete('/api/carts/:cartsID([0-9]+)/items/:itemsID([0-9]+)',
         (params) => crud.carts_itemsDelete(pool, params.cartsID, params.itemsID))
   ;

   return app;
}
