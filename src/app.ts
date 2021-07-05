import { Express } from 'express';

import * as db from './bootstrap/mysql-connection';
import * as routing from './routes/route-handler';



/* Load environment vars. */

const PORT = process.env.PORT ?? 5000;


/* Init the static `db.pool` connection. */

db.init();


/* Init the express router. */

let app: Express = routing.init();
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

