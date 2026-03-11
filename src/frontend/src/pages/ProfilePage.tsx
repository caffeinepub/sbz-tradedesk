import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppFooter from "../components/AppFooter";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCallerProfile,
  useCallerRole,
  useUpdateUserName,
} from "../hooks/useQueries";

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();
  const { data: role } = useCallerRole();
  const updateName = useUpdateUserName();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await updateName.mutateAsync(name.trim());
      setSaved(true);
      toast.success("Profile updated!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const principalStr = identity?.getPrincipal().toString() || "";
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background px-6 py-6 md:px-8">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                My Profile
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage your trader profile and account settings
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 md:px-8 max-w-2xl mx-auto space-y-5">
          {/* Avatar card */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold font-display flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-foreground">
                    {name || "Trader"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground capitalize">
                      {role || "user"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit profile */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Profile Information
              </CardTitle>
              <CardDescription>Update your display name</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2" data-ocid="profile.loading_state">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name or company name"
                      data-ocid="profile.name.input"
                      className="h-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!name.trim() || updateName.isPending}
                    data-ocid="profile.save.primary_button"
                    className="gap-1.5"
                  >
                    {updateName.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {updateName.isPending
                      ? "Saving..."
                      : saved
                        ? "Saved!"
                        : "Save Changes"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Account info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Account Details
              </CardTitle>
              <CardDescription>
                Your Internet Identity information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Principal ID
                </Label>
                <p
                  className="mt-1 font-mono text-xs bg-muted px-3 py-2 rounded-lg break-all select-all"
                  data-ocid="profile.principal.panel"
                >
                  {principalStr || "Not connected"}
                </p>
              </div>
              {profile?.createdAt && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Member Since
                  </Label>
                  <p className="mt-1 text-sm text-foreground">
                    {new Date(
                      Number(profile.createdAt) / 1_000_000,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
