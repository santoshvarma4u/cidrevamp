import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin, super_admin
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content pages table
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").unique().notNull(),
  title: text("title").notNull(),
  content: text("content"),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(false),
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  thumbnailPath: varchar("thumbnail_path"),
  duration: integer("duration"), // in seconds
  category: varchar("category").default("news"), // news, operations, awareness
  isPublished: boolean("is_published").default(false),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Photos table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  category: varchar("category").default("operations"), // operations, events, awards, training
  isPublished: boolean("is_published").default(false),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Photo albums table
export const photoAlbums = pgTable("photo_albums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverPhotoId: integer("cover_photo_id").references(() => photos.id),
  isPublished: boolean("is_published").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Photo album relationships
export const photoAlbumPhotos = pgTable("photo_album_photos", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").references(() => photoAlbums.id),
  photoId: integer("photo_id").references(() => photos.id),
  sortOrder: integer("sort_order").default(0),
});

// Complaints table
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  complaintNumber: varchar("complaint_number").unique().notNull(),
  type: varchar("type").notNull(), // general, cybercrime, women_safety, economic_offence
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  complainantName: varchar("complainant_name").notNull(),
  complainantEmail: varchar("complainant_email"),
  complainantPhone: varchar("complainant_phone"),
  complainantAddress: text("complainant_address"),
  status: varchar("status").default("pending"), // pending, under_investigation, resolved, closed
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  assignedTo: varchar("assigned_to").references(() => users.id),
  attachments: text("attachments").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// News articles table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: varchar("featured_image"),
  category: varchar("category").default("general"), // general, operations, alerts, press_release
  isPublished: boolean("is_published").default(false),
  isPinned: boolean("is_pinned").default(false),
  authorId: varchar("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu items table
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  label: varchar("label").notNull(),
  url: varchar("url"),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  videos: many(videos),
  photos: many(photos),
  complaints: many(complaints),
  news: many(news),
}));

export const pageRelations = relations(pages, ({ one }) => ({
  author: one(users, {
    fields: [pages.authorId],
    references: [users.id],
  }),
}));

export const videoRelations = relations(videos, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [videos.uploadedBy],
    references: [users.id],
  }),
}));

export const photoRelations = relations(photos, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [photos.uploadedBy],
    references: [users.id],
  }),
  albumPhotos: many(photoAlbumPhotos),
}));

export const photoAlbumRelations = relations(photoAlbums, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [photoAlbums.createdBy],
    references: [users.id],
  }),
  coverPhoto: one(photos, {
    fields: [photoAlbums.coverPhotoId],
    references: [photos.id],
  }),
  albumPhotos: many(photoAlbumPhotos),
}));

export const photoAlbumPhotoRelations = relations(photoAlbumPhotos, ({ one }) => ({
  album: one(photoAlbums, {
    fields: [photoAlbumPhotos.albumId],
    references: [photoAlbums.id],
  }),
  photo: one(photos, {
    fields: [photoAlbumPhotos.photoId],
    references: [photos.id],
  }),
}));

export const complaintRelations = relations(complaints, ({ one }) => ({
  assignedTo: one(users, {
    fields: [complaints.assignedTo],
    references: [users.id],
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  complaintNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;
export type PhotoAlbum = typeof photoAlbums.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
