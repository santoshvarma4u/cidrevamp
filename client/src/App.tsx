import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import Watermark from "@/components/layout/Watermark";

// Public pages
import Home from "@/pages/modern-home";
import NotFound from "@/pages/not-found";
import AdminAuth from "@/pages/admin/auth";
import GeneralOffences from "@/pages/wings/general-offences";
import WomenProtection from "@/pages/wings/women-protection";
import EconomicOffences from "@/pages/wings/economic-offences";
import CyberCrimes from "@/pages/wings/cyber-crimes";
import ComplaintForm from "@/pages/citizen/complaint";
import ComplaintStatus from "@/pages/citizen/status";
import OrganizationStructure from "@/pages/about/structure";
import MediaGallery from "@/pages/media/gallery";
import PhotoGallery from "@/pages/PhotoGallery";
import VideoGallery from "@/pages/VideoGallery";
import LinksPage from "@/pages/LinksPage";
import { RTIPage } from "@/pages/RTIPage";
import { ContactPage } from "@/pages/ContactPage";
import { AlertsPage } from "@/pages/AlertsPage";
import DynamicPage from "@/pages/dynamic-page";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminPages from "@/pages/admin/content/pages";
import AdminVideos from "@/pages/admin/content/videos";
import AdminPhotos from "@/pages/admin/content/photos";
import AdminNews from "@/pages/admin/content/news";
import AdminComplaints from "@/pages/admin/complaints/list";

import queryClient from "@/lib/queryClient";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/wings/general-offences" component={GeneralOffences} />
      <Route path="/wings/women-protection" component={WomenProtection} />
      <Route path="/wings/economic-offences" component={EconomicOffences} />
      <Route path="/wings/cyber-crimes" component={CyberCrimes} />
      <Route path="/citizen/complaint" component={ComplaintForm} />
      <Route path="/citizen/status" component={ComplaintStatus} />
      <Route path="/about/structure" component={OrganizationStructure} />
      <Route path="/media/gallery" component={MediaGallery} />
      <Route path="/photo-gallery" component={PhotoGallery} />
      <Route path="/video-gallery" component={VideoGallery} />
      <Route path="/links" component={LinksPage} />
      <Route path="/rti" component={RTIPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/alerts" component={AlertsPage} />

      {/* Admin auth route (public) */}
      <Route path="/admin/login" component={AdminAuth} />

      {/* Admin routes - must be before dynamic page route */}
      {isAuthenticated && isAdmin && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/content/pages" component={AdminPages} />
          <Route path="/admin/content/videos" component={AdminVideos} />
          <Route path="/admin/content/photos" component={AdminPhotos} />
          <Route path="/admin/content/news" component={AdminNews} />
          <Route path="/admin/complaints" component={AdminComplaints} />
        </>
      )}

      {/* Dynamic page route - must be LAST after all static routes */}
      <Route path="/:slug" component={DynamicPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Watermark type="pattern" opacity={0.015} size={120} />
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
