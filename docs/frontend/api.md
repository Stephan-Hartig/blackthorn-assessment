## API

|method |body       |URL                                |response
|:-:    |-          |-                                  |-
|GET    |           |`/api/items`                           |`Item[]`
|GET    |           |`/api/items/:itemsID`                  |`Item`
|GET    |           |`/api/items/:name`                     |`Item`
|POST   |           |`/api/carts`                           |`Cart.cartsID`
|POST   |`{ discount?, taxes? }`|`/api/carts`               |`Cart.cartsID`
|GET    |           |`/api/carts/:cartsID`                  |`Cart`
|PATCH  |`{ discount?, taxes? }`|`/api/carts/:cartsID`      |`Cart`
|DELETE |           |`/api/carts/:cartsID`                  |
|GET    |           |`/api/carts/:cartsID/items`            |`Item[]`
|PUT    |           |`/api/carts/:cartsID/items/:itemsID`   |`Cart`
|DELETE |           |`/api/carts/:cartsID/items/:itemsID`   |


## Types Reference

##### Reponse
```ts
interface Item {
  itemsID: number;
  name: string; /* Must be unique and not be a valid integer, e.g., "123" */
  price: number;
}

interface Cart {
  cartsID: number;
  subtotal: number = 0;
  discount: number = 0;
  taxes: number = 0;
  total: number = 0;
}
```


##### Ignored values
Any attribute passed, but not specified in the documentation, will be ignored.

##### Optional values
Null values default to zero for numbers and empty array for arrays. API calls (such as GET requests) will always populate optional values with their defaults, so a GET request returning a type `Cart` will always return an object with a `Cart.subtotal` field, a`Cart.total` field, etc.

##### Errors
Unless specified in the documentation, the response body will never be empty/null on a successful request. Instead, errors will be reported via HTTP status codes.

