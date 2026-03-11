import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { Eye, FileText, FileX, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Document } from "../backend.d";
import AppFooter from "../components/AppFooter";
import { useDeleteDocument, useUserDocuments } from "../hooks/useQueries";
import { DOC_TYPES } from "../lib/documentTypes";

const SEARCH_FIELDS = [
  { value: "buyerName", label: "Buyer Name" },
  { value: "sellerName", label: "Seller Name" },
  { value: "commodity", label: "Commodity" },
  { value: "origin", label: "Origin" },
  { value: "docType", label: "Document Type" },
];

export default function SavedDocumentsPage() {
  const { data: docs, isLoading } = useUserDocuments();
  const deleteDoc = useDeleteDocument();
  const [searchField, setSearchField] = useState("buyerName");
  const [searchValue, setSearchValue] = useState("");
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  const filteredDocs =
    docs?.filter((doc) => {
      if (!searchValue) return true;
      const fieldVal = doc[searchField as keyof typeof doc];
      return String(fieldVal || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    }) ?? [];

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      await deleteDoc.mutateAsync(docToDelete);
      toast.success("Document deleted.");
      setDocToDelete(null);
    } catch {
      toast.error("Failed to delete document.");
    }
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDocLabel = (docType: string) => {
    return DOC_TYPES.find((d) => d.id === docType)?.label || docType;
  };

  const categoryBadgeVariant = (
    docType: string,
  ): "default" | "secondary" | "outline" => {
    const cat = DOC_TYPES.find((d) => d.id === docType)?.category;
    if (cat === "invoice") return "default";
    if (cat === "contract") return "secondary";
    return "outline";
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background px-6 py-6 md:px-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Saved Documents
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {docs?.length ?? 0} document
                {(docs?.length ?? 0) !== 1 ? "s" : ""} saved
              </p>
            </div>
            <Link to="/">
              <Button
                className="gap-1.5"
                data-ocid="documents.new.primary_button"
              >
                <Plus className="w-4 h-4" />
                New Document
              </Button>
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-6 py-4 md:px-8 border-b bg-muted/30">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
            <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger
                className="sm:w-48"
                data-ocid="documents.search-field.select"
              >
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                {SEARCH_FIELDS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Search by ${SEARCH_FIELDS.find((f) => f.value === searchField)?.label.toLowerCase()}...`}
                className="pl-9"
                data-ocid="documents.search.search_input"
              />
            </div>
          </div>
        </div>

        {/* Document list */}
        <div className="px-6 py-6 md:px-8 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-3" data-ocid="documents.loading_state">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted/50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="documents.empty_state"
            >
              <FileX className="w-14 h-14 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-foreground">No documents found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchValue
                  ? "Try adjusting your search terms"
                  : "Generate your first document from the dashboard"}
              </p>
              {!searchValue && (
                <Link to="/" className="mt-4">
                  <Button variant="outline" className="gap-1.5">
                    <Plus className="w-4 h-4" />
                    Generate Document
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc: Document, i: number) => (
                <div
                  key={doc.id}
                  data-ocid={`documents.item.${i + 1}`}
                  className="flex items-start sm:items-center justify-between gap-4 p-4 bg-card border rounded-xl shadow-xs hover:shadow-card transition-shadow animate-fade-in group"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {doc.title}
                        </p>
                        <Badge
                          variant={categoryBadgeVariant(doc.docType)}
                          className="text-[10px] py-0"
                        >
                          {getDocLabel(doc.docType)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                        {doc.buyerName && (
                          <span className="text-xs text-muted-foreground">
                            Buyer:{" "}
                            <span className="text-foreground">
                              {doc.buyerName}
                            </span>
                          </span>
                        )}
                        {doc.sellerName && (
                          <span className="text-xs text-muted-foreground">
                            Seller:{" "}
                            <span className="text-foreground">
                              {doc.sellerName}
                            </span>
                          </span>
                        )}
                        {doc.origin && (
                          <span className="text-xs text-muted-foreground">
                            Origin:{" "}
                            <span className="text-foreground">
                              {doc.origin}
                            </span>
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to="/preview/$docId" params={{ docId: doc.id }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-ocid={`documents.view.button.${i + 1}`}
                        title="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          data-ocid={`documents.delete.delete_button.${i + 1}`}
                          onClick={() => setDocToDelete(doc.id)}
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="documents.delete.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{doc.title}". This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="documents.delete.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            data-ocid="documents.delete.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
