CREATE TABLE almacen(
	id_almacen int, 
	nombre varchar(50),
	direccion varchar(50),
    capacidad varchar(50),
	
	Primary key(id_almacen)
)

CREATE TABLE insumo(
	id_insumo int,
	nombre varchar(50),
	descripcion varchar(50),
	precio int,
    cantidad int,
	id_almacen int,
	
	Primary Key(id_insumo),
	Foreign Key(id_almacen) references almacen(id_almacen)
)

CREATE TABLE concesionario(
	id_concesionario int,
	nombre varchar(50),
	direccion varchar(50),
	ciudad varchar(50),
    telefono int,
	
	Primary Key(id_concesionario)
)

CREATE TABLE cliente(
	id_cliente int,
	nombre varchar(50),
	direccion varchar(50),
	telefono varchar(50),
    correo varchar(50),
	id_concesionario int,
	
	Primary Key(id_cliente),
	Foreign Key(id_concesionario) references concesionario(id_concesionario)
)

CREATE TABLE vehiculo(
	id_vehiculo int,
	marca varchar(50),
	modelo varchar(50),
	año varchar(50),
	precio int,
	id_concesionario int,
	
	Primary Key(id_vehiculo),
	Foreign Key(id_concesionario) references concesionario(id_concesionario)
)

CREATE TABLE empleado(
	id_empleado int,
	nombre varchar(50),
	cargo varchar(50),
	salario varchar(50),
	id_concesionario int,
	
	Primary Key(id_empleado),
	Foreign Key(id_concesionario) references concesionario(id_concesionario)
)

CREATE TABLE compra(
	id_compra int,
	fecha date,
    precio_total int,
	id_cliente int,
	id_empleado int,
	
	
	Primary Key(id_compra),
	Foreign Key(id_cliente) references cliente(id_cliente),
	Foreign Key(id_empleado) references empleado(id_empleado)
)

CREATE TABLE detallecompra(
	id_detallecompra int,
    tipo_producto varchar(50),
	cantidad int,
	precio_unitario int,
	precio_total int,
	id_compra int,
	id_producto int,
	
	
	Primary Key(id_detallecompra),
	Foreign Key(id_compra) references compra(id_compra),
	Foreign Key(id_producto) references vehiculo(id_vehiculo),
	Foreign Key(id_producto) references insumo(id_insumo)
)