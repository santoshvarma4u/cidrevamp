import Header from "@/components/layout/ModernHeader";
import { MapPin, Phone, Mail, Building, Users, ExternalLink } from "lucide-react";

export function ContactPage() {
  const regionalOffices = [
    {
      name: "Head Quarters",
      address: "CID Head Quarters, 3rd Floor, DGPs Office Complex, C.I.D, Lakdikapul, Hyderabad-500004.",
      phone: "040-27852274",
      email: "itcoreteam@cid.tspolice.gov.in",
      mapUrl: "https://www.google.co.in/maps/search/ts+police+headquarters/@17.4014673,78.4657594,16.14z?dcr=0"
    },
    {
      name: "CYBERABAD",
      address: "Regional Office, CID, Flat No. 11-5-152, Red Hills, Hyderabad, Telangana. 500004",
      phone: "040-23312009",
      email: null,
      mapUrl: "https://www.google.com/maps/place/17%C2%B023'43.9%22N+78%C2%B027'50.3%22E/@17.3955455,78.4626768,18.04z/data=!4m5!3m4!1s0x0:0x0!8m2!3d17.3955139!4d78.4639754?hl=en"
    },
    {
      name: "SANGAREDDY",
      address: "Regional Office, CID, H.No.3-4-37, FRS Road, Sangareddy, Sangareddy Dist.",
      phone: "08458-278885, 08458-278884",
      email: null,
      mapUrl: "https://www.google.co.in/maps/search/SANGAREDDY+cid+office/@17.5943159,78.0832672,18.3z?dcr=0"
    },
    {
      name: "KARIMNAGAR",
      address: "Regional Office, CID, H.No. 4-69/63/4, Vidyaranyapuri, Road No.1, Karimnagar",
      phone: "0878-2228633",
      email: null,
      mapUrl: "https://www.google.co.in/maps/search/KARMINAGAR+cid+office/@18.4524367,79.1367896,15.1z?dcr=0"
    },
    {
      name: "WARANGAL",
      address: "Regional Office, CID, H.No. 2-7-676, Excise Clony, Subadari, Hanamkonda, Warangal District.",
      phone: "0870-2457330",
      email: null,
      mapUrl: "https://www.google.co.in/maps/search/WARANGAL+cid+office/@17.988051,79.5427513,13.87z?dcr=0"
    },
    {
      name: "NIZAMABAD",
      address: "Regional Office, CID, H.No. 6-25-310/5/A, Opp. Sant Nirankari Bhavan, Dubba, Nizamabad District 503001.",
      phone: "9963262636",
      email: null,
      mapUrl: "https://www.google.com/maps/place/18%C2%B046'22.5%22N+78%C2%B014'55.0%22E/@18.772929,78.2464333,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d18.772929!4d78.248622"
    },
    {
      name: "NALGONDA",
      address: "Regional Office, CID, H.No. 1-43, Hyderabad Road Near RTO Office, Branch Post Office Marriguda, Nalgonda Dist 508001.",
      phone: "7901105477",
      email: null,
      mapUrl: "https://www.google.com/maps/place/17%C2%B005'22.9%22N+79%C2%B015'27.7%22E/@17.0896944,79.2555057,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d17.0896816!4d79.2576828?hl=en"
    }
  ];

  const departmentContacts = [
    {
      sno: 1,
      rank: "Director General of Police",
      landline: "040-23242424",
      email: "addldgp@cid.tspolice.gov.in"
    },
    {
      sno: 2,
      rank: "Inspector General of Police(Admin.) PCR Cell, SCRB, AD Cell, Narcotics & ISI",
      landline: "040-23147606",
      email: "igp_pcr@cid.tspolice.gov.in"
    },
    {
      sno: 3,
      rank: "Inspector General of Police, Women Protection Cell",
      landline: "040-23286722",
      email: "igp_wpc@gmail.com"
    },
    {
      sno: 4,
      rank: "Dy. Inspector General of Police, Economic Offences Wing/General Offences Wing",
      landline: "040-23147612",
      email: "dig_eow@cid.tspolice.gov.in"
    },
    {
      sno: 5,
      rank: "Superintendent of Police, Economic Offences Wing",
      landline: "040-23147615",
      email: "sp_eow@cid.tspolice.gov.in"
    },
    {
      sno: 6,
      rank: "Superintendent of Police, State Crime Records Bureau",
      landline: "040-23147612",
      email: "sp_scrb@cid.tspolice.gov.in"
    },
    {
      sno: 7,
      rank: "Superintendent of Police (Admin,)",
      landline: "040-23147614",
      email: "sp_admin@cid.tspolice.gov.in"
    },
    {
      sno: 8,
      rank: "Superintendent of Police Cyber Crimes & IT Core",
      landline: "--",
      email: "sp_cybercrime@cid.tspolice.gov.in"
    },
    {
      sno: 9,
      rank: "Superintendent of Police, Narcotics/AD cell/ISI",
      landline: "040-23147614",
      email: "sp_adcell@cid.tspolice.gov.in"
    },
    {
      sno: 10,
      rank: "Superintendent of Police, General Offences Wing",
      landline: "040-23147619",
      email: "sp_gow@cid.tspolice.gov.in"
    },
    {
      sno: 11,
      rank: "Superintendent of Police, Women Protection Cell",
      landline: "040-23147631",
      email: "sp_wpc@cid.tspolice.gov.in"
    },
    {
      sno: 12,
      rank: "I/c Director, Finger Print Bureau",
      landline: "",
      email: "dsp@cid.tspolice.gov.in"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get in touch with the Criminal Investigation Department offices across Telangana State
            </p>
          </div>

          {/* Regional Offices */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Building className="h-6 w-6 text-teal-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Regional Offices</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionalOffices.map((office, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{office.name}</h3>
                    <a 
                      href={office.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      <MapPin className="h-5 w-5" />
                    </a>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{office.address}</p>
                    </div>
                    
                    {office.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 font-mono text-sm">{office.phone}</span>
                      </div>
                    )}
                    
                    {office.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`mailto:${office.email}`}
                          className="text-teal-600 hover:text-teal-700 text-sm"
                        >
                          {office.email}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a 
                      href={office.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm"
                    >
                      View on Map
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Directory */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Department Directory</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left">SL No</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Rank</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Land Line's</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">E-Mail I.D's</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentContacts.map((contact) => (
                      <tr key={contact.sno} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                          {contact.sno}.
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {contact.rank}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {contact.landline && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-teal-600 mr-2" />
                              <span className="font-mono text-sm">{contact.landline}</span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-teal-600 mr-2" />
                            <a 
                              href={`mailto:${contact.email}`}
                              className="text-teal-600 hover:text-teal-700 text-sm break-all"
                            >
                              {contact.email}
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* General Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">General Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Office Hours</h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Monday to Friday:</strong> 10:00 AM - 5:30 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM</p>
                  <p><strong>Sunday:</strong> Closed (Emergency services available)</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contacts</h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Police Emergency:</strong> <span className="font-mono">100</span></p>
                  <p><strong>Women Helpline:</strong> <span className="font-mono">1091</span></p>
                  <p><strong>Cyber Crime Helpline:</strong> <span className="font-mono">1930</span></p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-teal-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Important Note</h4>
              <p className="text-gray-700">
                For urgent matters and complaints, please visit our <a href="/citizen/complaint" className="text-teal-600 hover:text-teal-700 font-medium">Complaint Portal</a> or contact the nearest CID office directly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}