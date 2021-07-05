import * as mysql from 'mysql2';

function exit(reason: string): any {
   console.log('Error: ' + reason);
   console.log('Exiting...');
   process.exit(1);
}


export let pool: mysql.Pool;

/**
 * Init the static `db.conn` connection.
 */
export function init() {
   if (process.env.NODE_ENV === 'production') {
      console.log('Deployment mode detected: Will connect to ClearDB database.');
      console.log('TODO: Connect via ssl.'); // TODO

      const JAWSDB_URL = process.env.JAWSDB_URL
         ?? exit('Env var for db url not found.');
      const JAWSDB_POOL_LIMIT = parseInt(process.env.JAWSDB_POOL_LIMIT || '50');

      pool = mysql.createPool({
         uri: JAWSDB_URL,
         connectionLimit: JAWSDB_POOL_LIMIT
      });
   }
   else {
      console.log('Local mode detected: Will connect to local database.');

      const MYSQL_URL = process.env.MYSQL_URL
         ?? exit('Env var for db url not found.');
      const MYSQL_USER = process.env.MYSQL_USER
         ?? exit('Env var for db user not found.');
      const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD
         ?? exit('Env var for db password not found.');
      const MYSQL_DATABASE = process.env.MYSQL_DATABASE
         ?? exit('Env var for db database not found.');

      pool = mysql.createPool({
         host:       MYSQL_URL,
         user:       MYSQL_USER,
         password:   MYSQL_PASSWORD,
         database:   MYSQL_DATABASE
      });
   }
   
   pool ?? exit('Could not establish MySQL pool.');
}

