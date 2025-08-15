import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/ui/loading-spinner";

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
            <LoadingSpinner size="md" className="mx-auto mb-4" />
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
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition"
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 cid-nav-text">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-lg text-purple-100 max-w-3xl mx-auto">
                {page.metaDescription}
              </p>
            )}
          </div>

          {/* Content Section */}
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
            <div 
              className="prose prose-lg max-w-none 
                [&_h1]:text-gray-800 [&_h1]:font-['Poppins'] [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:mb-6
                [&_h2]:text-gray-800 [&_h2]:font-['Poppins'] [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:mb-4
                [&_h3]:text-primary [&_h3]:font-['Poppins'] [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mb-3
                [&_p]:text-gray-700 [&_p]:font-['Inter'] [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:text-gray-700 [&_ul]:font-['Inter']
                [&_li]:text-gray-700 [&_li]:font-['Inter']
                [&_strong]:text-gray-800 [&_strong]:font-semibold
                [&_table]:shadow-lg [&_table]:border-collapse [&_table]:w-full
                [&_th]:bg-primary [&_th]:text-primary-foreground [&_th]:font-['Poppins'] [&_th]:font-semibold [&_th]:p-4 [&_th]:border [&_th]:border-border
                [&_td]:text-gray-700 [&_td]:font-['Inter'] [&_td]:p-4 [&_td]:border [&_td]:border-gray-300
                [&_tr:hover]:bg-gray-50
                [&_.bg-white]:shadow-lg [&_.bg-white]:border [&_.bg-white]:border-border
                [&_.bg-teal-50]:bg-muted [&_.bg-teal-50]:border [&_.bg-teal-50]:border-border"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}