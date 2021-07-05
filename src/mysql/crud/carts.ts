import * as mysql from 'mysql2';

import * as prepared from '../prepared/index';
import * as tableTypes from '../table-types';


export async function cartsCreate(pool: mysql.Pool, cart?: tableTypes.Cart): Promise<number> {
   cart = Object.assign({
      discount: 0,
      subtotal: 0,
      taxes: 0,
      total: 0,
   }, cart);

   return prepared.carts.create(pool, cart);
}

export async function cartsRead(pool: mysql.Pool, cartsID: number): Promise<tableTypes.Cart> {
   return prepared.carts.read_byCartsID(pool, cartsID);
}

export async function cartsUpdate(pool: mysql.Pool, cartsID: number, cart: tableTypes.Cart): Promise<void> {
   cart = Object.assign({
      discount: 0,
      taxes: 0,
   }, cart);
   
   return prepared.carts.update_byCartsID(pool, cartsID, cart);
}

export async function cartsDelete(pool: mysql.Pool, cartsID: number): Promise<void> {
   await prepared.carts.delete_byCartsID(pool, cartsID);
   await prepared.cartItems.delete_many_byCartsID(pool, cartsID);
   
   return;
}

export async function carts_itemsCreate(pool: mysql.Pool, cartsID: number, itemsID: number): Promise<tableTypes.Cart> {
   await prepared.cartItems.create(pool, { cartsID, itemsID });
   
   let cart = await prepared.carts.read_byCartsID(pool, cartsID);
   let item = await prepared.items.read_byItemsID(pool, itemsID);
   
   cart.subtotal += item.price;
   cart.total += item.price;
   
   await prepared.carts.update_byCartsID(pool, cartsID, cart);
   
   return cart;
}

export async function carts_itemsRead(pool: mysql.Pool, cartsID: number, itemsID?: number): Promise<tableTypes.Item[] | tableTypes.Item> {
   if (itemsID == null)
      return prepared.cartItems.read_many_byCartsID_joinItems(pool, cartsID);
   else
      return prepared.cartItems.read_byIDs_joinItems(pool, cartsID, itemsID);
}

export async function carts_itemsDelete(pool: mysql.Pool, cartsID: number, itemsID: number): Promise<tableTypes.Cart> {
   await prepared.cartItems.delete_byIDs(pool, cartsID, itemsID);
   
   let cart = await prepared.carts.read_byCartsID(pool, cartsID);
   let item = await prepared.items.read_byItemsID(pool, itemsID);
   
   cart.subtotal -= item.price;
   cart.total -= item.price;
   
   await prepared.carts.update_byCartsID(pool, cartsID, cart);
   
   return cart;
}
