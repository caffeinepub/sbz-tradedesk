import { Button } from "@/components/ui/button";
import { Building2, FileText, Globe, Loader2, Shield } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();

  useEffect(() => {
    if (identity) {
      window.location.href = "/";
    }
  }, [identity]);

  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    {
      icon: FileText,
      title: "13 Document Types",
      desc: "Generate all required trade documents instantly",
    },
    {
      icon: Globe,
      title: "West African Origins",
      desc: "Ivory Coast, Benin, Ghana, Tanzania & more",
    },
    {
      icon: Shield,
      title: "Secure & Professional",
      desc: "Bank-grade document templates for RCN exports",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side — branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground w-[480px] flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display font-bold text-xl leading-none text-white">
                SBZ TradeDesk
              </div>
              <div className="text-xs text-primary-foreground/60 mt-0.5">
                SBZ Enterprises
              </div>
            </div>
          </div>

          <h1 className="font-display font-bold text-4xl leading-tight text-white mb-4">
            Professional RCN Trade Documentation
          </h1>
          <p className="text-primary-foreground/70 text-base leading-relaxed">
            Generate all required documents for Raw Cashew Nut export deals —
            from LOIs to full SWIFT LC drafts — in minutes.
          </p>

          <div className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-primary-foreground/60 text-xs mt-0.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-primary-foreground/40">
            Powered by SBZ Enterprises
          </p>
          <p className="text-[11px] text-primary-foreground/30 mt-1">
            This system assists in generating trade documents. Final issuance is
            subject to banks and authorities.
          </p>
        </div>
      </div>

      {/* Right side — login */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background min-h-screen lg:min-h-0">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display font-bold text-xl leading-none">
              SBZ TradeDesk
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              SBZ Enterprises
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-foreground">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Secure access via Internet Identity
            </p>
          </div>

          <div className="bg-card rounded-xl border shadow-card p-8">
            <Button
              onClick={() => login()}
              disabled={isLoggingIn || isInitializing}
              className="w-full h-12 text-base font-semibold"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Sign in Securely
                </>
              )}
            </Button>

            {loginStatus === "loginError" && (
              <p
                className="mt-3 text-sm text-destructive text-center"
                data-ocid="login.error_state"
              >
                Login failed. Please try again.
              </p>
            )}

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Uses Internet Identity for secure, password-free authentication.
                Your identity is cryptographically verified.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by{" "}
              <span className="font-medium text-foreground">
                SBZ Enterprises
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
