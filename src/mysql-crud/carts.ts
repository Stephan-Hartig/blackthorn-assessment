import * as mysql from 'mysql2';

export interface Carts {
   cartsID: number;
   discount: number;
   subtotal: number;
   taxes: number;
   total: number;
}

interface CreateCarts {
   discount: number;
   subtotal: number;
   taxes: number;
   total: number;
}

/*
 * None of the following functions have side effects aside from what is specified by the function name.
 */

export async function create(conn: mysql.Connection, carts: CreateCarts): Promise<number> {  
   return new Promise<number>((resolve, reject) => {
      let sql = `
         INSERT INTO Carts(discount, subtotal, taxes, total)
         VALUES
            (?, ?, ?, ?);
      `;
      conn.query(sql, [carts.discount, carts.subtotal, carts.taxes, carts.total], (err, results) => {
         if (err)
            reject(err);

         if ((results as mysql.ResultSetHeader)?.insertId == null)
            reject(new Error('Could not create row.'));
         
         resolve((results as mysql.ResultSetHeader).insertId);
      });
   });
}

export async function read_byId(conn: mysql.Connection, cartsID: number): Promise<Carts> {
   return new Promise<Carts>((resolve, reject) => {
      let sql = `
         SELECT * FROM Carts
         WHERE cartsID = ${mysql.escape(cartsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);

         if (results == null || (results as mysql.RowDataPacket).length == 0)
            reject(new Error('No such row.'));
         
         resolve((results as mysql.RowDataPacket)[0]);
      });
   });
}

export async function update_byCartsID(conn: mysql.Connection, cartsID: number, carts: Carts): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Carts
         SET
            discount = ?, subtotal = ?, taxes = ?, total = ?
         WHERE
            cartsID = ${mysql.escape(cartsID)};
      `;
      conn.query(sql, [carts.discount, carts.subtotal, carts.taxes, carts.total], (err, results) => {
         if (err)
            reject(err);
      
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Could not update row.'));
      
         resolve();
      });
   });
}

export async function update_discount_byCartsID(conn: mysql.Connection, cartsID: number, discount: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Carts
         SET discount = ${mysql.escape(discount)}
         WHERE cartsID = ${mysql.escape(cartsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Could not update row.'));
         
         resolve();
      });
   });
}

export async function update_taxes_byCartsID(conn: mysql.Connection, cartsID: number, taxes: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         UPDATE Carts
         SET taxes = ${mysql.escape(taxes)}
         WHERE cartsID = ${mysql.escape(cartsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Could not update row.'));
         
         resolve();
      });
   });
}

export async function delete_byCartsId(conn: mysql.Connection, cartsID: number): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      let sql = `
         DELETE FROM Carts
         WHERE cartsID = ${mysql.escape(cartsID)};
      `;
      conn.query(sql, (err, results) => {
         if (err)
            reject(err);
         
         if (results == null || (results as mysql.ResultSetHeader).affectedRows == 0)
            reject(new Error('Did not delete any row.'));
         
         resolve();
      });
   });
}

