import express from 'express';
import * as path from 'path';
import * as mysql from 'mysql';

function exit(reason: string): any {
   console.log('Error: ' + reason);
   console.log('Exiting...');
   process.exit(1);
}

const PORT = process.env.PORT ?? 5000;

const MYSQL_URL = process.env.JAWSDB_URL
   ?? exit('Env var for db url not found.');
const MYSQL_USER = process.env.JAWSDB_USER
   ?? exit('Env var for db user not found.');
const MYSQL_PASSWORD = process.env.JAWSDB_PASSWORD
   ?? exit('Env var for db password not found.');
const MYSQL_DATABASE = process.env.JAWSDB_DATABASE
   ?? exit('Env var for db database not found.');

let conn: mysql.Connection;

if (process.env.NODE_ENV === 'production') {
   console.log('Deployment mode detected: Will connect to ClearDB database.');
   console.log('TODO: Connect via ssl.');
   conn = mysql.createConnection(MYSQL_URL);
   //conn = mysql.createConnection({
   //   host:       MYSQL_URL,
   //   user:       MYSQL_USER,
   //   password:   MYSQL_PASSWORD,
   //   database:   MYSQL_DATABASE
   //   ssl: {
   //      ca: fs.readFileSync(__dirname + '/mysql-ca.crt');
   //   }
   //});
}
else {
   console.log('Local mode detected: Will connect to local database.');

   conn = mysql.createConnection({
      host:       MYSQL_URL,
      user:       MYSQL_USER,
      password:   MYSQL_PASSWORD,
      database:   MYSQL_DATABASE
   });
}

conn.connect((err) => {
   if (err)
      console.error('Error connecting: ' + err.stack);
   else
      console.log(`Opened MySQL connection.`);
});
//
//
//
conn.query('create table Foo (FooID int not null auto_increment primary key);', (err, res) => {
   console.log(JSON.stringify(res, null, '  '));
});

express()
//  .use(express.static(path.join(__dirname, 'public')))
//  .set('views', path.join(__dirname, 'views'))
//  .set('view engine', 'ejs')
  .get('/', (req, res) => {res.send('/ - hey')})
  .get('/api', (req, res) => {res.send('/api - wazzap')})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
