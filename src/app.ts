import { Express } from 'express';

import * as globals from './globals/index';
import * as routing from './routes/route-handler';


const PORT = process.env.PORT ?? 5000;

globals.bootstrap();

let app: Express = routing.init();
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

