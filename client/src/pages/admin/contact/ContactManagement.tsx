import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import { Building, Users, Phone } from "lucide-react";
import { RegionalOfficesAdmin } from "./RegionalOfficesAdmin";
import { DepartmentContactsAdmin } from "./DepartmentContactsAdmin";

type TabType = "offices" | "contacts";

export function ContactManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("offices");
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center p-8">
            <div className="text-lg">Loading contact management...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="h-6 w-6" />
                Contact Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage regional offices and department contact information
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 rounded-t-lg">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("offices")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "offices"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                data-testid="tab-regional-offices"
              >
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Regional Offices
                </div>
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "contacts"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                data-testid="tab-department-contacts"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Department Contacts
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "offices" && <RegionalOfficesAdmin />}
            {activeTab === "contacts" && <DepartmentContactsAdmin />}
          </div>
        </div>
      </div>
    </div>
  );
}