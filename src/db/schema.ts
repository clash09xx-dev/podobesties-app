import { pgTable, text, timestamp, uuid, varchar, integer } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  service: varchar('service', { length: 255 }).notNull(),
  bookingDate: varchar('booking_date', { length: 50 }).notNull(),
  bookingTime: varchar('booking_time', { length: 50 }).notNull(),
  note: text('note'),
  status: varchar('status', { length: 50 }).notNull().default('New'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  message: text('message'),
  status: varchar('status', { length: 50 }).notNull().default('New'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  rating: integer('rating').notNull().default(5),
  source: varchar('source', { length: 50 }).notNull().default('Booksy'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const gallery = pgTable('gallery', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  caption: varchar('caption', { length: 255 }),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const images = pgTable('images', {
  id: uuid('id').primaryKey().defaultRandom(),
  data: text('data').notNull(),
  mimetype: varchar('mimetype', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
