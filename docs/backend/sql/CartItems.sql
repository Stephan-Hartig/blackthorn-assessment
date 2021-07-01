CREATE TABLE CartItems (
   -- Columns.
   cartsID     int not null references Carts(cartsID),
   itemsID     int not null references Items(itemsID),

   -- Contstraints.
   primary key(cartsID, itemsID)
);
