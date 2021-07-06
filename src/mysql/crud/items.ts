import * as mysql from 'mysql2';

import * as prepared from '../prepared/index';
import * as tableTypes from '../table-types';


export async function itemsCreate(pool: mysql.Pool, item: tableTypes.ItemCreate): Promise<number> {
   return prepared.items.create(pool, item);
}

export async function itemsRead(pool: mysql.Pool, itemsID: number): Promise<tableTypes.Item> {
   return prepared.items.read_byItemsID(pool, itemsID);
}

export async function itemsReadByName(pool: mysql.Pool, name: string): Promise<tableTypes.Item[]> {
   return prepared.items.read_many_byPartialName(pool, name);
}

export async function itemsReadAll(pool: mysql.Pool): Promise<tableTypes.Item[]> {
   return prepared.items.read_all(pool);
}
