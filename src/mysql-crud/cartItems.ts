import * as mysql from 'mysql2';

import { Items } from './items';

export interface CartItems {
   cartsID: number;
   itemsID: number;
}

/*
 * None of the following functions have side effects aside from what is specified by the function name.
 */

export async function create(conn: mysql.Connection, cartItems: CartItems): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         INSERT INTO CartItems(cartsID, itemsID)
         VALUES
            (?, ?);
      `;
      conn.query(sql, [cartItems.cartsID, cartItems.itemsID], (err, results) => {
         if (err)
            reject(err);
   
         if ((results as mysql.ResultSetHeader).insertId == null)
            reject(new Error('Could not create row.'));
         
         resolve();
      });
   });
}

export async function read_byIds_joinItems(conn: mysql.Connection, cartItems: CartItems): Promise<Items> {
   return new Promise<Items>((resolve, reject) => {
      let sql = `
         SELECT Items.* FROM CartItems INNER JOIN Items
         WHERE CartItems.cartsID = ${mysql.escape(cartItems.cartsID)}
            AND Items.itemsID = ${mysql.escape(cartItems.itemsID)};
            AND CartItems.itemsID = Items.itemsID;
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);

         if ((results as mysql.RowDataPacket).length > 0)
            resolve((results as mysql.RowDataPacket)[0]);
         else
            reject(new Error('No such row.'));
      });
   });
}

export async function read_multByCartsId_joinItems(conn: mysql.Connection, cartsID: number): Promise<Items[]> {
   return new Promise<Items[]>((resolve, reject) => {
      let sql = `
         SELECT Items.* FROM CartItems INNER JOIN Items
         WHERE CartItems.cartsID = ${mysql.escape(cartsID)}
            AND CartItems.itemsID = Items.itemsID;
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);

         resolve(results as Items[]);
      });
   });
}

export async function delete_byCartsId(conn: mysql.Connection, cartsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM CartItems
         WHERE cartsID = ${mysql.escape(cartsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
   
         if ((results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Did not delete any row.'));
   
         resolve();
      });
   });
}

export async function delete_byItemsId(conn: mysql.Connection, itemsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM CartItems
         WHERE itemsID = ${mysql.escape(itemsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
   
         if ((results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Did not delete any row.'));
   
         resolve();
      });
   });
}

export async function delete_byIds(conn: mysql.Connection, cartItems: CartItems): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM CartItems
         WHERE cartsID = ${mysql.escape(cartItems.cartsID)}
            AND itemsID = ${mysql.escape(cartItems.itemsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
         
         if ((results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Did not delete any row.'));
         
         resolve();
      });
   });
}
