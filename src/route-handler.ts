import { Express, default as express } from 'express';
import { default as cors } from 'cors';
//import * as path from 'path';

import { ItemsRoute } from './routes/items';
import { CartsRoute } from './routes/carts';

export function init(): Express {
   let app: Express = express()
      .use(cors())
      .use(express.json())
      .get('/', (_, res) => { res.send("Use '/api/...' to access the API.") });

   app = ItemsRoute(app, '/api/items');
   app = CartsRoute(app, '/api/carts');

   return app;
}
