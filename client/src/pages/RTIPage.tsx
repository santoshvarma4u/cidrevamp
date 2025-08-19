import ModernHeader from "@/components/layout/ModernHeader";
import { Shield, Phone, Users, Building, ExternalLink } from "lucide-react";

export function RTIPage() {
  const officers = [
    {
      sno: 1,
      category: "HEAD OF THE DEPARTMENT",
      name: "Ms. Charu Sinha, IPS.",
      designation: "Addl. Director General of Police, CID,TG, Hyd.",
      phone: "04023242424"
    },
    {
      sno: 2,
      category: "Appellate Authority",
      name: "SRI VISWAJIT KAMPATI, IPS.",
      designation: "SP.(Admin), CID, TG, Hyderabad.",
      phone: "8712673678"
    },
    {
      sno: 3,
      category: "Public Information Officer",
      name: "SRI B. RAM REDDY, IPS",
      designation: "SP NARCOTICS, CID,T.G, Hyderabad.",
      phone: "8712592738"
    },
    {
      sno: 4,
      category: "Asst.Public Information Officer",
      name: "Sri J.B.J. ANAND KUMAR",
      designation: "Administrative Officer, CID, T.G, Hyderabad.",
      phone: "8712671789"
    }
  ];

  const payScales = [
    { sno: 1, category: "Superintendent of Police (N.C)", basicPay: "56870-103290", sgp6: "------", spp12_18: "------", spp24: "------" },
    { sno: 2, category: "Addl.Supdt of Police( N.C)", basicPay: "52590-103290", sgp6: "------", spp12_18: "------", spp24: "------" },
    { sno: 3, category: "Dy.Supdt of Police (including female Dy.S.P.)", basicPay: "40270-93780", sgp6: "42490-96110", spp12_18: "46060-98440", spp24: "49870-100770" },
    { sno: 4, category: "Chief Legal Advisor", basicPay: "73270-108330", sgp6: "80930-110850", spp12_18: "87130-110850", spp24: "------" },
    { sno: 5, category: "Legal Advisor", basicPay: "42490-96110", sgp6: "46060-98440", spp12_18: "49870-100770", spp24: "52590-103290" },
    { sno: 6, category: "Assistant Legal Advisor(CID)", basicPay: "35120-87130", sgp6: "37100-91450", spp12_18: "40270-93780", spp24: "42490-96110" },
    { sno: 7, category: "Audit Officer", basicPay: "35120-87130", sgp6: "37100-91450", spp12_18: "40270-93780", spp24: "42490-96110" },
    { sno: 8, category: "Asst. Audit Officer", basicPay: "35120-87130", sgp6: "37100-91450", spp12_18: "40270-93780", spp24: "42490-96110" },
    { sno: 9, category: "Administrative Officer", basicPay: "37100-91450", sgp6: "40270-93780", spp12_18: "42490-96110", spp24: "46060-98440" },
    { sno: 10, category: "Inspector of Police (including W.Inspr)", basicPay: "35120-87130", sgp6: "37100-91450", spp12_18: "40270-93780", spp24: "42490-96110" },
    { sno: 11, category: "Superintendent", basicPay: "28940-78910", sgp6: "29760-80930", spp12_18: "31460-84970", spp24: "35120-87130" },
    { sno: 12, category: "Sub-Inspector of Police (including WSI)", basicPay: "28940-78910", sgp6: "29760-80930", spp12_18: "31460-84970", spp24: "35120-87130" },
    { sno: 13, category: "Sub-Inspector of Police (FPB)", basicPay: "28940-78910", sgp6: "29760-80930", spp12_18: "31460-84870", spp24: "35120-87130" },
    { sno: 14, category: "Asst.Sub Inspr", basicPay: "23100-67990", sgp6: "25140-73270", spp12_18: "26600-77030", spp24: "28940-78910" },
    { sno: 15, category: "Senior Assistant", basicPay: "22460-66330", sgp6: "23100-67990", spp12_18: "25140-73270", spp24: "26600-77030" },
    { sno: 16, category: "Head Constable (Civil) (including WHC)", basicPay: "21230-63010", sgp6: "22460-66330", spp12_18: "23100-67990", spp24: "24460-67990" },
    { sno: 17, category: "Junior Assistant", basicPay: "16400-49870", sgp6: "17890-53950", spp12_18: "18400-55410", spp24: "19500-58330" },
    { sno: 18, category: "Junior Stenographer", basicPay: "16400-49870", sgp6: "17890-53950", spp12_18: "18400-55410", spp24: "19500-58330" },
    { sno: 19, category: "Typist", basicPay: "16400-49870", sgp6: "17890-53950", spp12_18: "18400-55410", spp24: "19500-58330" },
    { sno: 20, category: "Police Constable (FPB Photographer)", basicPay: "16400-49870", sgp6: "17890-53950", spp12_18: "18400-55410", spp24: "19500-58330" },
    { sno: 21, category: "Roneo Operator", basicPay: "14600-44870", sgp6: "15030-46060", spp12_18: "15460-47330", spp24: "16400-49870" },
    { sno: 22, category: "Record Assistant", basicPay: "14600-44870", sgp6: "15030-46060", spp12_18: "15460-47330", spp24: "16400-49870" },
    { sno: 23, category: "Sweeper", basicPay: "13000-40270", sgp6: "13390-41380", spp12_18: "13780-42490", spp24: "14600-44870" },
    { sno: 24, category: "Follower", basicPay: "13000-40270", sgp6: "13390-41380", spp12_18: "13780-42490", spp24: "14600-44870" }
  ];

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
                    {officers.map((officer) => (
                      <tr key={officer.sno} className="hover:bg-gray-50">
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
                            <span className="font-mono">{officer.phone}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                    {payScales.map((scale) => (
                      <tr key={scale.sno} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                          {scale.sno}.
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-left">
                          {scale.category}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                          {scale.basicPay}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                          {scale.sgp6}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                          {scale.spp12_18}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">
                          {scale.spp24}
                        </td>
                      </tr>
                    ))}
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