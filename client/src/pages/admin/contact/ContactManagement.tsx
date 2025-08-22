import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Users } from "lucide-react";
import { RegionalOfficesAdmin } from "./RegionalOfficesAdmin";
import { DepartmentContactsAdmin } from "./DepartmentContactsAdmin";

type TabType = "offices" | "contacts";

export function ContactManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("offices");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
              <p className="mt-2 text-gray-600">
                Manage regional offices and department contact information
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8">
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
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "offices" && <RegionalOfficesAdmin />}
        {activeTab === "contacts" && <DepartmentContactsAdmin />}
      </div>
    </div>
  );
}