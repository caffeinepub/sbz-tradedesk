import { Link } from "@tanstack/react-router";
import {
  Archive,
  Building2,
  Calculator,
  ClipboardCheck,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Globe,
  Handshake,
  Leaf,
  Package,
  Receipt,
  ScrollText,
  ShoppingCart,
  TrendingUp,
  Wind,
} from "lucide-react";
import AppFooter from "../components/AppFooter";
import { useCallerProfile, useUserDocuments } from "../hooks/useQueries";
import { DOC_TYPES } from "../lib/documentTypes";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileSearch,
  FileText,
  Handshake,
  ShoppingCart,
  Receipt,
  ScrollText,
  Building2,
  ClipboardCheck,
  FileSpreadsheet,
  Package,
  Globe,
  Leaf,
  Wind,
};

const categoryColors: Record<string, string> = {
  inquiry:
    "from-blue-500/10 to-blue-600/5 border-blue-200 hover:border-blue-300",
  offer:
    "from-amber-500/10 to-amber-600/5 border-amber-200 hover:border-amber-300",
  contract:
    "from-purple-500/10 to-purple-600/5 border-purple-200 hover:border-purple-300",
  invoice:
    "from-green-500/10 to-green-600/5 border-green-200 hover:border-green-300",
  certificate:
    "from-red-500/10 to-red-600/5 border-red-200 hover:border-red-300",
  inspection:
    "from-orange-500/10 to-orange-600/5 border-orange-200 hover:border-orange-300",
};

const categoryIconColors: Record<string, string> = {
  inquiry: "text-blue-600",
  offer: "text-amber-600",
  contract: "text-purple-600",
  invoice: "text-green-600",
  certificate: "text-red-600",
  inspection: "text-orange-600",
};

export default function DashboardPage() {
  const { data: profile } = useCallerProfile();
  const { data: docs } = useUserDocuments();

  const firstName = profile?.name?.split(" ")[0] || "Trader";
  const docCount = docs?.length ?? 0;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/95 to-primary px-6 py-8 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-primary-foreground/60 text-sm font-medium mb-1">
              Good {getGreeting()}, {firstName}
            </p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
              SBZ TradeDesk
            </h1>
            <p className="text-primary-foreground/70 text-sm mt-1">
              Professional RCN Trade Documentation Platform
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg">
              <StatCard
                icon={Archive}
                label="My Documents"
                value={String(docCount)}
              />
              <StatCard icon={TrendingUp} label="Doc Types" value="13" />
              <StatCard icon={Globe} label="Origins" value="4+" />
            </div>
          </div>
        </div>

        {/* Document Generators Grid */}
        <div className="px-6 py-8 md:px-8 max-w-6xl mx-auto">
          {/* Quick tools */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              to="/documents"
              data-ocid="dashboard.documents.link"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border shadow-xs text-sm font-medium hover:shadow-card transition-shadow"
            >
              <Archive className="w-4 h-4 text-primary" />
              Saved Documents
            </Link>
            <Link
              to="/calculator"
              data-ocid="dashboard.calculator.link"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border shadow-xs text-sm font-medium hover:shadow-card transition-shadow"
            >
              <Calculator className="w-4 h-4 text-primary" />
              RCN Calculator
            </Link>
          </div>

          <h2 className="font-display font-bold text-xl text-foreground mb-1">
            Generate Documents
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Select a document type to begin generating
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DOC_TYPES.map((doc, i) => {
              const Icon = iconMap[doc.icon] || FileText;
              const colorClass = categoryColors[doc.category];
              const iconColor = categoryIconColors[doc.category];

              return (
                <Link
                  key={doc.id}
                  to="/generate/$docType"
                  params={{ docType: doc.id }}
                  data-ocid={`dashboard.doc-card.item.${i + 1}`}
                  className={`group flex flex-col p-5 rounded-xl border bg-gradient-to-br ${colorClass} transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div
                    className={
                      "flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-xs mb-3 flex-shrink-0"
                    }
                  >
                    <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground leading-snug mb-1">
                    {doc.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {doc.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Generate
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/10 rounded-lg px-3 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-primary-foreground/60" />
        <span className="text-[10px] text-primary-foreground/60">{label}</span>
      </div>
      <div className="font-display font-bold text-xl text-white">{value}</div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
