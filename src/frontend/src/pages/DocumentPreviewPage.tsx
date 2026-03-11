import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  Edit,
  FileText,
  Loader2,
  Printer,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { DocumentInput } from "../backend.d";
import AppFooter from "../components/AppFooter";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateDocument,
  useDocument,
  useUpdateDocument,
} from "../hooks/useQueries";

interface PreviewData {
  docType: string;
  title: string;
  content: string;
  fields: Record<string, string>;
}

export default function DocumentPreviewPage() {
  const { docId } = useParams({ from: "/layout/preview/$docId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isNew = docId === "new";

  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  const { data: existingDoc } = useDocument(isNew ? null : docId);
  const createDoc = useCreateDocument();
  const updateDoc = useUpdateDocument();

  useEffect(() => {
    if (isNew) {
      const raw = sessionStorage.getItem("sbz_preview_doc");
      if (raw) {
        setPreviewData(JSON.parse(raw));
      }
    } else if (existingDoc) {
      setPreviewData({
        docType: existingDoc.docType,
        title: existingDoc.title,
        content: existingDoc.content,
        fields: {
          sellerName: existingDoc.sellerName,
          buyerName: existingDoc.buyerName,
          origin: existingDoc.origin,
          commodity: existingDoc.commodity,
        },
      });
      setSavedDocId(existingDoc.id);
      setIsSaved(true);
    }
  }, [isNew, existingDoc]);

  const handleCopy = async () => {
    if (!previewData) return;
    try {
      await navigator.clipboard.writeText(previewData.content);
      toast.success("Document copied to clipboard!");
    } catch {
      toast.error("Failed to copy. Please select and copy manually.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    if (!previewData || !identity) {
      toast.error("Please sign in to save documents.");
      return;
    }
    try {
      const input: DocumentInput = {
        title: previewData.title,
        content: previewData.content,
        docType: previewData.docType,
        origin: previewData.fields.origin || "",
        sellerName: previewData.fields.sellerName || "",
        buyerName: previewData.fields.buyerName || "",
        commodity: previewData.fields.commodity || "Raw Cashew Nuts in Shell",
      };

      if (savedDocId) {
        await updateDoc.mutateAsync({ docId: savedDocId, input });
        toast.success("Document updated successfully!");
      } else {
        const newId = await createDoc.mutateAsync(input);
        setSavedDocId(newId);
        setIsSaved(true);
        sessionStorage.removeItem("sbz_preview_doc");
        toast.success("Document saved to your account!");
      }
    } catch (_err) {
      toast.error("Failed to save document.");
    }
  };

  const handleDownloadDocx = () => {
    if (!previewData) return;
    const blob = new Blob([previewData.content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${previewData.title.replace(/\s+/g, "_")}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("DOCX downloaded!");
  };

  const handleEdit = () => {
    if (previewData) {
      navigate({
        to: "/generate/$docType",
        params: { docType: previewData.docType },
      });
    }
  };

  if (!previewData && !existingDoc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-8">
        <FileText className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No document to preview.</p>
        <Link to="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isSaving = createDoc.isPending || updateDoc.isPending;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4 md:px-8 no-print">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Link to="/documents">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  data-ocid="preview.back.button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Documents
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">
                  {previewData?.title || "Document Preview"}
                </h1>
                {isSaved && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved to your account
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div
                className="flex flex-wrap gap-2"
                data-ocid="preview.actions.panel"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  data-ocid="preview.copy.button"
                  className="gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  data-ocid="preview.print.button"
                  className="gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  PDF / Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDocx}
                  data-ocid="preview.download-docx.button"
                  className="gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download DOCX
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  data-ocid="preview.edit.button"
                  className="gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  data-ocid="preview.save.primary_button"
                  className="gap-1.5"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : isSaved ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="px-6 py-8 md:px-8 max-w-5xl mx-auto">
          <div
            id="print-area"
            className="bg-white border rounded-xl shadow-card p-6 md:p-10"
          >
            <pre
              className="whitespace-pre-wrap font-mono text-xs md:text-sm text-foreground leading-relaxed"
              style={{ fontFamily: "Geist Mono, JetBrains Mono, monospace" }}
            >
              {previewData?.content}
            </pre>
          </div>

          {/* Footer actions (mobile-friendly) */}
          <div className="flex flex-wrap gap-2 mt-4 sm:hidden no-print">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              data-ocid="preview.copy.secondary_button"
            >
              <Copy className="w-4 h-4" /> Copy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="flex-1 gap-1.5"
              data-ocid="preview.save.secondary_button"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
