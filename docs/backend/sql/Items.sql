CREATE TABLE Items (
   -- Columns.
   itemsID     int not null auto_increment primary key,
   name        varchar(255) not null unique,
   price       float not null
);
