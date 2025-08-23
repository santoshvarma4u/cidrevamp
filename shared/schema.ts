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

// User storage table for local authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
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
  // Menu configuration fields
  showInMenu: boolean("show_in_menu").default(false),
  menuTitle: varchar("menu_title"), // Optional custom menu title (falls back to title)
  menuParent: varchar("menu_parent"), // Parent menu group (e.g., 'about', 'citizen-services', 'wings')
  menuOrder: integer("menu_order").default(0), // Order within menu group
  menuDescription: text("menu_description"), // Optional description for dropdown menus
  // Dynamic menu management fields
  menuLocation: varchar("menu_location").default("more"), // 'main_menu' or 'more'
  displayUntilDate: timestamp("display_until_date"), // Date until which page shows in main menu
  isNew: boolean("is_new").default(false), // Show "NEW" badge with rainbow animation
  // End menu fields
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
  displayOrder: integer("display_order").default(0), // For ordering photos in display
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

// News ticker/scrolling text announcements
export const newsTicker = pgTable("news_ticker", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // Higher number = higher priority
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Director information table
export const directorInfo = pgTable("director_info", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  title: varchar("title").notNull().default("Director General of Police"),
  message: text("message").notNull(),
  photoPath: varchar("photo_path"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wings table for specialized CID wings
export const wings = pgTable("wings", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(), // Array of feature strings
  icon: varchar("icon").notNull(), // Icon name (e.g., "CreditCard", "Heart", "Scale")
  href: varchar("href").notNull(), // Link to wing page
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
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

// Regional offices table for contact page
export const regionalOffices = pgTable("regional_offices", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  mapUrl: text("map_url"),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Department contacts table for contact page
export const departmentContacts = pgTable("department_contacts", {
  id: serial("id").primaryKey(),
  sno: integer("sno").notNull(),
  rank: text("rank").notNull(),
  landline: varchar("landline").notNull(),
  email: varchar("email").notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const newsTickerRelations = relations(newsTicker, ({ one }) => ({
  createdBy: one(users, {
    fields: [newsTicker.createdBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
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

export const insertNewsSchema = createInsertSchema(news, {
  publishedAt: z.string().datetime().nullable().transform((val) => val ? new Date(val) : null),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsTickerSchema = createInsertSchema(newsTicker, {
  startDate: z.string().datetime().nullable().transform((val) => val ? new Date(val) : null),
  endDate: z.string().datetime().nullable().transform((val) => val ? new Date(val) : null),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
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
export type InsertNewsTicker = z.infer<typeof insertNewsTickerSchema>;
export type NewsTicker = typeof newsTicker.$inferSelect;
export type PhotoAlbum = typeof photoAlbums.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;

export const insertDirectorInfoSchema = createInsertSchema(directorInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDirectorInfo = z.infer<typeof insertDirectorInfoSchema>;
export type DirectorInfo = typeof directorInfo.$inferSelect;

export const insertWingSchema = createInsertSchema(wings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWing = z.infer<typeof insertWingSchema>;
export type Wing = typeof wings.$inferSelect;

export const insertRegionalOfficeSchema = createInsertSchema(regionalOffices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRegionalOffice = z.infer<typeof insertRegionalOfficeSchema>;
export type RegionalOffice = typeof regionalOffices.$inferSelect;

export const insertDepartmentContactSchema = createInsertSchema(departmentContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDepartmentContact = z.infer<typeof insertDepartmentContactSchema>;
export type DepartmentContact = typeof departmentContacts.$inferSelect;

// Senior Officers table
export const seniorOfficers = pgTable("senior_officers", {
  id: serial("id").primaryKey(),
  position: varchar("position", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  photoPath: varchar("photo_path", { length: 500 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSeniorOfficerSchema = createInsertSchema(seniorOfficers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSeniorOfficer = z.infer<typeof insertSeniorOfficerSchema>;
export type SeniorOfficer = typeof seniorOfficers.$inferSelect;

// Alerts table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // cyber-safety, women-children, general-safety, dos, donts
  slug: varchar("slug", { length: 255 }),
  content: text("content"),
  iconName: varchar("icon_name", { length: 50 }), // lucide icon name (optional)
  priority: integer("priority").default(0), // for ordering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// NCL Content table
export const nclContent = pgTable("ncl_content", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().default("National Criminal Laws (NCL) Update"),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNclContentSchema = createInsertSchema(nclContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertNclContent = z.infer<typeof insertNclContentSchema>;
export type NclContent = typeof nclContent.$inferSelect;
