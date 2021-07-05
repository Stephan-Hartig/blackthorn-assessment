import * as mysql from './mysql-connection';
import * as memjs from './memjs-connection';

export { pool } from './mysql-connection';
export { cache } from './memjs-connection';

export function bootstrap() {
   mysql.init();
   memjs.init();
}
