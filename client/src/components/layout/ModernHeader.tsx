import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMenuPages } from "@/hooks/useMenuPages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import leftLogoSrc from "@assets/leftlogo_1753517979998.png";
import rightLogoSrc from "@assets/police-logo_1753517995022.png";

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

  // Get child pages for each parent
  const getChildPages = (parentSlug: string) => {
    return allMenuPages
      .filter((page: any) => page.menuParent === parentSlug)
      .sort((a: any, b: any) => a.menuOrder - b.menuOrder);
  };

  return (
    <header className="bg-card shadow-sm border-b border-border fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Emergency: 100 | CID: 040-27852294</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>cid@tspolice.gov.in</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white/80"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user?.username}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        fetch("/api/auth/logout", { method: "POST" });
                        window.location.reload();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/admin/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white/80"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-card py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Logo */}
            <div className="flex-shrink-0">
              <img
                src={leftLogoSrc}
                alt="Telangana Government"
                className="h-20 w-20 object-contain"
                data-testid="telangana-logo"
              />
            </div>

            {/* Center Title */}
            <div className="flex-1 text-center px-6">
              <h1 className="text-3xl md:text-4xl font-bold text-card-foreground leading-tight">
                Crime Investigation Department
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Telangana State Police
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                3rd Floor, DGP Office, Lakadikapul, Hyderabad-004
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0">
              <img
                src={rightLogoSrc}
                alt="Telangana State Police"
                className="h-20 w-20 object-contain"
                data-testid="police-logo"
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="py-6">
                    <div className="space-y-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg font-semibold"
                        onClick={() => {
                          window.location.href = "/";
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        HOME
                      </Button>
                      {parentPages.map((page: any) => {
                        const childPages = getChildPages(page.slug);
                        
                        return (
                          <div key={page.slug} className="space-y-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-lg font-semibold"
                              onClick={() => {
                                if (childPages.length === 0) {
                                  window.location.href = `/${page.slug}`;
                                  setIsMobileMenuOpen(false);
                                }
                              }}
                            >
                              {page.menuTitle || page.title}
                              {childPages.length > 0 && <ChevronDown className="h-4 w-4 ml-auto" />}
                            </Button>
                            {childPages.length > 0 && (
                              <div className="ml-4 space-y-1">
                                {childPages.map((child: any) => (
                                  <Button
                                    key={child.slug}
                                    variant="ghost"
                                    className="w-full justify-start text-sm"
                                    onClick={() => {
                                      window.location.href = `/${child.slug}`;
                                      setIsMobileMenuOpen(false);
                                    }}
                                  >
                                    {child.menuTitle || child.title}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <nav className="bg-teal-700 text-white hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-start space-x-8 py-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white/90 hover:bg-teal-600/50 transition px-3 py-2"
              onClick={() => (window.location.href = "/")}
              data-testid="nav-home"
            >
              HOME
            </Button>

            {parentPages.map((page: any) => {
              const childPages = getChildPages(page.slug);
              
              if (childPages.length > 0) {
                // Parent page with dropdown
                return (
                  <DropdownMenu key={page.slug}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-white hover:text-white/90 hover:bg-teal-600/50 transition px-3 py-2"
                        data-testid={`nav-${page.slug}`}
                      >
                        {page.menuTitle || page.title}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      {childPages.map((child: any) => (
                        <DropdownMenuItem key={child.slug} asChild>
                          <Link 
                            href={`/${child.slug}`}
                            className="cursor-pointer"
                          >
                            {child.menuTitle || child.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else {
                // Single page without dropdown  
                return (
                  <Button
                    key={page.slug}
                    variant="ghost"
                    className="text-white hover:text-white/90 hover:bg-teal-600/50 transition px-3 py-2"
                    onClick={() => (window.location.href = `/${page.slug}`)}
                    data-testid={`nav-${page.slug}`}
                  >
                    {page.menuTitle || page.title}
                  </Button>
                );
              }
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}