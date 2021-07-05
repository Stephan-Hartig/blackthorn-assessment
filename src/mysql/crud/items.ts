import * as mysql from 'mysql2';

import * as prepared from '../prepared/index';
import * as tableTypes from '../table-types';


export async function itemsCreate(pool: mysql.Pool, item: tableTypes.ItemCreate): Promise<number> {
   return prepared.items.create(pool, item);
}

export async function itemsRead(pool: mysql.Pool, itemsID: number | string): Promise<tableTypes.Item> {
   if (typeof itemsID === 'string') {
      return prepared.items.read_byName(pool, itemsID);
   } else {
      return prepared.items.read_byItemsID(pool, itemsID);
   }
}
