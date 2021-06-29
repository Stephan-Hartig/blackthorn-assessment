import express from 'express';
import * as path from 'path';
import * as mysql from 'mysql';

//function exit(reason: string): any {
//   console.log('Error: ' + reason);
//   console.log('Exiting...');
//   process.exit(1);
//}
//
const PORT = process.env.PORT || 5000;
//const MYSQL_URL = process.env.CLEARDB_DATABASE_URL
//   ?? exit('Env var for db url not found.');
//const MYSQL_USER = process.env.CLEARDB_DATABASE_USERNAME
//   ?? exit('Env var for db username not found.');
//const MYSQL_PASS = process.env.CLEARDB_DATABASE_PASSWORD
//   ?? exit('Env var for db password not found.');
//
//const conn = mysql.createConnection({
//   host:       MYSQL_URL,
//   user:       MYSQL_USER,
//   password:   MYSQL_PASS,
//   database:   'Shopping'
//});

//conn.connect(() => { console.log(`Opened MySQL connection on port ${PORT}.`); });

express()
//  .use(express.static(path.join(__dirname, 'public')))
//  .set('views', path.join(__dirname, 'views'))
//  .set('view engine', 'ejs')
  .get('/', (req, res) => {res.send('/ - hey')})
  .get('/api', (req, res) => {res.send('/api - wazzap')})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
