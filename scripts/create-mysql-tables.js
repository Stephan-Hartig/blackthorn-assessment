#!/usr/bin/env node

const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');



/* Load environment vars. */

function exit(reason) {
   console.log('Error: ' + reason);
   console.log('Exiting...');
   process.exit(1);
}

const MYSQL_URL = process.env.JAWSDB_URL
   ?? exit('Env var for db url not found.');



/* Connect to the mysql server. */

let conn;

if (process.env.NODE_ENV === 'production') {
   console.log('Deployment mode detected: Will connect to ClearDB database.');
   console.log('TODO: Connect via ssl.'); // TODO

   conn = mysql.createConnection(MYSQL_URL);
}
else {
   console.log('Local mode detected: Will connect to local database.');

   const MYSQL_USER = process.env.JAWSDB_USER
      ?? exit('Env var for db user not found.');
   const MYSQL_PASSWORD = process.env.JAWSDB_PASSWORD
      ?? exit('Env var for db password not found.');
   const MYSQL_DATABASE = process.env.JAWSDB_DATABASE
      ?? exit('Env var for db database not found.');

   conn = mysql.createConnection({
      host:       MYSQL_URL,
      user:       MYSQL_USER,
      password:   MYSQL_PASSWORD,
      database:   MYSQL_DATABASE
   });
}



/* Create tables. */

function createTable(file) {
   let sql = fs.readFileSync(path.resolve(__dirname, '../docs/sql/', file), 'utf-8');
   console.log(sql);
   conn.query(sql, (err, res) => {
      if (err)
         console.log('Error creating table: ' + err.stack);
      else
         console.log(`Successfully created table ${file}.`);
   });
}

// Creation order matters.
['Items.sql', 'Carts.sql', 'CartItems.sql'].forEach(createTable);



