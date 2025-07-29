import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Phone,
  Mail,
  Menu,
  Shield,
  AlertTriangle,
  FileText,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description: "Financial frauds, banking frauds, FICN",
      href: "/wings/economic-offences",
    },
    {
      title: "Cyber Crimes Wing",
      description: "IT Act violations, cyber security",
      href: "/wings/cyber-crimes",
    },
    {
      title: "Women & Child Protection",
      description: "Women safety, SHE teams, anti-trafficking",
      href: "/wings/women-protection",
    },
    {
      title: "General Offences Wing",
      description: "Criminal investigations, murder cases",
      href: "/wings/general-offences",
    },
    {
      title: "Protection of Civil Rights",
      description: "Constitutional rights, discrimination",
      href: "/wings/civil-rights",
    },
  ];

  const aboutPages = [
    { title: "CID History & Background", href: "/about/history" },
    { title: "Organization Structure", href: "/about/structure" },
    { title: "Mission & Vision", href: "/about/mission" },
    { title: "Leadership & Officers", href: "/about/leadership" },
    { title: "Contact Information", href: "/about/contact" },
  ];

  const citizenServices = [
    { title: "Lodge Complaint/Petition", href: "/citizen/complaint" },
    { title: "Check Complaint Status", href: "/citizen/status" },
    { title: "FIR Services", href: "/citizen/fir" },
    { title: "Missing Persons Report", href: "/citizen/missing" },
    { title: "T-Safe App Services", href: "/citizen/tsafe" },
    { title: "Emergency Helplines", href: "/citizen/helplines" },
  ];

  return (
    <header className="bg-white shadow-sm border-b-2 border-blue-600">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Emergency: 100 (Press 8 for T-Safe)
              </span>
              <span className="hidden md:flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                help.tspolice@cgg.gov.in
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com/CIDTelangana"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition-colors"
              >
                @CIDTelangana
              </a>
              <select className="bg-transparent border-none text-white text-sm focus:outline-none">
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
              <Shield className="text-white h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Crime Investigation Department
              </h1>
              <p className="text-gray-600">Telangana State Police</p>
              <p className="text-sm text-gray-500 hidden md:block">
                3rd Floor, DGP Office, Lakadikapul, Hyderabad-004
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency
            </Button>
            <Link href="/citizen/complaint">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Lodge Complaint
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none"
                    >
                      Home
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-blue-700">
                      About
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-80 gap-1 p-4 bg-white text-gray-900">
                        {aboutPages.map((page) => (
                          <li key={page.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={page.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {page.title}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-blue-700">
                      Specialized Wings
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-96 gap-1 p-4 bg-white text-gray-900">
                        {specializedWings.map((wing) => (
                          <li key={wing.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={wing.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {wing.title}
                                </div>
                                <p className="line-clamp-2 text-xs leading-snug text-gray-600">
                                  {wing.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-blue-700">
                      Citizen Services
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-80 gap-1 p-4 bg-white text-gray-900">
                        {citizenServices.map((service) => (
                          <li key={service.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={service.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {service.title}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/public-awareness"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none"
                    >
                      Public Awareness
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/media/photos"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none"
                    >
                      Media Center
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-blue-700"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                    >
                      Home
                    </Button>
                  </Link>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      About CID
                    </h3>
                    <div className="space-y-1 ml-4">
                      {aboutPages.map((page) => (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left"
                          >
                            {page.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Specialized Wings
                    </h3>
                    <div className="space-y-1 ml-4">
                      {specializedWings.map((wing) => (
                        <Link
                          key={wing.href}
                          href={wing.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left"
                          >
                            {wing.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Citizen Services
                    </h3>
                    <div className="space-y-1 ml-4">
                      {citizenServices.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left"
                          >
                            {service.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
