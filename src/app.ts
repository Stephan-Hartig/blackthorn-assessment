import express from 'express';
import * as path from 'path';
import * as mysql from 'mysql2';



/* Load environment vars. */

function exit(reason: string): any {
   console.log('Error: ' + reason);
   console.log('Exiting...');
   process.exit(1);
}

const PORT = process.env.PORT ?? 5000;

const MYSQL_URL = process.env.JAWSDB_URL
   ?? exit('Env var for db url not found.');



/* Connect to the mysql server. */

let conn: mysql.Connection;

if (process.env.NODE_ENV === 'production') {
   console.log('Deployment mode detected: Will connect to ClearDB database.');
   console.log('TODO: Connect via ssl.');

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

conn.query('show tables;', (err, res) => {
   console.log(JSON.stringify(res, null, '  '));
});

express()
//  .use(express.static(path.join(__dirname, 'public')))
//  .set('views', path.join(__dirname, 'views'))
//  .set('view engine', 'ejs')
  .get('/', (req, res) => {res.send('/ - hey')})
  .get('/api', (req, res) => {res.send('/api - wazzap')})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
