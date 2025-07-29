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

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: menuPages = [], isLoading: menuLoading } = useMenuPages();

  // Get all parent-level menu pages (no submenus)
  const pages = Array.isArray(menuPages) ? menuPages : [];
  const mainMenuPages = pages
    .filter((page: any) => page.showInMenu)
    .sort((a: any, b: any) => a.menuOrder - b.menuOrder);

  return (
    <header className="bg-white shadow-sm border-b-2 border-blue-600">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2">
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
                    Home
                  </Button>

                  {/* Main menu pages */}
                  {mainMenuPages.map((page: any) => (
                    <Button
                      key={page.slug}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        window.location.href = `/${page.slug}`;
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {page.menuTitle || page.title}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <nav className="bg-blue-600 text-white hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-start space-x-8 py-4">
            <Button
              variant="ghost"
              className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
              onClick={() => (window.location.href = "/")}
            >
              Home
            </Button>

            {/* Main menu pages */}
            {mainMenuPages.map((page: any) => (
              <Button
                key={page.slug}
                variant="ghost"
                className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
                onClick={() => (window.location.href = `/${page.slug}`)}
              >
                {page.menuTitle || page.title}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
