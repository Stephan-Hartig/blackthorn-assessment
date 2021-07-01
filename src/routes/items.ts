import { Express } from 'express';

import { conn } from '../mysql-connection';
import * as db from '../mysql-crud/index';

export function ItemsRoute(express: Express, path: string): Express {
   return express
      .post(path, async (req, res) => {
         try {
            res.json(await db.items.create(conn, req.body));
         }
         catch (e) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .get(path, async (req, res) => {
         try {
            if (req.query.name != null)
               res.json(await db.items.read_byName(conn, req.query.name as string));
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
      .get(path + '/:itemsID([0-9]+)', async (req, res) => {
         try {
            const itemsID = parseInt(req.params.itemsID, 10);
            res.json(await db.items.read_byId(conn, itemsID));
         }
         catch (_) {
            /* TODO Differentiate between client and server error. */
            res.status(400).send();
         }
      })
//      .patch(path + ':itemsID([0-9]+)?name=:name', async (req, res) => {
//         try {
//            const { itemsID, name } = req.params;
//            await items.update_name_byItemsID(conn, parseInt(itemsID), name);
//            res.json(await items.read_byId(conn, parseInt(itemsID)));
//         }
//         catch (_) {
//            /* TODO Differentiate between client and server error. */
//            res.status(400).send();
//         }
//      })
//      .patch(path + ':itemsID?price=:price', async (req, res) => {
//         try {
//            const { itemsID, price } = req.params;
//            await items.update_price_byItemsID(conn, parseInt(itemsID), parseInt(price));
//            res.json(await items.read_byId(conn, parseInt(itemsID)));
//         }
//         catch (_) {
//            /* TODO Differentiate between client and server error. */
//            res.status(400).send();
//         }
//      })
//      .delete(path + ':itemsID', async (req, res) => {
//         try {
//            await items.delete_byItemsId(conn, parseInt(req.params.itemsID));
//            res.json();
//         }
//         catch (_) {
//            /* TODO Differentiate between client and server error. */
//            res.status(400).send();
//         }
//      })
   ;
}

