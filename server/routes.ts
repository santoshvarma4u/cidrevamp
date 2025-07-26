import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPageSchema, insertVideoSchema, insertPhotoSchema, insertComplaintSchema, insertNewsSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { z } from "zod";

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage_multer });

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));
  
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes

  // Pages
  app.get('/api/pages', async (req, res) => {
    try {
      const published = req.query.published === 'true';
      const pages = await storage.getPages(published);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get('/api/pages/slug/:slug', async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Videos
  app.get('/api/videos', async (req, res) => {
    try {
      const published = req.query.published === 'true';
      const videos = await storage.getVideos(published);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Photos
  app.get('/api/photos', async (req, res) => {
    try {
      const published = req.query.published === 'true';
      const category = req.query.category as string;
      
      let photos;
      if (category) {
        photos = await storage.getPhotosByCategory(category);
      } else {
        photos = await storage.getPhotos(published);
      }
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Photo albums
  app.get('/api/photo-albums', async (req, res) => {
    try {
      const published = req.query.published === 'true';
      const albums = await storage.getPhotoAlbums(published);
      res.json(albums);
    } catch (error) {
      console.error("Error fetching photo albums:", error);
      res.status(500).json({ message: "Failed to fetch photo albums" });
    }
  });

  // News
  app.get('/api/news', async (req, res) => {
    try {
      const published = req.query.published === 'true';
      const news = await storage.getAllNews(published);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Complaints - Public
  app.post('/api/complaints', async (req, res) => {
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      res.json(complaint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating complaint:", error);
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  app.get('/api/complaints/number/:complaintNumber', async (req, res) => {
    try {
      const complaint = await storage.getComplaintByNumber(req.params.complaintNumber);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      // Return limited information for public access
      res.json({
        complaintNumber: complaint.complaintNumber,
        status: complaint.status,
        createdAt: complaint.createdAt,
        type: complaint.type,
        subject: complaint.subject
      });
    } catch (error) {
      console.error("Error fetching complaint:", error);
      res.status(500).json({ message: "Failed to fetch complaint" });
    }
  });

  // Admin-only routes
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.claims?.sub) {
      // Check if user is admin (this would be based on user role)
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  };

  // Admin Pages
  app.post('/api/admin/pages', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertPageSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub
      });
      const page = await storage.createPage(validatedData);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put('/api/admin/pages/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPageSchema.partial().parse(req.body);
      const page = await storage.updatePage(id, validatedData);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete('/api/admin/pages/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePage(id);
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Admin Videos
  app.post('/api/admin/videos', isAuthenticated, requireAdmin, upload.single('video'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Video file is required" });
      }

      const validatedData = insertVideoSchema.parse({
        ...req.body,
        fileName: req.file.filename,
        filePath: req.file.path,
        uploadedBy: req.user.claims.sub
      });
      
      const video = await storage.createVideo(validatedData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put('/api/admin/videos/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  // Admin Photos
  app.post('/api/admin/photos', isAuthenticated, requireAdmin, upload.single('photo'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Photo file is required" });
      }

      const validatedData = insertPhotoSchema.parse({
        ...req.body,
        fileName: req.file.filename,
        filePath: req.file.path,
        uploadedBy: req.user.claims.sub
      });
      
      const photo = await storage.createPhoto(validatedData);
      res.json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating photo:", error);
      res.status(500).json({ message: "Failed to create photo" });
    }
  });

  // Admin Complaints
  app.get('/api/admin/complaints', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      const complaints = await storage.getComplaints(status);
      res.json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.put('/api/admin/complaints/:id', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = {
        ...req.body,
        assignedTo: req.body.assignedTo || req.user.claims.sub
      };
      const complaint = await storage.updateComplaint(id, updateData);
      res.json(complaint);
    } catch (error) {
      console.error("Error updating complaint:", error);
      res.status(500).json({ message: "Failed to update complaint" });
    }
  });

  // Admin News
  app.post('/api/admin/news', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertNewsSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub
      });
      const news = await storage.createNews(validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating news:", error);
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
