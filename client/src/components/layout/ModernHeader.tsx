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
    <header className="shadow-sm border-b border-border fixed top-0 left-0 right-0 z-50" style={{background: 'linear-gradient(90deg, #672676 0%, rgba(103, 38, 118, 0.95) 50%, #020104 100%)'}}>
      {/* Top Bar */}
      <div className="text-primary-foreground py-2">
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
                      className="text-primary-foreground hover:text-primary-foreground/80"
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
                    className="text-primary-foreground hover:text-primary-foreground/80"
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
      <div className="py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Logo */}
            <div className="flex-shrink-0 hidden md:block">
              <img
                src={leftLogoSrc}
                alt="Telangana Government"
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain drop-shadow-md"
                data-testid="telangana-logo"
              />
            </div>

            {/* Center Title - Modern Design */}
            <div className="flex-1 text-center px-4 md:px-6">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent leading-tight tracking-tight">
                CID
              </h1>
              <h2 className="text-sm md:text-lg lg:text-xl font-semibold text-card-foreground mt-1 tracking-wide">
                Crime Investigation Department
              </h2>
              <p className="text-xs md:text-base text-muted-foreground mt-1 font-medium">
                Telangana State Police
              </p>
              <p className="text-xs md:text-sm text-muted-foreground/80 mt-1 hidden sm:block">
                3rd Floor, DGP Office, Lakadikapul, Hyderabad-004
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0 hidden md:block">
              <img
                src={rightLogoSrc}
                alt="Telangana State Police"
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain drop-shadow-md"
                data-testid="police-logo"
              />
            </div>

            {/* Mobile Logo - Only on Small Screens */}
            <div className="flex-shrink-0 md:hidden">
              <img
                src={rightLogoSrc}
                alt="Telangana State Police"
                className="h-12 w-12 object-contain drop-shadow-md"
                data-testid="mobile-police-logo"
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:bg-primary/10 rounded-lg">
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

      {/* Modern Navigation Menu */}
      <nav className="text-primary-foreground hidden lg:block shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-1 py-3">
            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-white/10 transition-all duration-300 px-6 py-3 rounded-lg font-medium text-sm uppercase tracking-wide"
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
                        className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-white/10 transition-all duration-300 px-6 py-3 rounded-lg font-medium text-sm uppercase tracking-wide"
                        data-testid={`nav-${page.slug}`}
                      >
                        {page.menuTitle || page.title}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white shadow-xl border-0 rounded-xl p-2 min-w-[200px]">
                      {childPages.map((child: any) => (
                        <DropdownMenuItem key={child.slug} asChild>
                          <Link 
                            href={`/${child.slug}`}
                            className="cursor-pointer text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg px-3 py-2 font-medium transition-all duration-200"
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
                    className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-white/10 transition-all duration-300 px-6 py-3 rounded-lg font-medium text-sm uppercase tracking-wide"
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