import * as mysql from 'mysql2';

import * as tableTypes from '../table-types';
import { CrudError, StatusCode } from '../crud-error';


export async function create(pool: mysql.Pool, cart: tableTypes.CartCreate): Promise<number> {
   return new Promise<number>((resolve, reject) => {
      let sql = `
         INSERT INTO Carts(discount, subtotal, taxes, total)
         VALUES
            (?, ?, ?, ?)
      `;
      pool.execute(sql, [cart.discount, cart.subtotal, cart.taxes, cart.total], (err, results) => {
         if (err)
            return reject(err);
         
         if ((results as mysql.ResultSetHeader)?.insertId == null)
            return reject(new CrudError(StatusCode.InternalServerError, 'Could not create row.'));
         
         resolve((results as mysql.ResultSetHeader).insertId);
      });
   });
}

export async function read_byCartsID(pool: mysql.Pool, cartsID: number): Promise<tableTypes.Cart> {
   return new Promise<tableTypes.Cart>((resolve, reject) => {
      let sql = `
         SELECT * FROM Carts
         WHERE cartsID = ?
      `;
      pool.execute(sql, [cartsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.RowDataPacket).length == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function update_byCartsID(pool: mysql.Pool, cartsID: number, carts: tableTypes.CartCreate): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Carts
         SET
            discount = ?, subtotal = ?, taxes = ?, total = ?
         WHERE
            cartsID = ?
      `;
      pool.execute(sql, [carts.discount, carts.subtotal, carts.taxes, carts.total, cartsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'Could not find row to update'));
         
         resolve();
      });
   });
}

export async function delete_byCartsID(pool: mysql.Pool, cartsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM Carts
         WHERE cartsID = ?
      `;
      pool.execute(sql, [cartsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'Could not find row to delete.'));
         
         resolve();
      });
   });
}
