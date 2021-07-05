
export interface Cart {
   cartsID: number;
   discount: number;
   subtotal: number;
   taxes: number;
   total: number;
}

export interface CartCreate {
   discount: number;
   subtotal: number;
   taxes: number;
   total: number;
}
