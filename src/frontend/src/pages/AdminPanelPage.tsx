import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, Loader2, Shield, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import type { Document, UserDto } from "../backend.d";
import AppFooter from "../components/AppFooter";
import {
  useAllDocuments,
  useAllUsers,
  useAssignRole,
  useIsAdmin,
} from "../hooks/useQueries";
import { DOC_TYPES } from "../lib/documentTypes";

export default function AdminPanelPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: users, isLoading: loadingUsers } = useAllUsers();
  const { data: docs, isLoading: loadingDocs } = useAllDocuments();
  const assignRole = useAssignRole();
  const [pendingRoles, setPendingRoles] = useState<Record<string, UserRole>>(
    {},
  );

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-64 gap-4 p-8 text-center"
        data-ocid="admin.error_state"
      >
        <AlertTriangle className="w-12 h-12 text-destructive/60" />
        <h2 className="font-display font-bold text-xl">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have admin privileges.
        </p>
      </div>
    );
  }

  const handleAssignRole = async (
    userId: string,
    userPrincipal: unknown,
    role: UserRole,
  ) => {
    setPendingRoles((prev) => ({ ...prev, [userId]: role }));
    try {
      await assignRole.mutateAsync({ user: userPrincipal as never, role });
      toast.success("Role updated successfully.");
    } catch {
      toast.error("Failed to update role.");
    } finally {
      setPendingRoles((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    }
  };

  const getDocLabel = (docType: string) =>
    DOC_TYPES.find((d) => d.id === docType)?.label || docType;

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background px-6 py-6 md:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage users, roles, and view all documents
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8 max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Users"
              value={users?.length ?? 0}
              icon={Users}
            />
            <StatCard
              label="Total Documents"
              value={docs?.length ?? 0}
              icon={FileText}
            />
            <StatCard label="Doc Types Available" value={13} icon={FileText} />
            <StatCard label="Origins Supported" value={6} icon={Shield} />
          </div>

          <Tabs defaultValue="users" data-ocid="admin.tab">
            <TabsList className="mb-6">
              <TabsTrigger value="users" data-ocid="admin.users.tab">
                <Users className="w-4 h-4 mr-1.5" />
                Users ({users?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="documents" data-ocid="admin.documents.tab">
                <FileText className="w-4 h-4 mr-1.5" />
                All Documents ({docs?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            {/* Users tab */}
            <TabsContent value="users">
              {loadingUsers ? (
                <div
                  className="space-y-2"
                  data-ocid="admin.users.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden shadow-card">
                  <Table data-ocid="admin.users.table">
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>User</TableHead>
                        <TableHead>Principal ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: UserDto, i: number) => {
                        const uid = user.id.toString();
                        return (
                          <TableRow
                            key={uid}
                            data-ocid={`admin.user.row.${i + 1}`}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-xs font-bold text-primary">
                                  {(user.name || "U")[0].toUpperCase()}
                                </div>
                                {user.name || "Unknown User"}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground max-w-[160px] truncate">
                              {uid}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                user
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Select
                                  onValueChange={(v) =>
                                    handleAssignRole(
                                      uid,
                                      user.id,
                                      v as UserRole,
                                    )
                                  }
                                  disabled={!!pendingRoles[uid]}
                                >
                                  <SelectTrigger
                                    className="w-32 h-8 text-xs"
                                    data-ocid={`admin.user.role.select.${i + 1}`}
                                  >
                                    <SelectValue placeholder="Assign role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={UserRole.user}>
                                      User
                                    </SelectItem>
                                    <SelectItem value={UserRole.admin}>
                                      Admin
                                    </SelectItem>
                                    <SelectItem value={UserRole.guest}>
                                      Guest
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {pendingRoles[uid] && (
                                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {!users?.length && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Documents tab */}
            <TabsContent value="documents">
              {loadingDocs ? (
                <div
                  className="space-y-2"
                  data-ocid="admin.documents.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden shadow-card">
                  <Table data-ocid="admin.documents.table">
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {docs?.map((doc: Document, i: number) => (
                        <TableRow
                          key={doc.id}
                          data-ocid={`admin.document.row.${i + 1}`}
                        >
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {doc.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="text-[10px] whitespace-nowrap"
                            >
                              {getDocLabel(doc.docType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.buyerName || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.sellerName || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.origin || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(doc.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {!docs?.length && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No documents found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-card border rounded-xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary/60" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
    </div>
  );
}
