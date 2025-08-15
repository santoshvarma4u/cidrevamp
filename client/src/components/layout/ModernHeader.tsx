import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
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
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Simple Top Navigation Bar like OSCORE */}
      <div className="bg-purple-900/95 backdrop-blur-sm text-white py-4 px-6">
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
                <span className="text-xl font-bold">CID TELANGANA</span>
              </div>
            </Link>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about/structure">
                <span className="text-white hover:text-cyan-300 transition-colors cursor-pointer">About</span>
              </Link>
              <Link href="/wings/cyber-crimes">
                <span className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Cyber Crimes</span>
              </Link>
              <Link href="/wings/economic-offences">
                <span className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Economic Offences</span>
              </Link>
              <Link href="/citizen/complaint">
                <span className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Report Crime</span>
              </Link>
              <Link href="/contact">
                <span className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Contact</span>
              </Link>
              
              {/* Admin Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-cyan-300"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user?.username}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:text-cyan-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-purple-700">
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="/about/structure">
                  <span className="block text-white hover:text-cyan-300 transition-colors py-2">About</span>
                </Link>
                <Link href="/wings/cyber-crimes">
                  <span className="block text-white hover:text-cyan-300 transition-colors py-2">Cyber Crimes</span>
                </Link>
                <Link href="/wings/economic-offences">
                  <span className="block text-white hover:text-cyan-300 transition-colors py-2">Economic Offences</span>
                </Link>
                <Link href="/citizen/complaint">
                  <span className="block text-white hover:text-cyan-300 transition-colors py-2">Report Crime</span>
                </Link>
                <Link href="/contact">
                  <span className="block text-white hover:text-cyan-300 transition-colors py-2">Contact</span>
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link href="/admin">
                      <span className="block text-white hover:text-cyan-300 transition-colors py-2">Admin Dashboard</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-left text-white hover:text-cyan-300 transition-colors py-2"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}