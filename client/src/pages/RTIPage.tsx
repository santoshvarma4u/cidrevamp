import { useQuery } from "@tanstack/react-query";
import ModernHeader from "@/components/layout/ModernHeader";
import { Shield, Phone, Users, Building, ExternalLink } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export function RTIPage() {
  const { data: officers = [], isLoading: officersLoading } = useQuery({
    queryKey: ["/api/rti/officers"],
  });

  const { data: payScales = [], isLoading: payScalesLoading } = useQuery({
    queryKey: ["/api/rti/pay-scales"],
  });

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      
      <main className="header-spacing pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 cid-nav-text">
              Right To Information (RTI)
            </h1>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto">
              If you want any information under Right To Information (RTI) ACT 2005, contact the public information officers listed below.
            </p>
          </div>

          {/* RTI Officers Section */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">RTI Officers</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="border border-gray-300 px-4 py-3 text-left">S.No</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Name of Officer</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Name & Designation of Public Information Officer</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Office Telephone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officersLoading ? (
                      <tr>
                        <td colSpan={4} className="border border-gray-300 px-4 py-8 text-center">
                          <LoadingSpinner size="md" className="mx-auto" />
                        </td>
                      </tr>
                    ) : Array.isArray(officers) && officers.length > 0 ? (
                      officers.map((officer: any) => (
                        <tr key={officer.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                            {officer.sno}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                            {officer.category}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-900">{officer.name}</p>
                              <p className="text-gray-700">{officer.designation}</p>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-primary mr-2" />
                              <span className="font-mono">{officer.phone || "N/A"}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                          No RTI officers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Staff Scale of Pay Section */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Staff Scale Of Pay</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="border border-gray-300 px-3 py-3 text-center">Sl. No</th>
                      <th className="border border-gray-300 px-3 py-3 text-left">Category</th>
                      <th className="border border-gray-300 px-3 py-3 text-center">Scale of Pay</th>
                      <th className="border border-gray-300 px-3 py-3 text-center">'6' Years SGP Scale</th>
                      <th className="border border-gray-300 px-3 py-3 text-center">'12' & '18' Years<br />SPP-I(A) & SPP-I (B) Scale</th>
                      <th className="border border-gray-300 px-3 py-3 text-center">'24' Years SPP-II</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payScalesLoading ? (
                      <tr>
                        <td colSpan={6} className="border border-gray-300 px-3 py-8 text-center">
                          <LoadingSpinner size="md" className="mx-auto" />
                        </td>
                      </tr>
                    ) : Array.isArray(payScales) && payScales.length > 0 ? (
                      payScales.map((scale: any) => (
                        <tr key={scale.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                            {scale.sno}.
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-left">
                            {scale.category}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                            {scale.basicPay || "------"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                            {scale.sgp6 || "------"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                            {scale.spp12_18 || "------"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                            {scale.spp24 || "------"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="border border-gray-300 px-3 py-8 text-center text-gray-500">
                          No pay scales found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Online RTI Application */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Online RTI Application</h2>
              </div>
              
              <div className="flex items-center space-x-4 p-6 bg-purple-50 rounded-lg">
                <ExternalLink className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-gray-700 mb-2">
                    You can file a complaint online through the official RTI portal:
                  </p>
                  <a 
                    href="https://rtionline.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    https://rtionline.gov.in/
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RTI Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About Right to Information Act 2005</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                The Right to Information Act, 2005 (RTI Act) is an Act of the Parliament of India which sets out the rules and procedures regarding citizens' right to information. It replaced the Freedom of Information Act, 2002.
              </p>
              <p className="text-gray-700 mb-4">
                Under this Act, any citizen can request information from a "public authority" which is required to reply expeditiously or within thirty days. The Act also requires every public authority to computerize their records for wide dissemination and to proactively publish certain categories of information so that the citizens need minimum recourse to request for information formally.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Important Points:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Application fee: ₹10 (for BPL citizens: No fee)</li>
                  <li>Response time: 30 days (48 hours for life and liberty matters)</li>
                  <li>Appeal process: First appeal to Appellate Authority, Second appeal to Information Commission</li>
                  <li>Penalty for delay: ₹250 per day (maximum ₹25,000)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}