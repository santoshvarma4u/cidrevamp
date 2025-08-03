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

interface HeaderProps {
  theme?: "original" | "teal" | "navy";
}

export default function Header({ theme = "original" }: HeaderProps) {
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

  // Get theme-specific classes
  const getHeaderThemeClasses = () => {
    switch (theme) {
      case "teal":
        return {
          headerBg: "bg-white shadow-sm border-b-2 border-teal-600",
          topBarBg: "bg-teal-800",
          navBg: "bg-white",
        };
      case "navy":
        return {
          headerBg: "bg-orange-50 shadow-sm border-b-2 border-blue-900",
          topBarBg: "bg-blue-900",
          navBg: "bg-orange-50",
        };
      default:
        return {
          headerBg: "bg-white shadow-sm border-b-2 border-blue-600",
          topBarBg: "bg-gray-800",
          navBg: "bg-white",
        };
    }
  };

  const headerTheme = getHeaderThemeClasses();

  return (
    <header className={headerTheme.headerBg}>
      {/* Top Bar */}
      <div className={`${headerTheme.topBarBg} text-white py-2`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Emergency: 100 (Press 8 for T-Safe)
              </span>
              <span className="hidden md:flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                help.tspolice@cgg.gov.in
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com/cidtelangana"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 hidden md:inline-flex items-center"
              >
                @CIDTelangana
              </a>
              <select className="bg-transparent border-none text-white text-sm">
                <option value="en">English</option>
                <option value="te">Telugu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={leftLogoSrc}
              alt="Government of Telangana"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Crime Investigation Department
              </h1>
              <p className="text-gray-600">Telangana State Police</p>
              <p className="text-sm text-gray-500">
                3rd Floor, DGP Office, Lakadikapul, Hyderabad-004
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <img
              src={rightLogoSrc}
              alt="Telangana State Police"
              className="w-16 h-16 object-contain mr-4"
            />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
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
                variant="outline"
                onClick={() => (window.location.href = "/admin/login")}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.href = "/";
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    HOME
                  </Button>

                  {/* Parent menu pages with potential submenus */}
                  {parentPages.map((page: any) => {
                    const childPages = getChildPages(page.slug);

                    return (
                      <div key={page.slug} className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-medium"
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
                            className="w-full justify-start pl-6 text-sm text-gray-600"
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
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <nav
        className={`${theme === "teal" ? "bg-teal-600" : theme === "navy" ? "bg-blue-900" : "bg-blue-600"} text-white hidden lg:block`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-start space-x-8 py-4">
            <Button
              variant="ghost"
              className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
              onClick={() => (window.location.href = "/")}
            >
              Home
            </Button>

            {/* Parent menu pages with dropdowns if they have children */}
            {parentPages.map((page: any) => {
              const childPages = getChildPages(page.slug);

              if (childPages.length > 0) {
                // Has children - render as dropdown with clickable parent
                return (
                  <div key={page.slug} className="relative inline-block">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
                        onClick={() => (window.location.href = `/${page.slug}`)}
                      >
                        {page.menuTitle || page.title}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-1 py-2"
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
                    className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
                    onClick={() => (window.location.href = `/${page.slug}`)}
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
