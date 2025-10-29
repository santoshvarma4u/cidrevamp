import { Link } from "wouter";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import vatinsLogoSrc from "@assets/vatins-logo.png";
import { ProtectedEmail } from "@/components/common/ProtectedEmail";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {/* CID Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CID Telangana</h3>
                <p className="text-gray-400 text-sm">
                  Crime Investigation Department
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Premier investigation agency of Telangana State committed to
              transparent, impartial, and efficient investigation using
              state-of-the-art technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition"
                >
                  About CID
                </Link>
              </li>
              <li>
                <Link
                  href="/economic-offences"
                  className="text-gray-300 hover:text-white transition"
                >
                  Economic Offences
                </Link>
              </li>
              <li>
                <Link
                  href="/cyber-crimes"
                  className="text-gray-300 hover:text-white transition"
                >
                  Cyber Crimes
                </Link>
              </li>
              <li>
                <Link
                  href="/women-child-protection"
                  className="text-gray-300 hover:text-white transition"
                >
                  Women Protection
                </Link>
              </li>
              <li>
                <Link
                  href="/general-offences"
                  className="text-gray-300 hover:text-white transition"
                >
                  General Offences
                </Link>
              </li>
              <li>
                <Link
                  href="/officers"
                  className="text-gray-300 hover:text-white transition"
                >
                  Senior Officers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">
                    Crime Investigation Department
                  </p>
                  <p className="text-gray-300">3rd Floor, DGP Office</p>
                  <p className="text-gray-300">
                    Lakadikapul, Hyderabad - 500004
                  </p>
                  <p className="text-gray-300">Telangana, India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <p className="text-gray-300">040-27852274/8172656333</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <ProtectedEmail 
                  email="adgcid-ts@tspolice.gov.in" 
                  method="image"
                  showIcon={false}
                  className="text-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 Crime Investigation Department, Telangana State Police.
                All rights reserved.
              </p>
            </div>
            
            {/* Powered by VATINS */}
            <div className="flex items-center space-x-3 text-gray-400">
              <span className="text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <img 
                  src={vatinsLogoSrc} 
                  alt="VATINS Logo" 
                  className="h-6 w-auto object-contain"
                />
                <span className="text-sm font-medium text-white">VATINS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
