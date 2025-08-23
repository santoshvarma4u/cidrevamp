import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { SeniorOfficer } from "@shared/schema";
import {
  Users,
  Shield,
  Building,
  MapPin,
  Phone,
  Mail,
  ChartLine,
  Gavel,
  Heart,
  Monitor,
  Scale,
  Target,
  Award,
  Clock,
} from "lucide-react";

export default function OrganizationStructure() {
  // Fetch senior officers from API
  const { data: leadership = [], isLoading: officersLoading } = useQuery<SeniorOfficer[]>({
    queryKey: ["/api/senior-officers"],
  });

  // Fallback data in case API fails
  const fallbackLeadership = [
    {
      position: "Director General of Police (DGP)",
      name: "Dr. Jitender",
      description: "Heads the CID department and oversees all investigation operations",
      location: "Police Directorate, Hyderabad",
    },
    {
      position: "Additional Director General of Police",
      name: "CID Operations",
      description: "Supervises specialized wings and major investigation operations",
      location: "DGP Office, Lakadikapul",
    },
  ];

  const specializedWings = [
    {
      name: "Economic Offences Wing",
      head: "SP (Economic Offences)",
      jurisdiction: "Financial frauds, Banking frauds, FICN, MLM schemes",
      established: "1995",
      icon: ChartLine,
      color: "blue",
    },
    {
      name: "Cyber Crimes Wing",
      head: "SP (Cyber Crimes)",
      jurisdiction: "IT Act violations, Cyber crimes, Video piracy",
      established: "2005",
      icon: Monitor,
      color: "purple",
    },
    {
      name: "Women & Child Protection Wing",
      head: "SP (Women Safety)",
      jurisdiction: "Women safety, Child protection, Anti-trafficking",
      established: "2018",
      icon: Heart,
      color: "pink",
    },
    {
      name: "General Offences Wing",
      head: "SP (General Offences)",
      jurisdiction: "Murder, Robbery, Serious crimes, Inter-district cases",
      established: "1985",
      icon: Gavel,
      color: "gray",
    },
    {
      name: "Protection of Civil Rights Wing",
      head: "SP (Civil Rights)",
      jurisdiction: "Constitutional rights, Discrimination cases",
      established: "1990",
      icon: Scale,
      color: "green",
    },
  ];

  const districts = [
    "Hyderabad", "Cyberabad", "Rachakonda", "Warangal", "Karimnagar",
    "Nizamabad", "Adilabad", "Khammam", "Nalgonda", "Mahbubnagar",
    "Rangareddy", "Medak", "Sangareddy", "Siddipet", "Kamareddy",
    "Rajanna Sircilla", "Jayashankar Bhupalpally", "Mancherial", "Peddapalli",
    "Jagitial", "Vikarabad", "Medchal-Malkajgiri", "Bhadradri Kothagudem",
    "Mahabubabad", "Warangal Rural", "Jangaon", "Yadadri Bhuvanagiri",
    "Suryapet", "Nagarkurnool", "Wanaparthy", "Narayanpet", "Gadwal", "Jogulamba Gadwal"
  ];

  const keyFunctions = [
    {
      title: "Crime Investigation",
      description: "Specialized investigation of serious crimes using advanced forensic techniques",
      icon: Target,
    },
    {
      title: "Intelligence Gathering",
      description: "Collection and analysis of criminal intelligence for preventive action",
      icon: Shield,
    },
    {
      title: "Inter-State Coordination",
      description: "Coordination with other state police forces for multi-jurisdictional cases",
      icon: Users,
    },
    {
      title: "Training & Development",
      description: "Capacity building and training programs for investigation officers",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />

      {/* Header Section */}
      <section className="page-hero-gradient text-white header-spacing pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Organization Structure</h1>
                <p className="text-xl text-gray-100">Crime Investigation Department - Telangana State</p>
              </div>
            </div>
            <p className="text-lg text-gray-100 leading-relaxed">
              The CID operates under a structured hierarchy with specialized wings handling different 
              types of criminal investigations. Our organization spans across 33 revenue districts of 
              Telangana State with coordinated operations and centralized command.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Leadership Structure */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Senior Officers Directory</h2>
          {officersLoading ? (
            <div className="text-center py-8">
              <div className="text-lg">Loading senior officers...</div>
            </div>
          ) : leadership.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {leadership.map((leader) => (
                <Card key={leader.id} className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-4 text-center h-full flex flex-col">
                    {/* Photo */}
                    <div className="mb-4">
                      {leader.photoPath ? (
                        <img
                          src={leader.photoPath}
                          alt={leader.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-blue-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-sm">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      {leader.name}
                    </h3>
                    
                    {/* Position */}
                    <p className="text-sm font-semibold text-blue-600 mb-3 leading-snug">
                      {leader.position}
                    </p>
                    
                    {/* Description */}
                    {leader.description && (
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                        {leader.description}
                      </p>
                    )}
                    
                    {/* Contact Info */}
                    <div className="space-y-1 text-xs text-gray-500 mt-auto">
                      {leader.phone && (
                        <div className="flex items-center justify-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{leader.phone}</span>
                        </div>
                      )}
                      {leader.email && (
                        <div className="flex items-center justify-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{leader.email}</span>
                        </div>
                      )}
                      {leader.location && (
                        <div className="flex items-center justify-center space-x-1 mt-2">
                          <MapPin className="h-3 w-3" />
                          <span className="text-center text-xs leading-tight">{leader.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Fallback to hardcoded data if no dynamic data available
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackLeadership.map((leader, index) => (
                <Card key={`fallback-${index}`} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                          {leader.name}
                        </CardTitle>
                        <p className="text-sm font-semibold text-blue-600">{leader.position}</p>
                      </div>
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ml-3">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{leader.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{leader.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Specialized Wings */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Specialized Wings</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {specializedWings.map((wing, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-${wing.color}-100 p-2 rounded-lg`}>
                        <wing.icon className={`h-6 w-6 text-${wing.color}-600`} />
                      </div>
                      <span>{wing.name}</span>
                    </div>
                    <Badge variant="outline">Est. {wing.established}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department Head</p>
                      <p className="font-semibold">{wing.head}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Jurisdiction</p>
                      <p className="text-gray-700">{wing.jurisdiction}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Functions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Functions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFunctions.map((func, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <func.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{func.title}</h3>
                  <p className="text-sm text-gray-600">{func.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Geographical Coverage */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-6 w-6" />
                <span>Geographical Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The CID operates across all 33 revenue districts of Telangana State, ensuring comprehensive 
                coverage for criminal investigations and law enforcement activities.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {districts.map((district, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-3 text-center">
                    <span className="text-sm font-medium text-gray-700">{district}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Administrative Information */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-6 w-6" />
                  <span>Headquarters Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-semibold">Main Office</p>
                      <p className="text-gray-600">
                        3rd Floor, DGP Office<br />
                        Lakadikapul, Hyderabad-004<br />
                        Telangana State, India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-semibold">Contact Numbers</p>
                      <p className="text-gray-600">
                        Emergency: 100<br />
                        Main Office: +91-40-2761-5000<br />
                        Control Room: +91-40-2761-5100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">help.tspolice@cgg.gov.in</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6" />
                  <span>Operational Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Office Hours</p>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed (Emergency services available)</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Emergency Services</p>
                    <p className="text-gray-600">24/7 emergency response available through 100</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Public Services</p>
                    <div className="text-gray-600 space-y-1">
                      <p>Complaint registration: Online & Offline</p>
                      <p>Status inquiry: Available during office hours</p>
                      <p>Information requests: Subject to verification</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission Statement */}
        <section>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
              <p className="text-lg text-blue-800 leading-relaxed max-w-4xl mx-auto">
                To provide transparent, impartial, efficient and systematic investigation using high-end, 
                state-of-the-art equipment with quality forensic support, ensuring justice and safety for 
                all citizens of Telangana State.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
