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
  Shield,
  Phone,
  Mail,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
  TriangleAlert,
  FileText,
  Search,
  Smartphone,
  ChartLine,
  Monitor,
  Heart,
  Gavel,
  Scale,
} from "lucide-react";
import leftLogoSrc from "@assets/leftlogo_1753517979998.png";
import rightLogoSrc from "@assets/police-logo_1753517995022.png";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: menuPages = [], isLoading: menuLoading } = useMenuPages();

  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description: "Financial frauds, banking frauds, FICN",
      href: "/wings/economic-offences",
      icon: ChartLine,
    },
    {
      title: "Cyber Crimes Wing",
      description: "IT Act violations, cyber security",
      href: "/wings/cyber-crimes",
      icon: Monitor,
    },
    {
      title: "Women & Child Protection",
      description: "Women safety, SHE teams, anti-trafficking",
      href: "/wings/women-protection",
      icon: Heart,
    },
    {
      title: "General Offences Wing",
      description: "Criminal investigations, murder cases",
      href: "/wings/general-offences",
      icon: Gavel,
    },
    {
      title: "Protection of Civil Rights",
      description: "Constitutional rights, discrimination",
      href: "/wings/protection-civil-rights",
      icon: Scale,
    },
  ];

  const citizenServices = [
    { title: "Lodge Complaint/Petition", href: "/citizen/complaint" },
    { title: "Check Complaint Status", href: "/citizen/status" },
    { title: "FIR Services", href: "/citizen/fir" },
    { title: "Missing Persons Report", href: "/citizen/missing-persons" },
    { title: "T-Safe App Services", href: "/citizen/t-safe" },
    { title: "Emergency Helplines", href: "/citizen/helplines" },
  ];

  const aboutLinks = [
    { title: "About CID", href: "/about/history" },
    { title: "Organization Structure", href: "/about/structure" },
    { title: "Senior Officers", href: "/about/leadership" },
    { title: "FAQ's", href: "/about/faqs" },
  ];

  // Helper function to organize menu pages by group
  const getMenuPagesByGroup = (group: string) => {
    const pages = Array.isArray(menuPages) ? menuPages : [];
    return pages
      .filter((page: any) => page.menuParent === group)
      .sort((a: any, b: any) => a.menuOrder - b.menuOrder)
      .map((page: any) => ({
        title: page.menuTitle || page.title,
        description: page.menuDescription || "",
        href: `/${page.slug}`,
      }));
  };

  // Get top-level menu pages (no parent group)
  const pages = Array.isArray(menuPages) ? menuPages : [];
  const topLevelPages = pages
    .filter((page: any) => !page.menuParent || page.menuParent === "" || page.menuParent === "top-level")
    .sort((a: any, b: any) => a.menuOrder - b.menuOrder);

  // Dynamically build menu groups by merging static and dynamic pages
  const dynamicAboutPages = getMenuPagesByGroup("about");
  const dynamicWingsPages = getMenuPagesByGroup("wings");
  const dynamicCitizenPages = getMenuPagesByGroup("citizen-services");
  const dynamicMediaPages = getMenuPagesByGroup("media");
  const dynamicContactPages = getMenuPagesByGroup("contact");

  // Merge with existing static items
  const allAboutPages = [...aboutLinks, ...dynamicAboutPages];
  const allWingsPages = [...specializedWings, ...dynamicWingsPages];
  const allCitizenPages = [...citizenServices, ...dynamicCitizenPages];
  const allMediaPages = [...dynamicMediaPages];
  const allContactPages = [...dynamicContactPages];

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

                  {/* Top-level pages */}
                  {topLevelPages.map((page: any) => (
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

                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-500 px-3">
                      About CID
                    </p>
                    {allAboutPages.map((link) => (
                      <Button
                        key={link.href}
                        variant="ghost"
                        className="w-full justify-start text-sm pl-6"
                        onClick={() => {
                          window.location.href = link.href;
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {link.title}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-500 px-3">
                      Specialized Wings
                    </p>
                    {allWingsPages.map((wing) => (
                      <Button
                        key={wing.href}
                        variant="ghost"
                        className="w-full justify-start text-sm pl-6"
                        onClick={() => {
                          window.location.href = wing.href;
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {(wing as any).icon && React.createElement((wing as any).icon, { className: "mr-2 h-4 w-4" })}
                        {wing.title}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-500 px-3">
                      Citizen Services
                    </p>
                    {allCitizenPages.map((service) => (
                      <Button
                        key={service.href}
                        variant="ghost"
                        className="w-full justify-start text-sm pl-6"
                        onClick={() => {
                          window.location.href = service.href;
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {service.title}
                      </Button>
                    ))}
                  </div>

                  {allMediaPages.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-gray-500 px-3">
                        Media & Resources
                      </p>
                      {allMediaPages.map((media) => (
                        <Button
                          key={media.href}
                          variant="ghost"
                          className="w-full justify-start text-sm pl-6"
                          onClick={() => {
                            window.location.href = media.href;
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {media.title}
                        </Button>
                      ))}
                    </div>
                  )}

                  {allContactPages.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-gray-500 px-3">
                        Contact & Information
                      </p>
                      {allContactPages.map((contact) => (
                        <Button
                          key={contact.href}
                          variant="ghost"
                          className="w-full justify-start text-sm pl-6"
                          onClick={() => {
                            window.location.href = contact.href;
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {contact.title}
                        </Button>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.href = "/media/gallery";
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Media Center
                  </Button>
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

            {/* Top-level pages */}
            {topLevelPages.map((page: any) => (
              <Button
                key={page.slug}
                variant="ghost"
                className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
                onClick={() => (window.location.href = `/${page.slug}`)}
              >
                {page.menuTitle || page.title}
              </Button>
            ))}

            {allAboutPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2">
                    About CID
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-2">
                  {allAboutPages.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      className="px-4 py-2 hover:bg-gray-100 rounded transition cursor-pointer"
                      onClick={() => (window.location.href = link.href)}
                    >
                      {link.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {allWingsPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2">
                    Specialized Wings
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 p-2">
                  {allWingsPages.map((wing) => (
                    <DropdownMenuItem
                      key={wing.href}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-100 rounded transition cursor-pointer"
                      onClick={() => (window.location.href = wing.href)}
                    >
                      {(wing as any).icon && React.createElement((wing as any).icon, { className: "h-5 w-5 text-gray-600 mt-0.5" })}
                      <div>
                        <div className="font-medium text-gray-900 hover:text-blue-600">
                          {wing.title}
                        </div>
                        {wing.description && (
                          <div className="text-sm text-gray-600">
                            {wing.description}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {allCitizenPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2">
                    Citizen Services
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-2">
                  {allCitizenPages.map((service) => (
                    <DropdownMenuItem
                      key={service.href}
                      className="px-4 py-2 hover:bg-gray-100 rounded transition cursor-pointer"
                      onClick={() => (window.location.href = service.href)}
                    >
                      {service.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {allMediaPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2">
                    Media & Resources
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-2">
                  {allMediaPages.map((media) => (
                    <DropdownMenuItem
                      key={media.href}
                      className="px-4 py-2 hover:bg-gray-100 rounded transition cursor-pointer"
                      onClick={() => (window.location.href = media.href)}
                    >
                      {media.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {allContactPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2">
                    Contact & Information
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-2">
                  {allContactPages.map((contact) => (
                    <DropdownMenuItem
                      key={contact.href}
                      className="px-4 py-2 hover:bg-gray-100 rounded transition cursor-pointer"
                      onClick={() => (window.location.href = contact.href)}
                    >
                      {contact.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              className="text-white hover:text-blue-200 hover:bg-blue-700 transition px-3 py-2"
              onClick={() => (window.location.href = "/media/gallery")}
            >
              Media Center
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
