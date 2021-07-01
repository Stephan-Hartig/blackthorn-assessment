// noinspection SqlNoDataSourceInspection

import * as mysql from 'mysql2';

export interface Items {
   itemsID: number;
   name: string;
   price: number;
}

interface ItemsCreate {
   name: string;
   price: number;
}

/*
 * None of the following functions have side effects aside from what is specified by the function name.
 */

export async function create(conn: mysql.Connection, items: ItemsCreate): Promise<number> {
   return new Promise<number>((resolve, reject) => {
      let sql = `
         INSERT INTO Items(name, price)
         VALUES
            (?, ?);
      `;
      conn.query(sql, [items.name, items.price], (err, results) => {
         if (err)
            reject(err);

         if ((results as mysql.ResultSetHeader).insertId == null)
            reject(new Error('Could not create row.'));
         
         resolve((results as mysql.ResultSetHeader).insertId);
      });
   });
}

export async function read_byId(conn: mysql.Connection, itemsID: number): Promise<Items> {
   return new Promise<Items>((resolve, reject) => {
      let sql = `
         SELECT * FROM Items
         WHERE itemsID = ${mysql.escape(itemsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);

         if ((results as mysql.RowDataPacket).length == 0)
            reject(new Error('No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function read_byName(conn: mysql.Connection, name: string): Promise<Items> {
   return new Promise<Items>((resolve, reject) => {
      let sql = `
         SELECT * FROM Items
         WHERE name = ${mysql.escape(name)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);

         if ((results as mysql.RowDataPacket).length == 0)
            reject(new Error('No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function update_name_byItemsID(conn: mysql.Connection, itemsID: number, name: string): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Items
         SET name = ${mysql.escape(name)}
         WHERE itemsID = ${mysql.escape(itemsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
         
         if ((results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Could not update row.'));
         
         resolve();
      });
   });
}

export async function update_price_byItemsID(conn: mysql.Connection, itemsID: number, price: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Items
         SET price = ${mysql.escape(price)}
         WHERE itemsID = ${mysql.escape(itemsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
         
         if ((results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Could not update row.'));
         
         resolve();
      });
   });
}


export async function delete_byItemsId(conn: mysql.Connection, itemsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM Items
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