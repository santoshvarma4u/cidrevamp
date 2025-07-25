import { Link } from "wouter";
import { Shield, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { title: "Lodge Complaint", href: "/citizen/complaint" },
    { title: "Check Status", href: "/citizen/status" },
    { title: "Missing Persons", href: "/citizen/missing-persons" },
    { title: "T-Safe App", href: "/citizen/t-safe" },
    { title: "Women Safety", href: "/wings/women-protection" },
  ];

  const specializedWings = [
    { title: "Economic Offences", href: "/wings/economic-offences" },
    { title: "Cyber Crimes", href: "/wings/cyber-crimes" },
    { title: "Women & Child Protection", href: "/wings/women-protection" },
    { title: "General Offences", href: "/wings/general-offences" },
    { title: "Civil Rights Protection", href: "/wings/protection-civil-rights" },
  ];

  const legalLinks = [
    { title: "Privacy Policy", href: "/legal/privacy" },
    { title: "Terms of Service", href: "/legal/terms" },
    { title: "Accessibility", href: "/legal/accessibility" },
    { title: "Site Map", href: "/sitemap" },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">CID Telangana</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Premier investigation agency providing transparent, impartial, and efficient 
              investigation services using state-of-the-art equipment with quality forensic support.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/cidtelangana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/cidtelangana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/cidtelangana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-white transition cursor-pointer">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialized Wings */}
          <div>
            <h4 className="text-lg font-bold mb-4">Specialized Wings</h4>
            <ul className="space-y-2">
              {specializedWings.map((wing) => (
                <li key={wing.href}>
                  <Link href={wing.href}>
                    <span className="text-gray-300 hover:text-white transition cursor-pointer">
                      {wing.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  3rd Floor, DGP Office<br />
                  Lakadikapul, Hyderabad-004<br />
                  Telangana State, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">
                  Emergency: 100 (Press 8 for T-Safe)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">
                  help.tspolice@cgg.gov.in
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ExternalLink className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">
                  cid.tspolice.gov.in
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Crime Investigation Department, Telangana State Police. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-gray-300 hover:text-white text-sm transition cursor-pointer">
                    {link.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Maintained by I.T Core Team Division | Last Updated: December 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
