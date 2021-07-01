import { Express } from 'express';

import * as db from './mysql-connection';
import * as routing from './route-handler';



/* Load environment vars. */

const PORT = process.env.PORT ?? 5000;


/* Init the static `db.conn` connection. */

db.init();


/* Init the express router. */

let app: Express = routing.init();
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

