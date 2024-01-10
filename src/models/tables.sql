create table countries (
    id SERIAL not null,
    name varchar(30) not null,
    country_code varchar(30) not null,
    country_flag_image varchar(256) not null,
    currency varchar(30) not null,
    created_at timestamp,
    updated_at timestamp,
    primary key (id)
);

create table states (
	id SERIAL not null,
	name varchar(30) not null,
	state_code varchar(30) not null,
	country_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (country_id) references countries(id)
);

create table cities (
	id SERIAL not null,
	name varchar(30) not null,
	state_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (state_id) references states(id)
);

create table addresses (
	id SERIAL not null,
	address varchar(256),
	city_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (city_id) references cities(id)
);

create type user_roles AS ENUM ('super-admin', 'admin', 'user');

create table users (
	id SERIAL not null,
	first_name varchar(30) not null,
	last_name varchar(30),
	email varchar(256) unique,
	phone varchar(20) unique,
	password varchar(100),
	otp int,
	is_admin bool default false,
	user_role user_roles,
	user_profile_picture varchar(256),
	created_at timestamp,
    updated_at timestamp,
    primary key (id)
);

ALTER TABLE addresses 
ADD user_id int;

ALTER TABLE addresses 
ADD CONSTRAINT addresses_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id);

create table product_categories (
	id SERIAL not null,
	name varchar(100) not null,
	description varchar(256),
	is_active bool default true,
	created_at timestamp,
    updated_at timestamp,
    primary key (id)
);

create table products (
	id SERIAL not null,
	name varchar (100) not null,
	description varchar(256),
	image varchar(256),
	is_active bool default true,
	product_category int,
	country_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (product_category) references product_categories (id),
    foreign key (country_id) references countries (id)
);

create table stores (
	id SERIAL not null,
	name varchar(100) not null,
	description varchar(256),
	store_image varchar(256),
	store_start_time time,
	store_end_time time,
	is_active bool default true,
	owner_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (owner_id) references users(id)
);

ALTER TABLE addresses 
ADD store_id int;

ALTER TABLE addresses 
ADD CONSTRAINT addresses_store_id_fkey
FOREIGN KEY (store_id)
REFERENCES stores(id);

create table store_inventory (
	id SERIAL not null,
	description varchar(256),
	sku varchar(256),
	mrp varchar(256),
	stock int,
	stock_alert int,
	product_image varchar(256),
	product_id int,
	store_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (store_id) references stores(id),
    foreign key (product_id) references products(id)
);

create table store_product_relation (
	store_id int,
	product_id int,
    primary key (store_id, product_id),
    foreign key (store_id) references stores(id),
    foreign key (product_id) references products(id)
);

create table coupons (
	id SERIAL not null,
	coupon_code varchar(100),
	description varchar(256),
	coupon_amount int,
	coupon_start_date timestamp,
	coupon_end_date timestamp,
	is_active bool default true,
	number_of_user_used int,
	user_limit int,
	store_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (store_id) references stores(id)
);

create table carts (
	id SERIAL not null,
	user_id int,
	product_details_id int,
	quantity int, 
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (user_id) references users(id),
    foreign key (product_details_id) references store_inventory(id)
);

create table orders (
	id SERIAL not null,
	order_placed_date timestamp,
	order_amount int,
	payment_status bool default false,
	order_status order_status, 
	address_id int,
	user_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (user_id) references users(id),
    foreign key (address_id) references addresses(id)
);

create table order_products (
	id SERIAL not null,
	quantity int,
	product_price int,
	order_id int,
	product_id int,
	created_at timestamp,
    updated_at timestamp,
    primary key (id),
    foreign key (order_id) references orders(id),
    foreign key (product_id) references store_inventory(id)
);