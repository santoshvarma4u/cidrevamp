import ModernHeader from "@/components/layout/ModernHeader";
import { AlertTriangle, Shield, Check, X, Users, FileText, Globe, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Alert } from "@shared/schema";

// Icon mapping for dynamic icons
const iconMap = {
  AlertTriangle,
  Shield,
  Users,
  Building,
  Globe,
};

export function AlertsPage() {
  const { data: cyberSafetyTopics = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/cyber-safety"],
    retry: false,
  });

  const { data: womenChildrenSafety = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/women-children"],
    retry: false,
  });

  const { data: safetyTopics = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/general-safety"],
    retry: false,
  });

  const { data: dosAlerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/dos"],
    retry: false,
  });

  const { data: dontsAlerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/donts"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      
      <main className="header-spacing pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 cid-nav-text">
              Public Safety Alerts
            </h1>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto">
              Important safety information and guidelines to protect yourself and your community
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Suspicious Objects Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Do's & Don'ts for Suspicious Objects</h2>
              </div>

              {/* DO's Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Check className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-2xl font-bold text-primary">DO's</h3>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    {dosAlerts.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item.content || item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* DON'Ts Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <X className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-2xl font-bold text-red-700">DON'Ts</h3>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    {dontsAlerts.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item.content || item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="text-lg font-semibold text-orange-800">Emergency Contact</h4>
                </div>
                <p className="text-orange-700">
                  In case of emergency, immediately dial <strong className="text-xl">100</strong> for police assistance
                </p>
              </div>
            </div>
          </div>

          {/* Additional Safety Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Helpline</h3>
              <p className="text-3xl font-bold text-orange-600">100</p>
              <p className="text-gray-600 mt-2">Police Emergency</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Women Helpline</h3>
              <p className="text-3xl font-bold text-purple-600">1091</p>
              <p className="text-gray-600 mt-2">24/7 Support</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cyber Crime</h3>
              <p className="text-3xl font-bold text-blue-600">1930</p>
              <p className="text-gray-600 mt-2">Cyber Helpline</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}