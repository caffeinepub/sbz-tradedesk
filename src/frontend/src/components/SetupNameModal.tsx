import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

export default function SetupNameModal() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await mutateAsync(name.trim());
      toast.success("Profile set up successfully!");
      setOpen(false);
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        data-ocid="setup-name.dialog"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display font-bold">
                Welcome to SBZ TradeDesk
              </DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                Please set your display name to get started.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trader-name">Your Name / Company Name</Label>
            <Input
              id="trader-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe or SBZ Trading Ltd"
              className="mt-1.5"
              data-ocid="setup-name.input"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || isPending}
            data-ocid="setup-name.submit_button"
          >
            {isPending ? "Saving..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
