import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { setupLogManagementRoutes } from "./logManagement";
import { setupEmailProtectionRoutes, emailProtectionMiddleware, initializeEmailProtection } from "./emailProtection";
import { 
  initializeFileUploadSecurity, 
  createSecureUpload, 
  enhancedFileValidation,
  getFileUploadStats,
  clearUploadTracking
} from "./fileUploadSecurity";
import {
  insertPageSchema,
  insertVideoSchema,
  insertPhotoSchema,
  insertComplaintSchema,
  insertNewsSchema,
  insertNewsTickerSchema,
  insertDirectorInfoSchema,
  insertWingSchema,
  insertRegionalOfficeSchema,
  insertDepartmentContactSchema,
  insertSeniorOfficerSchema,
  insertAlertSchema,
  insertNclContentSchema,
} from "@shared/schema";
import { generateCaptcha, verifyCaptcha, refreshCaptcha } from "./captcha";
import { getPublicKey, decryptPassword, initializePasswordEncryption, isPasswordEncryptionEnabled } from "./passwordEncryption";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { unlockAccount, unlockAllAccounts, getLockedAccounts, isAccountLocked } from "./security";

// Enhanced file upload security
const secureImageUpload = createSecureUpload('images');
const secureDocumentUpload = createSecureUpload('documents');
const secureVideoUpload = createSecureUpload('videos');

// Helper function to safely parse dates
const safeParseDate = (dateValue: any): Date | null => {
  if (!dateValue || dateValue === "") return null;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date value:", dateValue);
      return null;
    }
    return date;
  } catch (error) {
    console.error("Error parsing date:", dateValue, error);
    return null;
  }
};

