## API

|method |body       |URL                                |response
|:-:    |-          |-                                  |-
|POST   |`Items`    |`/items`                           |`Items.itemsID`
|GET    |           |`/items?name=:name`                |`Items`
|GET    |           |`/items/:itemsID`                  |`Items`
|POST   |`Carts \| null`|`/carts`                       |`Carts.cartsID`
|GET    |           |`/carts/:cartsID`                  |`Carts`
|PATCH  |`Carts \| { discount?, taxes? }`|`/carts/:cartsID`|`Carts`
|DELETE |           |`/carts/:cartsID`                  |
|PUT    |`[Items.itemsID, ...]`|`/carts/:cartsID/items` |`Carts`
|PUT    |           |`/carts/:cartsID/items/:itemsID`   |`Carts`
|DELETE |`[Items.itemsID, ...]`|`/carts/:cartsID/items` |
|DELETE |           |`/carts/:cartsID/items/:itemsID`   |


## Types Reference

##### GET requests
```ts
interface Items {
  itemsID: number;
  name: string; /* Must be unique and cannot be a valid integer, e.g., "1337" */
  price: number;
}

interface Carts {
  cartsID: number;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  items: Items[];
}
```

##### POST requests
```ts
interface Items {
  name: string; /* Must be unique and cannot be a valid integer, e.g., "1337" */
  price: number;
}

interface Carts {
  discount?: number;
  taxes?: number;
  items?: [Items.itemsID, ...];
}
```

##### ID values
ID values are automatically generated in creation (POST) requests, and thus a passed ID value will be ignored. Reference IDs, e.g., `Carts.items[0].itemsID`, are necessary even in a creation request.

##### Optional values
Null values default to zero for numbers and empty array for arrays. API calls (such as GET requests) will always populate optional values with their defaults, so a GET request returning a type `Cart` will always return an object with an `Cart.items` field, a`Cart.total` field, etc.

##### Errors
Requests that accept an array of values won't fail if it values fail due to that those value already existing (or not existing in the case of a DELETE request). It is thus up to the developer to check its success.

And unless specified, the response body will never be empty/null on a successful request. Instead, errors will be reported via HTTP status codes.

