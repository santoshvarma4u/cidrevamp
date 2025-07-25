import { Link } from "wouter";
import { Shield, Phone, Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="text-white h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">CID Telangana</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Premier investigation agency providing transparent, impartial, and efficient investigation services.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/CIDTelangana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/citizen/complaint" className="text-gray-300 hover:text-white transition-colors">
                  Lodge Complaint
                </Link>
              </li>
              <li>
                <Link href="/citizen/status" className="text-gray-300 hover:text-white transition-colors">
                  Check Status
                </Link>
              </li>
              <li>
                <Link href="/citizen/missing" className="text-gray-300 hover:text-white transition-colors">
                  Missing Persons
                </Link>
              </li>
              <li>
                <Link href="/citizen/tsafe" className="text-gray-300 hover:text-white transition-colors">
                  T-Safe App
                </Link>
              </li>
              <li>
                <Link href="/wings/women-protection" className="text-gray-300 hover:text-white transition-colors">
                  Women Safety
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Specialized Wings</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/wings/economic-offences" className="text-gray-300 hover:text-white transition-colors">
                  Economic Offences
                </Link>
              </li>
              <li>
                <Link href="/wings/cyber-crimes" className="text-gray-300 hover:text-white transition-colors">
                  Cyber Crimes
                </Link>
              </li>
              <li>
                <Link href="/wings/women-protection" className="text-gray-300 hover:text-white transition-colors">
                  Women & Child Protection
                </Link>
              </li>
              <li>
                <Link href="/wings/general-offences" className="text-gray-300 hover:text-white transition-colors">
                  General Offences
                </Link>
              </li>
              <li>
                <Link href="/wings/civil-rights" className="text-gray-300 hover:text-white transition-colors">
                  Civil Rights Protection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-blue-400 mt-1 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  3rd Floor, DGP Office, Lakadikapul, Hyderabad-004
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-400 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Emergency: 100 (Press 8 for T-Safe)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-400 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 text-sm">help.tspolice@cgg.gov.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-blue-400 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 text-sm">cid.tspolice.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Crime Investigation Department, Telangana State Police. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-gray-300 hover:text-white text-sm transition-colors">
                Accessibility
              </Link>
              <Link href="/sitemap" className="text-gray-300 hover:text-white text-sm transition-colors">
                Site Map
              </Link>
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
