import { useQuery } from "@tanstack/react-query";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { SeniorOfficer } from "@shared/schema";
import {
  Users,
  Shield,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";

export default function SeniorOfficersPage() {
  const { data: officers = [], isLoading } = useQuery<SeniorOfficer[]>({
    queryKey: ["/api/senior-officers"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />

      {/* Header Section */}
      <section className="page-hero-gradient text-white header-spacing pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Senior Officers</h1>
                <p className="text-xl text-gray-100">Leadership of Crime Investigation Department</p>
              </div>
            </div>
            <p className="text-lg text-gray-100 leading-relaxed">
              Meet the distinguished senior officers who lead the Crime Investigation Department 
              of Telangana State. Our leadership brings decades of experience in criminal investigation, 
              law enforcement, and public safety to ensure effective policing and justice delivery.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="xl" />
              <p className="mt-4 text-lg text-gray-600 font-medium">Loading senior officers...</p>
            </div>
          </div>
        ) : officers.length > 0 ? (
          <div className="space-y-8">
            {officers.map((officer) => (
              <Card key={officer.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                      {officer.photoPath ? (
                        <img
                          src={officer.photoPath}
                          alt={officer.name}
                          className="w-24 h-24 rounded-lg object-cover border-4 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                          <User className="h-12 w-12 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-gray-900 mb-2">
                          {officer.name}
                        </CardTitle>
                        <p className="text-lg font-semibold text-blue-600 mb-3">
                          {officer.position}
                        </p>
                        <div className="flex items-center">
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {officer.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Role & Responsibilities</h3>
                      <p className="text-gray-700 leading-relaxed">{officer.description}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    {officer.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Office Location</p>
                          <p className="font-medium">{officer.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {officer.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="font-medium">{officer.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {officer.email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="font-medium">{officer.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Senior Officers Information Available
              </h3>
              <p className="text-gray-600">
                Senior officers information is currently being updated. Please check back later.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}