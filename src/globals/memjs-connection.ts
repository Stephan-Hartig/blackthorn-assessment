import * as memjs from 'memjs';
import * as mysql from 'mysql2';
import { pool } from './mysql-connection';


function exit(reason: string): any {
   console.log('Error: ' + reason);
   console.log('Exiting...');
   process.exit(1);
}


export let cache: memjs.Client;

/**
 * Init the static `db.conn` connection.
 */
export function init() {
   if (process.env.NODE_ENV === 'production') {
      console.log('Deployment mode detected: Will connect to MemCachier memcached instance.');
      
      const MEMCACHIER_URL = process.env.MEMCACHIER_SERVERS
         ?? exit('Env var for memcached url not found.');
      
      cache = memjs.Client.create(MEMCACHIER_URL);
   }
   else {
      console.log('Local mode detected: Will connect to local memcached instance.');
      
      const MEMCACHED_URI = process.env.MEMCACHED_SERVERS
         ?? exit('Env var for memcached url not found.');
      
      cache = memjs.Client.create(MEMCACHED_URI, {
         timeout: 1,
         keepAlive: true
      });
   }
   
   cache ?? exit('Could not establish memcached connection.');
}
