import * as mysql from 'mysql2';

import * as tableTypes from '../table-types';
import { CrudError, StatusCode } from '../crud-error';


export async function create(pool: mysql.Pool, item: tableTypes.ItemCreate): Promise<number> {
   return new Promise<number>((resolve, reject) => {
      let sql = `
         INSERT INTO Items(name, price)
         VALUES
            (?, ?)
      `;
      pool.execute(sql, [item.name, item.price], (err, results) => {
         if (err)
            return reject(err);
         
         if ((results as mysql.ResultSetHeader)?.insertId == null)
            return reject(new CrudError(StatusCode.InternalServerError, 'Could not create row.'));
         
         resolve((results as mysql.ResultSetHeader).insertId);
      });
   });
}

export async function read_byItemsID(pool: mysql.Pool, itemsID: number): Promise<tableTypes.Item> {
   return new Promise<tableTypes.Item>((resolve, reject) => {
      let sql = `
         SELECT * FROM Items
         WHERE itemsID = ?
      `;
      pool.execute(sql, [itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.RowDataPacket)?.length == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function read_byName(pool: mysql.Pool, name: string): Promise<tableTypes.Item> {
   return new Promise<tableTypes.Item>((resolve, reject) => {
      let sql = `
         SELECT * FROM Items
         WHERE name = ?
      `;
      pool.execute(sql, [name], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.RowDataPacket).length == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function read_many_byPartialName(pool: mysql.Pool, name: string): Promise<tableTypes.Item[]> {
   return new Promise<tableTypes.Item[]>((resolve, reject) => {
      let sql = `
         SELECT * FROM Items
         WHERE (lower(name) LIKE ?)
      `;
      pool.execute(sql, [name.toLowerCase() + '%'], (err, results) => {
         if (err)
            return reject(err);
   
         if (results == null || (results as mysql.RowDataPacket).length == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such rows.'));
   
         resolve(results as tableTypes.Item[]);
      });
   });
}

export async function read_all(pool: mysql.Pool): Promise<tableTypes.Item[]> {
   return new Promise<tableTypes.Item[]>((resolve, reject) => {
      let sql = `
         SELECT * FROM Items
      `;
      pool.execute(sql, (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.RowDataPacket).length == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such rows.'));
         
         resolve(results as tableTypes.Item[]);
      });
   });
}

export async function update_name_byItemsID(pool: mysql.Pool, itemsID: number, name: string): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Items
         SET name = ?
         WHERE itemsID = ?
      `;
      pool.execute(sql, [name, itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
   
         resolve();
      });
   });
}

export async function update_price_byItemsID(pool: mysql.Pool, itemsID: number, price: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Items
         SET price = ?
         WHERE itemsID = ?
      `;
      pool.execute(sql, [price, itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
   
         return resolve();
      });
   });
}

export async function delete_byItemsID(pool: mysql.Pool, itemsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM Items
         WHERE itemsID = ?
      `;
      pool.execute(sql, [itemsID], (err, results) => {
         if (err)
            return reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            return reject(new CrudError(StatusCode.NotFound, 'No such row.'));
   
         resolve();
      });
   });
}
