import ModernHeader from "@/components/layout/ModernHeader";
import { AlertTriangle, Shield, Check, X, Users, FileText, Globe, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Alert } from "@shared/schema";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  AlertTriangle,
  Shield,
  Users,
  Building,
  Globe,
  FileText,
};

function getIcon(name?: string | null): LucideIcon {
  if (name && iconMap[name]) return iconMap[name];
  return Shield;
}

type SectionTheme = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: string;
  cardAccent: string;
  badge: string;
  iconBg: string;
  iconColor: string;
};

function AlertCard({ item, theme }: { item: Alert; theme: SectionTheme }) {
  const ItemIcon = getIcon(item.iconName);
  return (
    <div
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 ${theme.cardAccent}`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-3">
          <div className={`${theme.iconBg} ${theme.iconColor} rounded-lg p-3 flex-shrink-0`}>
            <ItemIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1 line-clamp-3">
              {item.title}
            </h3>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${theme.badge}`}>
              {item.category}
            </span>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {item.description || item.content}
        </p>
      </div>
    </div>
  );
}

function AlertSection({
  items,
  theme,
}: {
  items: Alert[];
  theme: SectionTheme;
}) {
  if (!items || items.length === 0) return null;
  const HeaderIcon = theme.icon;

  return (
    <section className="mb-12">
      <div className={`flex items-center justify-between mb-6 pb-3 border-b-2 ${theme.accent}`}>
        <div className="flex items-center gap-3">
          <div className={`${theme.iconBg} ${theme.iconColor} rounded-lg p-2`}>
            <HeaderIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{theme.title}</h2>
            <p className="text-sm text-gray-500">{theme.subtitle}</p>
          </div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${theme.badge}`}>
          {items.length} {items.length === 1 ? "alert" : "alerts"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <AlertCard key={item.id} item={item} theme={theme} />
        ))}
      </div>
    </section>
  );
}

export function AlertsPage() {
  const { data: cyberSafetyTopics = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/cyber-safety"],
    retry: false,
  });

  const { data: womenChildrenSafety = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/women-children"],
    retry: false,
  });

  const { data: safetyTopics = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/general-safety"],
    retry: false,
  });

  const { data: dosAlerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/dos"],
    retry: false,
  });

  const { data: dontsAlerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/category/donts"],
    retry: false,
  });

  const cyberTheme: SectionTheme = {
    icon: Globe,
    title: "Cyber Safety",
    subtitle: "Stay safe online and protect your digital identity",
    accent: "border-blue-500",
    cardAccent: "border-blue-500",
    badge: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  };

  const womenChildrenTheme: SectionTheme = {
    icon: Users,
    title: "Women & Children Safety",
    subtitle: "Resources and alerts for the safety of women and children",
    accent: "border-pink-500",
    cardAccent: "border-pink-500",
    badge: "bg-pink-100 text-pink-700",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  };

  const generalTheme: SectionTheme = {
    icon: Shield,
    title: "General Safety",
    subtitle: "General awareness and safety guidelines",
    accent: "border-purple-500",
    cardAccent: "border-purple-500",
    badge: "bg-purple-100 text-purple-700",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  };

  const dosTheme: SectionTheme = {
    icon: Check,
    title: "Do's",
    subtitle: "Recommended actions and best practices",
    accent: "border-green-500",
    cardAccent: "border-green-500",
    badge: "bg-green-100 text-green-700",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  };

  const dontsTheme: SectionTheme = {
    icon: X,
    title: "Don'ts",
    subtitle: "Actions to avoid for your safety",
    accent: "border-red-500",
    cardAccent: "border-red-500",
    badge: "bg-red-100 text-red-700",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  };

  const totalAlerts =
    cyberSafetyTopics.length +
    womenChildrenSafety.length +
    safetyTopics.length +
    dosAlerts.length +
    dontsAlerts.length;

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="header-spacing pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 cid-nav-text">
              Public Safety Alerts
            </h1>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto">
              Important safety information and guidelines to protect yourself and your community
            </p>
          </div>

          {totalAlerts === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No alerts available at this time.</p>
            </div>
          ) : (
            <>
              <AlertSection items={cyberSafetyTopics} theme={cyberTheme} />
              <AlertSection items={womenChildrenSafety} theme={womenChildrenTheme} />
              <AlertSection items={safetyTopics} theme={generalTheme} />

              {(dosAlerts.length > 0 || dontsAlerts.length > 0) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12">
                  <div className="flex items-center mb-6">
                    <AlertTriangle className="h-7 w-7 text-orange-500 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Do's &amp; Don'ts
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <AlertSection items={dosAlerts} theme={dosTheme} />
                    </div>
                    <div>
                      <AlertSection items={dontsAlerts} theme={dontsTheme} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Helpline</h3>
              <p className="text-3xl font-bold text-orange-600">100</p>
              <p className="text-gray-600 mt-2">Police Emergency</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Women Helpline</h3>
              <p className="text-3xl font-bold text-purple-600">1091</p>
              <p className="text-gray-600 mt-2">24/7 Support</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cyber Crime</h3>
              <p className="text-3xl font-bold text-blue-600">1930</p>
              <p className="text-gray-600 mt-2">Cyber Helpline</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}