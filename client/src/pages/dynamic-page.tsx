import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

export default function DynamicPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["/api/pages/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/pages/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Page not found');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
            <p className="text-gray-600">Loading page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
            >
              Go to Homepage
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-['Poppins']">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-lg text-gray-700 max-w-3xl mx-auto font-['Inter']">
                {page.metaDescription}
              </p>
            )}
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-teal-100">
            <div 
              className="prose prose-lg max-w-none 
                [&_h1]:text-gray-800 [&_h1]:font-['Poppins'] [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:mb-6
                [&_h2]:text-gray-800 [&_h2]:font-['Poppins'] [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:mb-4
                [&_h3]:text-teal-700 [&_h3]:font-['Poppins'] [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mb-3
                [&_p]:text-gray-700 [&_p]:font-['Inter'] [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:text-gray-700 [&_ul]:font-['Inter']
                [&_li]:text-gray-700 [&_li]:font-['Inter']
                [&_strong]:text-gray-800 [&_strong]:font-semibold
                [&_table]:shadow-lg [&_table]:border-collapse [&_table]:w-full
                [&_th]:bg-teal-700 [&_th]:text-white [&_th]:font-['Poppins'] [&_th]:font-semibold [&_th]:p-4 [&_th]:border [&_th]:border-gray-300
                [&_td]:text-gray-700 [&_td]:font-['Inter'] [&_td]:p-4 [&_td]:border [&_td]:border-gray-300
                [&_tr:hover]:bg-gray-50
                [&_.bg-white]:shadow-lg [&_.bg-white]:border [&_.bg-white]:border-teal-100
                [&_.bg-teal-50]:bg-teal-50 [&_.bg-teal-50]:border [&_.bg-teal-50]:border-teal-200"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}