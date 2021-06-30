CREATE TABLE Carts (
   -- Columns.
   cartsID     int not null auto_increment primary key,
   discount    float not null,
   -- WARNING: The following columns contain redundant/duplicate data:
   subtotal    float not null,
   taxes       float not null,
   total       float not null
);
