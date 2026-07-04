import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    role: varchar({ length: 20 }).default("user").notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const addressesTable = pgTable("addresses", {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid().references(()=>usersTable.id).notNull(),
    full_name: varchar({ length: 255 }).notNull(),
    phone_no: varchar({ length: 20 }).notNull(),
    address_line: varchar({ length: 255 }).notNull(),
    city: varchar({ length: 100 }).notNull(),
    state: varchar({ length: 100 }).notNull(),
    postal_code: varchar({ length: 20 }).notNull(),
    is_default: boolean().default(false).notNull(),
    country: varchar({ length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    
});

export const cartsTable = pgTable('carts', {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid().references(()=>usersTable.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})
export const cartItemsTable = pgTable('cart_items', {
    id: uuid().defaultRandom().primaryKey(),
    cart_id: uuid().references(()=>cartsTable.id).notNull(),
    product_id: uuid().references(()=>productsTable.id).notNull(),
    quantity: integer().default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})


export const reviewsTable = pgTable('reviews', {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid().references(()=>usersTable.id).notNull(),
    product_id: uuid().references(()=>productsTable.id).notNull(),
    rating: integer().notNull(),
    comment: text(),
    createdAt: timestamp('created_at').defaultNow(),
})
export const wishlistTable = pgTable('wishlist', {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid().references(()=>usersTable.id).notNull(),
    product_id: uuid().references(()=>productsTable.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})
export const orderItemsTable = pgTable('order_items', {
    id: uuid().defaultRandom().primaryKey(),
    order_id: uuid().references(()=>ordersTable.id).notNull(),
    product_id: uuid().references(()=>productsTable.id).notNull(),
    quantity: integer().notNull(),
    price: decimal({precision: 10, scale: 2}).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})
export const ordersTable = pgTable('orders', {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid().references(()=>usersTable.id).notNull(),
    address_id: uuid().references(()=>addressesTable.id).notNull(),
    total_amount: decimal({precision: 10, scale: 2}).notNull(),
    payment_status: varchar({ length: 20 }).default("pending" ).notNull(),
    order_status: varchar({ length: 20 }).default( "pending").notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})
export const productsTable = pgTable("products", {
    id: uuid().defaultRandom().primaryKey(),
    category_id: uuid().references(() => categoriesTable.id).notNull(),
    name: varchar({ length: 200 }).notNull(),
    slug: varchar({ length: 220 }).unique().notNull(),
    description: text(),
    brand: varchar({ length: 100 }),
    sku: varchar({ length: 100 }).unique(),
    price: decimal({precision: 10, scale: 2}).notNull(),
    discount_price: decimal({precision: 10, scale: 2}),
    stock: integer().default(0).notNull(),
    thumbnail: text(),
    is_active: boolean().default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const categoriesTable = pgTable('categories', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 220 }).unique().notNull(),
    description: text(),
    image:text(),
    createdAt: timestamp("created_at").defaultNow(),
})

export const productImageTable= pgTable('product_images',{
    id: uuid().defaultRandom().primaryKey(),
    product_id:uuid().references(()=>productsTable.id).notNull(),
    image_url:text(),

})