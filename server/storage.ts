import {
  users,
  pages,
  videos,
  photos,
  photoAlbums,
  complaints,
  news,
  menuItems,
  type User,
  type InsertUser,
  type InsertPage,
  type Page,
  type InsertVideo,
  type Video,
  type InsertPhoto,
  type Photo,
  type InsertComplaint,
  type Complaint,
  type InsertNews,
  type News,
  type PhotoAlbum,
  type MenuItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Page operations
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: number): Promise<void>;
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  getPages(published?: boolean): Promise<Page[]>;

  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: number): Promise<void>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideos(published?: boolean): Promise<Video[]>;

  // Photo operations
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
  getPhoto(id: number): Promise<Photo | undefined>;
  getPhotos(published?: boolean): Promise<Photo[]>;
  getPhotosByCategory(category: string): Promise<Photo[]>;

  // Photo album operations
  getPhotoAlbums(published?: boolean): Promise<PhotoAlbum[]>;
  getPhotoAlbum(id: number): Promise<PhotoAlbum | undefined>;

  // Complaint operations
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: number, complaint: Partial<InsertComplaint>): Promise<Complaint>;
  getComplaint(id: number): Promise<Complaint | undefined>;
  getComplaintByNumber(complaintNumber: string): Promise<Complaint | undefined>;
  getComplaints(status?: string): Promise<Complaint[]>;

  // News operations
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;
  getNews(id: number): Promise<News | undefined>;
  getAllNews(published?: boolean): Promise<News[]>;

  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Page operations
  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
  }

  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  async getPage(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async getPages(published?: boolean): Promise<Page[]> {
    let query = db.select().from(pages);
    if (published !== undefined) {
      query = query.where(eq(pages.isPublished, published));
    }
    return query.orderBy(desc(pages.updatedAt));
  }

  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video> {
    const [updatedVideo] = await db
      .update(videos)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async getVideos(published?: boolean): Promise<Video[]> {
    let query = db.select().from(videos);
    if (published !== undefined) {
      query = query.where(eq(videos.isPublished, published));
    }
    return query.orderBy(desc(videos.createdAt));
  }

  // Photo operations
  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo> {
    const [updatedPhoto] = await db
      .update(photos)
      .set({ ...photo, updatedAt: new Date() })
      .where(eq(photos.id, id))
      .returning();
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  async getPhotos(published?: boolean): Promise<Photo[]> {
    let query = db.select().from(photos);
    if (published !== undefined) {
      query = query.where(eq(photos.isPublished, published));
    }
    return query.orderBy(desc(photos.createdAt));
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return db.select().from(photos)
      .where(and(eq(photos.category, category), eq(photos.isPublished, true)))
      .orderBy(desc(photos.createdAt));
  }

  // Photo album operations
  async getPhotoAlbums(published?: boolean): Promise<PhotoAlbum[]> {
    const query = db.select().from(photoAlbums);
    if (published !== undefined) {
      query.where(eq(photoAlbums.isPublished, published));
    }
    return query.orderBy(desc(photoAlbums.createdAt));
  }

  async getPhotoAlbum(id: number): Promise<PhotoAlbum | undefined> {
    const [album] = await db.select().from(photoAlbums).where(eq(photoAlbums.id, id));
    return album;
  }

  // Complaint operations
  async createComplaint(complaint: InsertComplaint): Promise<Complaint> {
    // Generate complaint number
    const complaintNumber = `CID${new Date().getFullYear()}${Date.now().toString().slice(-6)}`;
    
    const [newComplaint] = await db.insert(complaints).values({
      ...complaint,
      complaintNumber,
    }).returning();
    return newComplaint;
  }

  async updateComplaint(id: number, complaint: Partial<InsertComplaint>): Promise<Complaint> {
    const [updatedComplaint] = await db
      .update(complaints)
      .set({ ...complaint, updatedAt: new Date() })
      .where(eq(complaints.id, id))
      .returning();
    return updatedComplaint;
  }

  async getComplaint(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint;
  }

  async getComplaintByNumber(complaintNumber: string): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.complaintNumber, complaintNumber));
    return complaint;
  }

  async getComplaints(status?: string): Promise<Complaint[]> {
    const query = db.select().from(complaints);
    if (status) {
      query.where(eq(complaints.status, status));
    }
    return query.orderBy(desc(complaints.createdAt));
  }

  // News operations
  async createNews(news: InsertNews): Promise<News> {
    const [newNews] = await db.insert(news).values(news).returning();
    return newNews;
  }

  async updateNews(id: number, newsData: Partial<InsertNews>): Promise<News> {
    const [updatedNews] = await db
      .update(news)
      .set({ ...newsData, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return updatedNews;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async getNews(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async getAllNews(published?: boolean): Promise<News[]> {
    const query = db.select().from(news);
    if (published !== undefined) {
      query.where(eq(news.isPublished, published));
    }
    return query.orderBy(desc(news.createdAt));
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems)
      .where(eq(menuItems.isActive, true))
      .orderBy(menuItems.sortOrder);
  }
}

export const storage = new DatabaseStorage();
