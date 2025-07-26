import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { title: "CID History & Background", href: "/about/history" },
    { title: "Organization Structure", href: "/about/structure" },
    { title: "Mission & Vision", href: "/about/mission" },
    { title: "Leadership & Officers", href: "/about/leadership" },
    { title: "Contact Information", href: "/about/contact" },
  ];

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
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crime Investigation Department</h1>
              <p className="text-gray-600">Telangana State Police</p>
              <p className="text-sm text-gray-500">3rd Floor, DGP Office, Lakadikapul, Hyderabad-004</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => window.location.href = 'tel:100'}
            >
              <TriangleAlert className="mr-2 h-4 w-4" />
              Emergency
            </Button>
            <Link href="/citizen/complaint">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Lodge Complaint
              </Button>
            </Link>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.firstName || user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === 'admin' || user.role === 'super_admin' ? (
                    <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/api/login'}
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
                      window.location.href = '/';
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </Button>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-500 px-3">About CID</p>
                    {aboutLinks.map((link) => (
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
                    <p className="font-medium text-sm text-gray-500 px-3">Specialized Wings</p>
                    {specializedWings.map((wing) => (
                      <Button 
                        key={wing.href}
                        variant="ghost" 
                        className="w-full justify-start text-sm pl-6"
                        onClick={() => {
                          window.location.href = wing.href;
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <wing.icon className="mr-2 h-4 w-4" />
                        {wing.title}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-500 px-3">Citizen Services</p>
                    {citizenServices.map((service) => (
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

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.href = '/media/gallery';
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
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="space-x-8 py-4">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-white hover:text-blue-200 transition px-3 py-2 cursor-pointer"
                  onClick={() => window.location.href = '/'}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-blue-200 bg-transparent hover:bg-blue-700">
                  About CID
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-80 p-4">
                    {aboutLinks.map((link) => (
                      <NavigationMenuLink 
                        key={link.href}
                        className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-900 rounded transition cursor-pointer"
                        onClick={() => window.location.href = link.href}
                      >
                        {link.title}
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-blue-200 bg-transparent hover:bg-blue-700">
                  Specialized Wings
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-96 p-4">
                    {specializedWings.map((wing) => (
                      <NavigationMenuLink 
                        key={wing.href}
                        className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-100 rounded transition group cursor-pointer"
                        onClick={() => window.location.href = wing.href}
                      >
                        <wing.icon className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-600">
                            {wing.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {wing.description}
                          </div>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-blue-200 bg-transparent hover:bg-blue-700">
                  Citizen Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-80 p-4">
                    {citizenServices.map((service) => (
                      <NavigationMenuLink 
                        key={service.href}
                        className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-900 rounded transition cursor-pointer"
                        onClick={() => window.location.href = service.href}
                      >
                        {service.title}
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-white hover:text-blue-200 transition px-3 py-2 cursor-pointer"
                  onClick={() => window.location.href = '/public-awareness'}
                >
                  Public Awareness
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-white hover:text-blue-200 transition px-3 py-2 cursor-pointer"
                  onClick={() => window.location.href = '/media/gallery'}
                >
                  Media Center
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    </header>
  );
}
