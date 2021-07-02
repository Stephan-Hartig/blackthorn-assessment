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
   ;
}

