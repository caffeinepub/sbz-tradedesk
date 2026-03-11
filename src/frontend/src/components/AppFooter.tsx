export default function AppFooter() {
  return (
    <footer className="border-t bg-muted/30 px-4 py-3 text-center">
      <p className="text-xs text-muted-foreground">
        Powered by{" "}
        <span className="font-semibold text-foreground">SBZ Enterprises</span>
      </p>
      <p className="text-[11px] text-muted-foreground/70 mt-0.5">
        This system assists in generating trade documents. Final issuance is
        subject to banks and authorities.
      </p>
    </footer>
  );
}
