import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/ModernHeader";
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {page.metaDescription}
              </p>
            )}
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}