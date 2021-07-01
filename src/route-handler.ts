import { Express, default as express } from 'express';
//import * as path from 'path';

import { ItemsRoute } from './routes/items';
import { CartsRoute } from './routes/carts';

export function init(): Express {
   let app: Express = express()
      .use(express.json())
      .get('/', (_, res) => { res.send("Use '/api/...' to access the API.") });

   app = ItemsRoute(app, '/api/items');
   app = CartsRoute(app, '/api/carts');

   return app;
}
