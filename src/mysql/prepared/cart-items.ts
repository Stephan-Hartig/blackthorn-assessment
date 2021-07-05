import * as mysql from 'mysql2';

import * as tableTypes from '../table-types';
import { CrudError, StatusCode } from '../crud-error';


export async function create(pool: mysql.Pool, cartItems: tableTypes.CartItemCreate): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         INSERT INTO CartItems(cartsID, itemsID)
         VALUES
            (?, ?)
      `;
      pool.execute(sql, [cartItems.cartsID, cartItems.itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if ((results as mysql.ResultSetHeader)?.insertId == null)
            return reject(new CrudError(StatusCode.InternalServerError, 'Could not create row.'));
         
         resolve();
      });
   });
}

export async function read_byIDs_joinItems(pool: mysql.Pool, cartsID: number, itemsID: number): Promise<tableTypes.Item> {
   return new Promise<tableTypes.Item>((resolve, reject) => {
      let sql = `
         SELECT Items.*
         FROM CartItems INNER JOIN Items
         WHERE CartItems.cartsID = ?
            AND Items.itemsID = ?
            AND CartItems.itemsID = Items.itemsID
      `;
      pool.execute(sql, [cartsID, itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.RowDataPacket).length == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function read_many_byCartsID_joinItems(pool: mysql.Pool, cartsID: number): Promise<tableTypes.Item[]> {
   return new Promise<tableTypes.Item[]>((resolve, reject) => {
      let sql = `
         SELECT Items.* FROM CartItems INNER JOIN Items
         WHERE CartItems.cartsID = ?
            AND CartItems.itemsID = Items.itemsID
      `;
      pool.execute(sql, [cartsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null)
            return reject(new CrudError(StatusCode.NotFound, 'No such rows.'));
         
         resolve(results as tableTypes.Item[]);
      });
   });
}

export async function delete_many_byCartsID(pool: mysql.Pool, cartsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM CartItems
         WHERE cartsID = ?
      `;
      pool.execute(sql, [cartsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such rows.'));
         
         resolve();
      });
   });
}

export async function delete_byIDs(pool: mysql.Pool, cartsID: number, itemsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM CartItems
         WHERE cartsID = ?
            AND itemsID = ?
      `;
      pool.execute(sql, [cartsID, itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
         
         resolve();
      });
   });
}