// Input validation middleware
const validateInput = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use("/api/uploads", express.static("uploads"));

  // Health check endpoint for Docker
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "CID Telangana Web Application",
    });
  });

  // CAPTCHA endpoints - Enhanced security
  // Password encryption public key endpoint
  app.get("/api/auth/public-key", async (req, res) => {
    try {
      if (!isPasswordEncryptionEnabled()) {
        return res.status(404).json({ message: "Password encryption not enabled" });
      }

      const publicKeyPem = await getPublicKey();
      res.json({ publicKeyPem });
    } catch (error) {
      console.error("Error getting public key:", error);
      res.status(500).json({ message: "Failed to get encryption public key" });
    }
  });

  app.get("/api/captcha", (req, res) => {
    try {
      // Security: Pass IP address for rate limiting
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const captcha = generateCaptcha(clientIp);
      
      if (!captcha) {
        // Rate limit exceeded
        return res.status(429).json({ 
          message: "Too many CAPTCHA requests. Please try again later." 
        });
      }
      
      // Security: Only return session ID and SVG image (no plaintext data)
      res.json(captcha);
    } catch (error) {
      console.error("Error generating CAPTCHA:", error);
      res.status(500).json({ message: "Failed to generate CAPTCHA" });
    }
  });

  app.post("/api/captcha/verify", (req, res) => {
    try {
      const { sessionId, userInput } = req.body;

      if (!sessionId || !userInput) {
        return res
          .status(400)
          .json({ message: "Session ID and user input are required" });
      }

      // Security: Pass IP address for verification
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const isValid = verifyCaptcha(sessionId, userInput, clientIp, false);
      
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Error verifying CAPTCHA:", error);
      res.status(500).json({ message: "Failed to verify CAPTCHA" });
    }
  });

  app.post("/api/captcha/refresh", (req, res) => {
    try {
      const { sessionId } = req.body;
      
      // Security: Pass IP address for rate limiting
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const newCaptcha = refreshCaptcha(sessionId, clientIp);

      if (!newCaptcha) {
        // Rate limit exceeded or other error
        return res.status(429).json({ 
          message: "Too many CAPTCHA refresh requests. Please try again later." 
        });
      }

      res.json(newCaptcha);
    } catch (error) {
      console.error("Error refreshing CAPTCHA:", error);
      res.status(500).json({ message: "Failed to refresh CAPTCHA" });
    }
  });

  // Serve static files from uploads directory
  app.use("/uploads", express.static("uploads"));
  app.use("/uploads/images", express.static("uploads/images"));
  app.use("/uploads/documents", express.static("uploads/documents"));
  app.use("/uploads/videos", express.static("uploads/videos"));

  // Auth middleware
  await setupAuth(app);
  
  // Log management routes
  setupLogManagementRoutes(app);
  
  // Email protection system
  initializeEmailProtection();
  setupEmailProtectionRoutes(app);
  
  // File upload security system
  initializeFileUploadSecurity();
  
  // Email protection middleware for API responses
  app.use('/api', emailProtectionMiddleware);

  // Image upload endpoint for rich text editor
  app.post(
    "/api/upload/image",
    requireAuth,
    secureImageUpload.single("image"),
    enhancedFileValidation,
    (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }

        // Return the file URL
        const imageUrl = `/uploads/images/${req.file.filename}`;
        res.json({
          url: imageUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          category: 'images',
        });
      } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ message: "Failed to upload image" });
      }
    },
  );

  // Document upload endpoint
  app.post(
    "/api/upload/document",
    requireAuth,
    secureDocumentUpload.single("document"),
    enhancedFileValidation,
    (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No document file provided" });
        }

        const documentUrl = `/uploads/documents/${req.file.filename}`;
        res.json({
          url: documentUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          category: 'documents',
        });
      } catch (error) {
        console.error("Document upload error:", error);
        res.status(500).json({ message: "Failed to upload document" });
      }
    },
  );

  // Video upload endpoint
  app.post(
    "/api/upload/video",
    requireAuth,
    secureVideoUpload.single("video"),
    enhancedFileValidation,
    (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No video file provided" });
        }

        const videoUrl = `/uploads/videos/${req.file.filename}`;
        res.json({
          url: videoUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          category: 'videos',
        });
      } catch (error) {
        console.error("Video upload error:", error);
        res.status(500).json({ message: "Failed to upload video" });
      }
    },
  );

  // File upload statistics endpoint
  app.get("/api/admin/upload/stats", requireAdmin, (req, res) => {
    try {
      const stats = getFileUploadStats();
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error getting upload stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get upload statistics",
      });
    }
  });

  // Clear upload tracking endpoint
  app.post("/api/admin/upload/clear-tracking", requireAdmin, (req, res) => {
    try {
      clearUploadTracking();
      res.json({
        success: true,
        message: "Upload tracking cleared successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error clearing upload tracking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to clear upload tracking",
      });
    }
  });

  // Public routes are now handled in setupAuth()

  // Public API routes

  // Pages
  app.get("/api/pages", async (req, res) => {
    try {
      let published: boolean | undefined = undefined;

      if (req.query.published === "true") {
        published = true;
      } else if (req.query.published === "false") {
        published = false;
      }
      // If no published query param, get all pages

      const pages = await storage.getPages(published);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Menu pages endpoint
  app.get("/api/pages/menu", async (req, res) => {
    try {
      const menuPages = await storage.getMenuPages();
      res.json(menuPages);
    } catch (error) {
      console.error("Error fetching menu pages:", error);
      res.status(500).json({ message: "Failed to fetch menu pages" });
    }
  });

  app.get("/api/pages/slug/:slug", async (req, res) => {
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
  app.get("/api/videos", async (req, res) => {
    try {
      let published: boolean | undefined = undefined;

      // Only filter by published status if explicitly requested
      if (req.query.published === "true") {
        published = true;
      } else if (req.query.published === "false") {
        published = false;
      }
      // If no published query param, return all videos (both published and draft)

      const videos = await storage.getVideos(published);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Photos
  app.get("/api/photos", async (req, res) => {
    try {
      let published: boolean | undefined = undefined;
      const category = req.query.category as string;

      // Only filter by published status if explicitly requested
      if (req.query.published === "true") {
        published = true;
      } else if (req.query.published === "false") {
        published = false;
      }

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
  app.get("/api/photo-albums", async (req, res) => {
    try {
      const published = req.query.published === "true";
      const albums = await storage.getPhotoAlbums(published);
      res.json(albums);
    } catch (error) {
      console.error("Error fetching photo albums:", error);
      res.status(500).json({ message: "Failed to fetch photo albums" });
    }
  });

  // News
  app.get("/api/news", async (req, res) => {
    try {
      // If published query param is explicitly set, filter by it
      // Otherwise, return all news (for admin panel)
      const published = req.query.published
        ? req.query.published === "true"
        : undefined;
      const news = await storage.getAllNews(published);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // News ticker routes
  app.get("/api/news-ticker", async (req, res) => {
    try {
      const tickers = await storage.getActiveNewsTickers();
      res.json(tickers);
    } catch (error) {
      console.error("Error fetching news tickers:", error);
      res.status(500).json({ message: "Failed to fetch news tickers" });
    }
  });

  // Complaints - Public
  app.post("/api/complaints", async (req, res) => {
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      res.json(complaint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating complaint:", error);
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  app.get("/api/complaints/number/:complaintNumber", async (req, res) => {
    try {
      const complaint = await storage.getComplaintByNumber(
        req.params.complaintNumber,
      );
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      // Return limited information for public access
      res.json({
        complaintNumber: complaint.complaintNumber,
        status: complaint.status,
        createdAt: complaint.createdAt,
        type: complaint.type,
        subject: complaint.subject,
      });
    } catch (error) {
      console.error("Error fetching complaint:", error);
      res.status(500).json({ message: "Failed to fetch complaint" });
    }
  });

  // Admin-only routes (using imported requireAdmin middleware from auth.ts)

  // Admin Pages
  app.post("/api/admin/pages", requireAdmin, async (req: any, res) => {
    try {
      // Process request body to handle empty strings for nullable fields and convert date strings
      const processedBody = {
        ...req.body,
        displayUntilDate: safeParseDate(req.body.displayUntilDate),
        menuParent: req.body.menuParent === "" ? null : req.body.menuParent,
        menuLocation: req.body.menuLocation || "more", // Default to "more" if not provided
        metaTitle: req.body.metaTitle === "" ? null : req.body.metaTitle,
        metaDescription:
          req.body.metaDescription === "" ? null : req.body.metaDescription,
        menuTitle: req.body.menuTitle === "" ? null : req.body.menuTitle,
        menuDescription:
          req.body.menuDescription === "" ? null : req.body.menuDescription,
        authorId: req.user.id,
      };

      const validatedData = insertPageSchema.parse(processedBody);
      const page = await storage.createPage(validatedData);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put("/api/admin/pages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      console.log("Received update request for page ID:", id);
      console.log("Raw request body:", JSON.stringify(req.body, null, 2));

      // Process request body to handle empty strings for nullable fields and convert date strings
      const processedBody = {
        ...req.body,
        displayUntilDate: safeParseDate(req.body.displayUntilDate),
        menuParent: req.body.menuParent === "" ? null : req.body.menuParent,
        menuLocation: req.body.menuLocation || "more", // Default to "more" if not provided
        metaTitle: req.body.metaTitle === "" ? null : req.body.metaTitle,
        metaDescription:
          req.body.metaDescription === "" ? null : req.body.metaDescription,
        menuTitle: req.body.menuTitle === "" ? null : req.body.menuTitle,
        menuDescription:
          req.body.menuDescription === "" ? null : req.body.menuDescription,
      };

      console.log("Processed body:", JSON.stringify(processedBody, null, 2));

      const validatedData = insertPageSchema.partial().parse(processedBody);
      console.log("Validation successful, updating page...");
      const page = await storage.updatePage(id, validatedData);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Validation errors:",
          JSON.stringify(error.errors, null, 2),
        );
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", requireAdmin, async (req, res) => {
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
  app.post(
    "/api/admin/videos",
    requireAdmin,
    secureVideoUpload.single("video"),
    enhancedFileValidation,
    async (req: any, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Video file is required" });
        }

        const validatedData = insertVideoSchema.parse({
          title: req.body.title,
          description: req.body.description || "",
          category: req.body.category || "news",
          isPublished: req.body.isPublished === "true",
          displayOrder: parseInt(req.body.displayOrder) || 0,
          fileName: req.file.filename,
          filePath: req.file.path,
          uploadedBy: req.user.id,
        });

        const video = await storage.createVideo(validatedData);
        res.json(video);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error creating video:", error);
        res.status(500).json({ message: "Failed to create video" });
      }
    },
  );

  app.put("/api/admin/videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete("/api/admin/videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVideo(id);
      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Admin Photos
  app.post(
    "/api/admin/photos",
    requireAdmin,
    secureImageUpload.single("photo"),
    enhancedFileValidation,
    async (req: any, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Photo file is required" });
        }

        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const validatedData = insertPhotoSchema.parse({
          title: req.body.title,
          description: req.body.description || "",
          category: req.body.category || "operations",
          isPublished: req.body.isPublished === "true",
          displayOrder: parseInt(req.body.displayOrder) || 0,
          fileName: req.file.filename,
          filePath: req.file.path,
          uploadedBy: req.user.id,
        });

        console.log("Creating photo with data:", validatedData);
        const photo = await storage.createPhoto(validatedData);
        console.log("Created photo:", photo);
        res.json(photo);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error:", error.errors);
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error creating photo:", error);
        res.status(500).json({ message: "Failed to create photo" });
      }
    },
  );

  app.put("/api/admin/photos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPhotoSchema.partial().parse(req.body);
      const photo = await storage.updatePhoto(id, validatedData);
      res.json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating photo:", error);
      res.status(500).json({ message: "Failed to update photo" });
    }
  });

  app.delete("/api/admin/photos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePhoto(id);
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  app.put("/api/admin/photos/:id/order", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { displayOrder } = req.body;

      if (typeof displayOrder !== "number") {
        return res
          .status(400)
          .json({ message: "Display order must be a number" });
      }

      const photo = await storage.updatePhotoOrder(id, displayOrder);
      res.json(photo);
    } catch (error) {
      console.error("Error updating photo order:", error);
      res.status(500).json({ message: "Failed to update photo order" });
    }
  });

  // Admin Complaints
  app.get("/api/admin/complaints", requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      const complaints = await storage.getComplaints(status);
      res.json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.put("/api/admin/complaints/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = {
        ...req.body,
        assignedTo: req.body.assignedTo || req.user.id,
      };
      const complaint = await storage.updateComplaint(id, updateData);
      res.json(complaint);
    } catch (error) {
      console.error("Error updating complaint:", error);
      res.status(500).json({ message: "Failed to update complaint" });
    }
  });

  // Admin News
  app.post("/api/news", requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertNewsSchema.parse({
        ...req.body,
        authorId: req.user.id,
      });
      const news = await storage.createNews(validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating news:", error);
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  app.patch("/api/news/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating news:", error);
      res.status(500).json({ message: "Failed to update news" });
    }
  });

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNews(id);
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  // Admin News Ticker routes
  app.get("/api/admin/news-ticker", requireAdmin, async (req, res) => {
    try {
      const tickers = await storage.getAllNewsTickers();
      res.json(tickers);
    } catch (error) {
      console.error("Error fetching news tickers:", error);
      res.status(500).json({ message: "Failed to fetch news tickers" });
    }
  });

  app.post("/api/admin/news-ticker", requireAdmin, async (req: any, res) => {
    try {
      const processedBody = {
        ...req.body,
        startDate: safeParseDate(req.body.startDate),
        endDate: safeParseDate(req.body.endDate),
        createdBy: req.user.id,
      };
      const validatedData = insertNewsTickerSchema.parse(processedBody);
      const ticker = await storage.createNewsTicker(validatedData);
      res.json(ticker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating news ticker:", error);
      res.status(500).json({ message: "Failed to create news ticker" });
    }
  });

  app.patch(
    "/api/admin/news-ticker/:id",
    requireAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const processedBody = {
          ...req.body,
          startDate: req.body.startDate !== undefined ? safeParseDate(req.body.startDate) : undefined,
          endDate: req.body.endDate !== undefined ? safeParseDate(req.body.endDate) : undefined,
        };
        const validatedData = insertNewsTickerSchema.partial().parse(processedBody);
        const ticker = await storage.updateNewsTicker(id, validatedData);
        res.json(ticker);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error updating news ticker:", error);
        res.status(500).json({ message: "Failed to update news ticker" });
      }
    },
  );

  app.delete("/api/admin/news-ticker/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNewsTicker(id);
      res.json({ message: "News ticker deleted successfully" });
    } catch (error) {
      console.error("Error deleting news ticker:", error);
      res.status(500).json({ message: "Failed to delete news ticker" });
    }
  });

  // Director Information endpoints
  app.get("/api/director-info", async (req, res) => {
    try {
      const directorInfo = await storage.getDirectorInfo();
      res.json(directorInfo);
    } catch (error) {
      console.error("Error fetching director info:", error);
      res.status(500).json({ message: "Failed to fetch director information" });
    }
  });

  app.get("/api/admin/director-info", requireAdmin, async (req, res) => {
    try {
      const allDirectorInfo = await storage.getAllDirectorInfo();
      res.json(allDirectorInfo);
    } catch (error) {
      console.error("Error fetching all director info:", error);
      res.status(500).json({ message: "Failed to fetch director information" });
    }
  });

  app.post(
    "/api/admin/director-info",
    requireAdmin,
    secureImageUpload.single("photo"),
    enhancedFileValidation,
    async (req: any, res) => {
      try {
        const validatedData = insertDirectorInfoSchema.parse({
          name: req.body.name,
          title: req.body.title || "Director General of Police",
          message: req.body.message,
          photoPath: req.file ? req.file.path : undefined,
          isActive: req.body.isActive !== "false",
        });

        const directorInfo = await storage.createDirectorInfo(validatedData);
        res.json(directorInfo);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error creating director info:", error);
        res
          .status(500)
          .json({ message: "Failed to create director information" });
      }
    },
  );

  app.put(
    "/api/admin/director-info/:id",
    requireAdmin,
    secureImageUpload.single("photo"),
    enhancedFileValidation,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const updateData: any = {
          name: req.body.name,
          title: req.body.title,
          message: req.body.message,
          isActive: req.body.isActive !== "false",
        };

        if (req.file) {
          updateData.photoPath = req.file.path;
        }

        const validatedData = insertDirectorInfoSchema
          .partial()
          .parse(updateData);
        const directorInfo = await storage.updateDirectorInfo(
          id,
          validatedData,
        );
        res.json(directorInfo);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error updating director info:", error);
        res
          .status(500)
          .json({ message: "Failed to update director information" });
      }
    },
  );

  app.delete("/api/admin/director-info/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDirectorInfo(id);
      res.json({ message: "Director information deleted successfully" });
    } catch (error) {
      console.error("Error deleting director info:", error);
      res
        .status(500)
        .json({ message: "Failed to delete director information" });
    }
  });

  // Wings management routes
  app.get("/api/wings", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const wings = await storage.getWings(activeOnly);
      res.json(wings);
    } catch (error) {
      console.error("Error fetching wings:", error);
      res.status(500).json({ message: "Failed to fetch wings" });
    }
  });

  app.get("/api/admin/wings", requireAdmin, async (req, res) => {
    try {
      const wings = await storage.getWings(false); // Get all wings for admin
      res.json(wings);
    } catch (error) {
      console.error("Error fetching wings:", error);
      res.status(500).json({ message: "Failed to fetch wings" });
    }
  });

  app.post("/api/admin/wings", requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertWingSchema.parse(req.body);
      const wing = await storage.createWing(validatedData);
      res.json(wing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating wing:", error);
      res.status(500).json({ message: "Failed to create wing" });
    }
  });

  app.put("/api/admin/wings/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWingSchema.partial().parse(req.body);
      const wing = await storage.updateWing(id, validatedData);
      res.json(wing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating wing:", error);
      res.status(500).json({ message: "Failed to update wing" });
    }
  });

  app.delete("/api/admin/wings/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteWing(id);
      res.json({ message: "Wing deleted successfully" });
    } catch (error) {
      console.error("Error deleting wing:", error);
      res.status(500).json({ message: "Failed to delete wing" });
    }
  });

  // Contact management routes
  app.get("/api/contact/regional-offices", async (req, res) => {
    try {
      const offices = await storage.getRegionalOffices(true);
      res.json(offices);
    } catch (error) {
      console.error("Error fetching regional offices:", error);
      res.status(500).json({ message: "Failed to fetch regional offices" });
    }
  });

  app.get("/api/contact/department-contacts", async (req, res) => {
    try {
      const contacts = await storage.getDepartmentContacts(true);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching department contacts:", error);
      res.status(500).json({ message: "Failed to fetch department contacts" });
    }
  });

  // Admin routes for contact management
  app.get("/api/admin/regional-offices", requireAdmin, async (req, res) => {
    try {
      const offices = await storage.getRegionalOffices();
      res.json(offices);
    } catch (error) {
      console.error("Error fetching regional offices:", error);
      res.status(500).json({ message: "Failed to fetch regional offices" });
    }
  });

  app.post(
    "/api/admin/regional-offices",
    requireAdmin,
    async (req: any, res) => {
      try {
        const validatedData = insertRegionalOfficeSchema.parse(req.body);
        const office = await storage.createRegionalOffice(validatedData);
        res.json(office);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error creating regional office:", error);
        res.status(500).json({ message: "Failed to create regional office" });
      }
    },
  );

  app.put(
    "/api/admin/regional-offices/:id",
    requireAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertRegionalOfficeSchema
          .partial()
          .parse(req.body);
        const office = await storage.updateRegionalOffice(id, validatedData);
        res.json(office);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error updating regional office:", error);
        res.status(500).json({ message: "Failed to update regional office" });
      }
    },
  );

  app.delete(
    "/api/admin/regional-offices/:id",
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteRegionalOffice(id);
        res.json({ message: "Regional office deleted successfully" });
      } catch (error) {
        console.error("Error deleting regional office:", error);
        res.status(500).json({ message: "Failed to delete regional office" });
      }
    },
  );

  app.get("/api/admin/department-contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getDepartmentContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching department contacts:", error);
      res.status(500).json({ message: "Failed to fetch department contacts" });
    }
  });

  app.post(
    "/api/admin/department-contacts",
    requireAdmin,
    async (req: any, res) => {
      try {
        const validatedData = insertDepartmentContactSchema.parse(req.body);
        const contact = await storage.createDepartmentContact(validatedData);
        res.json(contact);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error creating department contact:", error);
        res
          .status(500)
          .json({ message: "Failed to create department contact" });
      }
    },
  );

  app.put(
    "/api/admin/department-contacts/:id",
    requireAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertDepartmentContactSchema
          .partial()
          .parse(req.body);
        const contact = await storage.updateDepartmentContact(
          id,
          validatedData,
        );
        res.json(contact);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error updating department contact:", error);
        res
          .status(500)
          .json({ message: "Failed to update department contact" });
      }
    },
  );

  app.delete(
    "/api/admin/department-contacts/:id",
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteDepartmentContact(id);
        res.json({ message: "Department contact deleted successfully" });
      } catch (error) {
        console.error("Error deleting department contact:", error);
        res
          .status(500)
          .json({ message: "Failed to delete department contact" });
      }
    },
  );

  // Senior Officers admin routes
  app.get("/api/admin/senior-officers", requireAdmin, async (req, res) => {
    try {
      const officers = await storage.getSeniorOfficers();
      res.json(officers);
    } catch (error) {
      console.error("Error fetching senior officers:", error);
      res.status(500).json({ message: "Failed to fetch senior officers" });
    }
  });

  app.post(
    "/api/admin/senior-officers",
    requireAdmin,
    secureImageUpload.single("photo"),
    enhancedFileValidation,
    async (req: any, res) => {
      try {
        const data = { ...req.body };
        if (req.file) {
          data.photoPath = "/api/uploads/" + req.file.filename;
        }

        // Convert FormData strings back to proper types
        if (data.displayOrder !== undefined) {
          data.displayOrder = parseInt(data.displayOrder) || 0;
        }
        if (data.isActive !== undefined) {
          data.isActive = data.isActive === "true";
        }

        const validatedData = insertSeniorOfficerSchema.parse(data);
        const officer = await storage.createSeniorOfficer(validatedData);
        res.json(officer);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error creating senior officer:", error);
        res.status(500).json({ message: "Failed to create senior officer" });
      }
    },
  );

  app.put(
    "/api/admin/senior-officers/:id",
    requireAdmin,
    secureImageUpload.single("photo"),
    enhancedFileValidation,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const data = { ...req.body };
        if (req.file) {
          data.photoPath = "/api/uploads/" + req.file.filename;
        }

        // Convert FormData strings back to proper types
        if (data.displayOrder !== undefined) {
          data.displayOrder = parseInt(data.displayOrder) || 0;
        }
        if (data.isActive !== undefined) {
          data.isActive = data.isActive === "true";
        }

        const validatedData = insertSeniorOfficerSchema.partial().parse(data);
        const officer = await storage.updateSeniorOfficer(id, validatedData);
        res.json(officer);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid data", errors: error.errors });
        }
        console.error("Error updating senior officer:", error);
        res.status(500).json({ message: "Failed to update senior officer" });
      }
    },
  );

  app.delete(
    "/api/admin/senior-officers/:id",
    requireAdmin,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await storage.deleteSeniorOfficer(id);
        res.json({ message: "Senior officer deleted successfully" });
      } catch (error) {
        console.error("Error deleting senior officer:", error);
        res.status(500).json({ message: "Failed to delete senior officer" });
      }
    },
  );

  // Public senior officers route
  app.get("/api/senior-officers", async (req, res) => {
    try {
      const officers = await storage.getSeniorOfficers(true); // Only active officers
      res.json(officers);
    } catch (error) {
      console.error("Error fetching public senior officers:", error);
      res.status(500).json({ message: "Failed to fetch senior officers" });
    }
  });

  // Alerts routes - Public API
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts(true); // Only active alerts for public
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const alerts = await storage.getAlertsByCategory(category, true); // Only active alerts for public
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts by category:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Alerts routes - Admin API
  app.get("/api/admin/alerts", requireAdmin, async (req, res) => {
    try {
      const alerts = await storage.getAlerts(); // All alerts for admin
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/admin/alerts", requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating alert:", error);
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.put("/api/admin/alerts/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAlertSchema.partial().parse(req.body);
      const alert = await storage.updateAlert(id, validatedData);
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating alert:", error);
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  app.delete("/api/admin/alerts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAlert(id);
      res.json({ message: "Alert deleted successfully" });
    } catch (error) {
      console.error("Error deleting alert:", error);
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // NCL Content routes - Public API
  app.get("/api/ncl-content", async (req, res) => {
    try {
      const content = await storage.getActiveNclContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching NCL content:", error);
      res.status(500).json({ message: "Failed to fetch NCL content" });
    }
  });

  // NCL Content routes - Admin API
  app.get("/api/admin/ncl-content", requireAdmin, async (req, res) => {
    try {
      const content = await storage.getAllNclContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching NCL content:", error);
      res.status(500).json({ message: "Failed to fetch NCL content" });
    }
  });

  app.post("/api/admin/ncl-content", requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertNclContentSchema.parse(req.body);
      const content = await storage.createNclContent(validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating NCL content:", error);
      res.status(500).json({ message: "Failed to create NCL content" });
    }
  });

  app.put("/api/admin/ncl-content/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNclContentSchema.partial().parse(req.body);
      const content = await storage.updateNclContent(id, validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating NCL content:", error);
      res.status(500).json({ message: "Failed to update NCL content" });
    }
  });

  app.delete("/api/admin/ncl-content/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNclContent(id);
      res.json({ message: "NCL content deleted successfully" });
    } catch (error) {
      console.error("Error deleting NCL content:", error);
      res.status(500).json({ message: "Failed to delete NCL content" });
    }
  });


  // Admin routes for account lockout management
  app.get("/api/admin/locked-accounts", requireAdmin, async (req, res) => {
    try {
      const lockedAccounts = getLockedAccounts();
      res.json(lockedAccounts);
    } catch (error) {
      console.error("Error getting locked accounts:", error);
      res.status(500).json({ message: "Failed to get locked accounts" });
    }
  });

  app.post("/api/admin/unlock-account", requireAdmin, async (req, res) => {
    try {
      const { identifier } = req.body;
      if (!identifier) {
        return res.status(400).json({ message: "Identifier is required" });
      }
      const unlocked = unlockAccount(identifier);
      if (unlocked) {
        res.json({ message: `Account ${identifier} unlocked successfully` });
      } else {
        res.json({ message: `Account ${identifier} was not locked or does not exist` });
      }
    } catch (error) {
      console.error("Error unlocking account:", error);
      res.status(500).json({ message: "Failed to unlock account" });
    }
  });

  app.post("/api/admin/unlock-all-accounts", requireAdmin, async (req, res) => {
    try {
      const count = unlockAllAccounts();
      res.json({ message: `Successfully unlocked ${count} accounts` });
    } catch (error) {
      console.error("Error unlocking all accounts:", error);
      res.status(500).json({ message: "Failed to unlock all accounts" });
    }
  });
  // Initialize password encryption system
  initializePasswordEncryption().catch(error => {
    console.error('Failed to initialize password encryption:', error);
  });

  const httpServer = createServer(app);
  return httpServer;
}
