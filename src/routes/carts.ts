import { Express } from 'express';

import { conn } from '../mysql-connection';
import * as db from '../mysql-crud/index';

export interface APICarts extends db.carts.Carts {
   items?: db.items.Items[];
}


/*
 * NOTE: Some of the following private functions have side effects on the variable passed to it.
 *       If in doubt: `obj = _func(obj)`
 */
async function _varAppendCartItems(carts: APICarts) {
   carts.items = await db.cartItems.read_multByCartsId_joinItems(conn, carts.cartsID);
   return carts;
}
async function _cartsAddItems(cartsID: number, itemsIDs: number[]) {
   for (let itemsID of itemsIDs)
      await db.cartItems.create(conn, { cartsID, itemsID });
}
async function _cartsRemoveItems(cartsID: number, itemsIDs: number[]) {
   for (let itemsID of itemsIDs)
      await db.cartItems.delete_byIds(conn, { cartsID, itemsID });
}
async function _cartsUpdate(cartsID: number, carts?: db.carts.Carts) {
   carts = carts ?? await db.carts.read_byId(conn, cartsID);
   
   /* Calculate new subtotal. */
   const items = await db.cartItems.read_multByCartsId_joinItems(conn, cartsID);
   
   let subtotal = 0;
   for (let item of items) { subtotal += item.price; }
   
   /* Update Carts. */
   carts.subtotal = subtotal;
   carts.total = carts.subtotal + carts.taxes - carts.discount;
   await db.carts.update_byCartsID(conn, cartsID, carts);
   
   return carts;
}





export function CartsRoute(express: Express, path: string): Express {
   return express
      .post(path, async (req, res) => {
         try {
            let cartsParams: db.carts.Carts = Object.assign({
               discount: 0,
               taxes: 0,
            }, req.body);
            const cartsID = await db.carts.create(conn, cartsParams);
   
            await _cartsAddItems(cartsID, req.body.items ?? []);
            await _cartsUpdate(cartsID, cartsParams);
   
            res.json(cartsID);
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .get(path + '/:cartsID([0-9]+)', async (req, res) => {
         try {
            const cartsID = parseInt(req.params.cartsID);

            let carts: APICarts = await db.carts.read_byId(conn, cartsID);
            res.json(await _varAppendCartItems(carts));
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .patch(path + '/:cartsID([0-9]+)', async (req, res) => {
         try {
            let cartsParams: db.carts.Carts = Object.assign({
               discount: 0,
               taxes: 0,
            }, req.body);
            const cartsID = parseInt(req.params.cartsID);
            
            await db.carts.update_byCartsID(conn, cartsID, cartsParams);
            const carts = await _cartsUpdate(cartsID);
            res.json(await _varAppendCartItems(carts));
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .delete(path + '/:cartsID([0-9]+)', async (req, res) => {
         try {
            const cartsID = parseInt(req.params.cartsID);
      
            await db.carts.delete_byCartsId(conn, cartsID);
            await db.cartItems.delete_byCartsId(conn, cartsID);
      
            res.json();
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .put(path + '/:cartsID([0-9]+)/items', async (req, res) => {
         try {
            const cartsID = parseInt(req.params.cartsID);
         
            await _cartsAddItems(cartsID, req.body);
            const carts = await _cartsUpdate(cartsID);
            res.json(await _varAppendCartItems(carts));
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .delete(path + ':cartsID/items/:itemsID', async (req, res) => {
         try {
            const cartsID = parseInt(req.params.cartsID);
            const itemsID = parseInt(req.params.itemsID);
            
            await db.cartItems.delete_byIds(conn, { cartsID, itemsID });
            await _cartsUpdate(cartsID);
            
            res.json();
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
   ;
}

