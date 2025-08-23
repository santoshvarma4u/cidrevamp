import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import { Users } from "lucide-react";
import { SeniorOfficersAdmin } from "./SeniorOfficersAdmin";
import LoadingSpinner from "@/components/ui/loading-spinner";

export function SeniorOfficersManagement() {
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
            <div className="text-center">
              <LoadingSpinner size="xl" />
              <div className="mt-4 text-lg">Loading senior officers management...</div>
            </div>
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
                <Users className="h-6 w-6" />
                Senior Officers Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage senior officers information, photos, and display order
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <SeniorOfficersAdmin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}