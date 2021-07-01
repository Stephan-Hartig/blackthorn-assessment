## API

|method |body       |URL                                |response
|:-:    |-          |-                                  |-
|POST   |`Items`    |`/items`                           |`Items.itemsID`
|GET    |           |`/items/:itemsID`                  |`Items`
|GET    |           |`/items/:name`                     |`Items`
|PATCH  |           |`/items/:itemsID?price=:price`     |`Items`
|DELETE |           |`/items/:itemsID`                  |
|POST   |`Carts \| null`|`/carts`                       |`Carts.cartsID`
|GET    |           |`/carts/:cartsID`                  |`Carts`
|PATCH  |           |`/carts/:cartsID?discount=:discount`|`Carts`
|PATCH  |           |`/carts/:cartsID?taxes=:taxes`     |`Carts`
|DELETE |           |`/carts/:cartsID`                  |
|PUT    |`[Items.itemsID, ...]`|`/carts/:cartsID/items` |`Carts`
|GET    |           |`/carts/:cartsID/items`            |`Carts`
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
  items?: Items[];
}
```

##### ID values
ID values are automatically generated in creation (POST) requests, and thus a passed ID value will be ignored. Reference IDs, e.g., `Carts.items[0].itemsID`, are necessary even in a creation request.

##### Optional values
Null values default to zero for numbers and empty array for arrays. API calls (such as GET requests) will always populate optional values with their defaults, so a GET request returning a type `Cart` will always return an object with an `Cart.items` field, a`Cart.total` field, etc.

##### Errors
Unless specified, the response body will never be empty/null on a successful request. Instead, errors will be reported via HTTP status codes.

