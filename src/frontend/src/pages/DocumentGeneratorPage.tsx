import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppFooter from "../components/AppFooter";
import TradeForm from "../components/TradeForm";
import { GENERATORS } from "../lib/documentGenerators";
import {
  type CommonTradeFields,
  DEFAULT_COMMON_FIELDS,
  DOC_TYPES,
} from "../lib/documentTypes";

const DRAFT_KEY = (docType: string) => `sbz_draft_${docType}`;

export default function DocumentGeneratorPage() {
  const { docType } = useParams({ from: "/layout/generate/$docType" });
  const navigate = useNavigate();
  const docInfo = DOC_TYPES.find((d) => d.id === docType);

  const [fields, setFields] = useState<
    CommonTradeFields & Record<string, string>
  >(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY(docType));
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...DEFAULT_COMMON_FIELDS };
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-save draft to localStorage
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY(docType), JSON.stringify(fields));
  }, [fields, docType]);

  if (!docInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="text-muted-foreground">Document type not found.</p>
        <Link to="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!fields.buyerName && !fields.sellerName) {
      toast.error("Please fill in at least the Seller or Buyer name.");
      return;
    }
    setIsGenerating(true);
    try {
      const generator = GENERATORS[docType];
      if (!generator) {
        toast.error("Generator not found for this document type.");
        return;
      }
      const content = generator(fields);
      // Store in sessionStorage for the preview page
      sessionStorage.setItem(
        "sbz_preview_doc",
        JSON.stringify({
          docType,
          title: docInfo.label,
          content,
          fields,
        }),
      );
      navigate({ to: "/preview/$docId", params: { docId: "new" } });
    } catch (_err) {
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(DRAFT_KEY(docType));
    setFields({ ...DEFAULT_COMMON_FIELDS });
    toast.success("Form cleared.");
  };

  // Document-specific extra fields
  const extraFields = getExtraFields(docType, fields, (key, val) =>
    setFields((prev) => ({ ...prev, [key]: val })),
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  data-ocid="generator.back.button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="font-display font-bold text-xl md:text-2xl text-foreground">
              Generate {docInfo.label}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {docInfo.description}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-8 md:px-8 max-w-4xl mx-auto">
          <div className="bg-card border rounded-xl shadow-card p-6 md:p-8">
            <TradeForm
              fields={fields}
              onChange={setFields}
              extraFields={extraFields}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 h-12 text-base font-semibold"
              data-ocid="generator.generate.primary_button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate {docInfo.label}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="sm:w-auto"
              data-ocid="generator.clear.secondary_button"
            >
              Clear Form
            </Button>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

function getExtraFields(
  docType: string,
  fields: CommonTradeFields & Record<string, string>,
  set: (key: string, val: string) => void,
): React.ReactNode {
  switch (docType) {
    case "fco":
      return (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Validity Period</Label>
            <Input
              value={fields.validity || ""}
              onChange={(e) => set("validity", e.target.value)}
              placeholder="e.g. 72 hours from date of issuance"
              data-ocid="form.validity.input"
            />
          </div>
        </div>
      );

    case "proforma-invoice":
    case "commercial-invoice":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Invoice Number</Label>
            <Input
              value={fields.invoiceNumber || ""}
              onChange={(e) => set("invoiceNumber", e.target.value)}
              placeholder="e.g. PI-2025-001"
              data-ocid="form.invoice-number.input"
            />
          </div>
          {docType === "commercial-invoice" && (
            <div className="space-y-1.5">
              <Label>HS Code</Label>
              <Input
                value={fields.hsCode || ""}
                onChange={(e) => set("hsCode", e.target.value)}
                placeholder="e.g. 0801.31.00"
                data-ocid="form.hs-code.input"
              />
            </div>
          )}
        </div>
      );

    case "sales-contract":
      return (
        <div className="space-y-1.5">
          <Label>Contract Number</Label>
          <Input
            value={fields.contractNumber || ""}
            onChange={(e) => set("contractNumber", e.target.value)}
            placeholder="e.g. SC-2025-001"
            data-ocid="form.contract-number.input"
          />
        </div>
      );

    case "lc-draft":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>LC Reference Number</Label>
            <Input
              value={fields.lcReference || ""}
              onChange={(e) => set("lcReference", e.target.value)}
              placeholder="e.g. LC-2025-001"
              data-ocid="form.lc-reference.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>LC Expiry Date</Label>
            <Input
              type="date"
              value={fields.expiryDate || ""}
              onChange={(e) => set("expiryDate", e.target.value)}
              data-ocid="form.expiry-date.input"
            />
          </div>
        </div>
      );

    case "packing-list":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Packing List Number</Label>
            <Input
              value={fields.packingListNumber || ""}
              onChange={(e) => set("packingListNumber", e.target.value)}
              placeholder="e.g. PL-2025-001"
              data-ocid="form.packing-list-number.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Number of Bags</Label>
            <Input
              type="number"
              value={fields.bagCount || ""}
              onChange={(e) => set("bagCount", e.target.value)}
              placeholder="e.g. 6250"
              data-ocid="form.bag-count.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Net Weight per Bag (KG)</Label>
            <Input
              type="number"
              value={fields.netWeightPerBag || ""}
              onChange={(e) => set("netWeightPerBag", e.target.value)}
              placeholder="e.g. 80"
              data-ocid="form.net-weight-per-bag.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Gross Weight per Bag (KG)</Label>
            <Input
              type="number"
              value={fields.grossWeightPerBag || ""}
              onChange={(e) => set("grossWeightPerBag", e.target.value)}
              placeholder="e.g. 80.5"
              data-ocid="form.gross-weight-per-bag.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Container Number</Label>
            <Input
              value={fields.containerNumber || ""}
              onChange={(e) => set("containerNumber", e.target.value)}
              placeholder="e.g. MSCU1234567"
              data-ocid="form.container-number.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Total Gross Weight (KGS)</Label>
            <Input
              value={fields.totalGrossWeight || ""}
              onChange={(e) => set("totalGrossWeight", e.target.value)}
              placeholder="e.g. 500,312.5 KGS"
              data-ocid="form.total-gross-weight.input"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
