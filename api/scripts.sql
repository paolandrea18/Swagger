use database DelilahResto

create table User (
  UserId int not null auto_increment primary key,
  Username varchar(50) not null,
  RoleId int not null,
  Password varchar(100) not null,
  FirstName varchar(50) not null,
  LastName varchar(50) not null,
  Email varchar(50) not null,
  address varchar(100) not null,
  Phone varchar(20) not null,
  Enable bit default = 1 not null
)

create table Role (
  RoleId int not null auto_increment primary key,
  Description varchar(50)
)

CREATE TABLE Product (
  ProductId int not null auto_increment primary key,
  Name varchar(50) not null,
  Image varchar(100) not null,
  Cost int not null,
  Available bit not null default = 1
)

CREATE TABLE OrderStatus (
  OrderStatusId int not null auto_increment primary key,
  Description varchar(50) not null
)

CREATE TABLE PayType (
  PayTypeId int not null auto_increment primary key,
  Description varchar(50)
)

CREATE TABLE Orders (
  OrderId int not null auto_increment primary key,
  UserId int not null,
  PayTypeId int not null,
  OrderStatusId int not null,
  Description varchar(400) not null,
  Total int null,
  OrderTime datetime not null
)
ALTER TABLE Orders
ADD CONSTRAINT FK_UserOrder
FOREIGN KEY (UserId) REFERENCES User(UserId)

ALTER TABLE Orders
ADD CONSTRAINT FK_PayTypeOrder
FOREIGN KEY (PayTypeId) REFERENCES PayType(PayTypeId)

ALTER TABLE Orders
ADD CONSTRAINT FK_OderStatusOrder
FOREIGN KEY (OrderStatusId) REFERENCES OrderStatus(OrderStatusId)

CREATE TABLE OrderDetail (
  OrderId int not null,
  ProductId int not null,
  Quantity int not null
)
ALTER TABLE OrderDetail
ADD CONSTRAINT PK_OrdersProduct PRIMARY KEY (OrderId,ProductId)

ALTER TABLE OrderDetail
ADD CONSTRAINT FK_OrdersOrderDeatil
FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)

ALTER TABLE OrderDetail
ADD CONSTRAINT FK_ProductOrderDeatil
FOREIGN KEY (ProductId) REFERENCES Product(ProductId)

alter table user
add constraint FK_RoleUser
foreign key (RoleId) references Role(RoleId)

# PayType Data
insert into paytype (description) values ('Efectivo')
insert into paytype (description) values ('Tarjeta')

# Order Status Data
insert into orderstatus (description) values ('Nuevo')
insert into orderstatus (description) values ('Confirmado')
insert into orderstatus (description) values ('En preparación')
insert into orderstatus (description) values ('En camino')
insert into orderstatus (description) values ('Entregado')
insert into orderstatus (description) values ('Cancelado')

# Product Data
insert into product (Name,Image,Cost) values ('Hamburguesa','//HamburguesaImagen',20000)
insert into product (Name,Image,Cost) values ('Perro','//PerroImagen',12000)
insert into product (Name,Image,Cost) values ('Nachos','//NachosImagen',15000)
insert into product (Name,Image,Cost) values ('Tacos','//TacpsImagen',18000)
insert into product (Name,Image,Cost) values ('Pizza','//PizzaImagen',10000)
insert into product (Name,Image,Cost) values ('Soda','//SodaImagen',3000)
insert into product (Name,Image,Cost) values ('Agua','//AguaImagen',3000)

# Role Data
insert into role (Description) values ('Administrador')
insert into role (Description) values ('Cliente')
