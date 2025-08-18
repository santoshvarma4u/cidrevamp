import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMenuPages } from "@/hooks/useMenuPages";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import leftLogoSrc from "@assets/leftlogo_1753517979998.png";

export default function ModernHeader() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: menuPages = [], isLoading: menuLoading } = useMenuPages();

  // Get all menu pages and organize them hierarchically
  const pages = Array.isArray(menuPages) ? menuPages : [];
  const allMenuPages = pages.filter((page: any) => page.showInMenu);

  // Get parent pages (no menuParent)
  const parentPages = allMenuPages
    .filter((page: any) => !page.menuParent)
    .sort((a: any, b: any) => a.menuOrder - b.menuOrder);

  // Get child pages grouped by parent
  const getChildPages = (parentSlug: string) => {
    return allMenuPages
      .filter((page: any) => page.menuParent === parentSlug)
      .sort((a: any, b: any) => a.menuOrder - b.menuOrder);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Simple Top Navigation Bar like OSCORE */}
      <div className="text-white py-4 px-6 backdrop-blur-sm" style={{
        background: 'linear-gradient(135deg, #161D6F 0%, rgba(133, 244, 255, 0.9) 50%, #EFFFFD 100%)'
      }}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src={leftLogoSrc} 
                  alt="CID Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">CID Telangana</span>
              </div>
            </Link>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Home */}
              <Button
                variant="ghost"
                className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors px-3 py-2 font-semibold capitalize"
                onClick={() => (window.location.href = "/")}
              >
                Home
              </Button>

              {/* First 4 Main Menu Items */}
              {parentPages.slice(0, 4).map((page: any) => {
                const childPages = getChildPages(page.slug);

                if (childPages.length > 0) {
                  // Has children - render as dropdown with clickable parent
                  return (
                    <div key={page.slug} className="relative inline-block">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors px-3 py-2 font-semibold capitalize"
                          onClick={() => (window.location.href = `/${page.slug}`)}
                        >
                          {page.menuTitle || page.title}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors px-1 py-2"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {childPages.map((childPage: any) => (
                              <DropdownMenuItem
                                key={childPage.slug}
                                onClick={() =>
                                  (window.location.href = `/${childPage.slug}`)
                                }
                                className="capitalize"
                              >
                                {childPage.menuTitle || childPage.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                } else {
                  // No children - render as regular button
                  return (
                    <Button
                      key={page.slug}
                      variant="ghost"
                      className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors px-3 py-2 font-semibold capitalize"
                      onClick={() => (window.location.href = `/${page.slug}`)}
                    >
                      {page.menuTitle || page.title}
                    </Button>
                  );
                }
              })}

              {/* More Dropdown for Remaining Menu Items */}
              {parentPages.length > 4 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors flex items-center space-x-1 px-3 py-2 font-semibold capitalize"
                    >
                      <span>More</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {parentPages.slice(4).map((page: any) => {
                      const childPages = getChildPages(page.slug);
                      
                      return (
                        <div key={page.slug}>
                          <DropdownMenuItem
                            onClick={() => (window.location.href = `/${page.slug}`)}
                            className="font-medium capitalize"
                          >
                            {page.menuTitle || page.title}
                          </DropdownMenuItem>
                          {childPages.length > 0 && (
                            <div className="ml-4 border-l border-gray-200 pl-2">
                              {childPages.map((childPage: any) => (
                                <DropdownMenuItem
                                  key={childPage.slug}
                                  onClick={() =>
                                    (window.location.href = `/${childPage.slug}`)
                                  }
                                  className="text-sm text-gray-600 capitalize"
                                >
                                  {childPage.menuTitle || childPage.title}
                                </DropdownMenuItem>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Admin Menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors flex items-center space-x-2 px-3 py-2 font-semibold"
                    >
                      <User className="h-4 w-4" />
                      <span>{user.firstName || user.email}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === "admin" || user.role === "super_admin" ? (
                      <DropdownMenuItem
                        onClick={() => (window.location.href = "/admin")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onClick={() => (window.location.href = "/api/logout")}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  className="text-white hover:text-cyan-300 hover:bg-transparent transition-colors px-3 py-2 font-semibold"
                  onClick={() => (window.location.href = "/admin/login")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden text-white hover:text-cyan-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start capitalize"
                      onClick={() => {
                        window.location.href = "/";
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Home
                    </Button>

                    {/* Parent menu pages with potential submenus */}
                    {parentPages.map((page: any) => {
                      const childPages = getChildPages(page.slug);

                      return (
                        <div key={page.slug} className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-medium capitalize"
                            onClick={() => {
                              window.location.href = `/${page.slug}`;
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {page.menuTitle || page.title}
                          </Button>

                          {/* Child pages */}
                          {childPages.map((childPage: any) => (
                            <Button
                              key={childPage.slug}
                              variant="ghost"
                              className="w-full justify-start pl-6 text-sm text-gray-600 capitalize"
                              onClick={() => {
                                window.location.href = `/${childPage.slug}`;
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {childPage.menuTitle || childPage.title}
                            </Button>
                          ))}
                        </div>
                      );
                    })}

                    {/* Mobile Admin Menu */}
                    {isAuthenticated && user ? (
                      <>
                        {user.role === "admin" || user.role === "super_admin" ? (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.href = "/admin";
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.href = "/api/logout";
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          window.location.href = "/admin/login";
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}