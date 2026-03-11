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
import { Calculator, RefreshCw, TrendingUp } from "lucide-react";
import { useState } from "react";
import AppFooter from "../components/AppFooter";

export default function RCNCalculatorPage() {
  const [quantity, setQuantity] = useState("");
  const [pricePerMT, setPricePerMT] = useState("");
  const [freightPerMT, setFreightPerMT] = useState("");
  const [insuranceRate, setInsuranceRate] = useState("");

  const qty = Number.parseFloat(quantity) || 0;
  const price = Number.parseFloat(pricePerMT) || 0;
  const freight = Number.parseFloat(freightPerMT) || 0;
  const insRate = Number.parseFloat(insuranceRate) || 0;

  const totalFOB = qty * price;
  const totalFreight = qty * freight;
  const totalCFR = totalFOB + totalFreight;
  const totalInsurance = (totalCFR * insRate) / 100;
  const totalCIF = totalCFR + totalInsurance;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleReset = () => {
    setQuantity("");
    setPricePerMT("");
    setFreightPerMT("");
    setInsuranceRate("");
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background px-6 py-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-foreground">
                  RCN Contract Calculator
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Calculate FOB, CFR, and CIF contract values instantly
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 md:px-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input form */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Contract Parameters
                </CardTitle>
                <CardDescription>
                  Enter the trade values to calculate total contract amounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="qty">Quantity (Metric Tons)</Label>
                  <Input
                    id="qty"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 500"
                    data-ocid="calculator.quantity.input"
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Unit Price (USD per MT) — FOB</Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricePerMT}
                    onChange={(e) => setPricePerMT(e.target.value)}
                    placeholder="e.g. 850"
                    data-ocid="calculator.price.input"
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="freight">
                    Ocean Freight (USD per MT) — optional
                  </Label>
                  <Input
                    id="freight"
                    type="number"
                    value={freightPerMT}
                    onChange={(e) => setFreightPerMT(e.target.value)}
                    placeholder="e.g. 45"
                    data-ocid="calculator.freight.input"
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="insurance">
                    Insurance Rate (% of CFR) — optional
                  </Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={insuranceRate}
                    onChange={(e) => setInsuranceRate(e.target.value)}
                    placeholder="e.g. 0.15"
                    step="0.01"
                    data-ocid="calculator.insurance.input"
                    className="h-11 text-base"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full gap-1.5"
                  data-ocid="calculator.reset.button"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base font-semibold">
                      Contract Values
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* FOB */}
                  <ResultRow
                    label="FOB Contract Value"
                    subtitle={
                      qty > 0 && price > 0
                        ? `${fmt(qty)} MT × USD ${fmt(price)}/MT`
                        : ""
                    }
                    value={totalFOB}
                    highlight
                  />

                  {/* Freight */}
                  {freight > 0 && (
                    <ResultRow
                      label="Ocean Freight"
                      subtitle={`${fmt(qty)} MT × USD ${fmt(freight)}/MT`}
                      value={totalFreight}
                    />
                  )}

                  {/* CFR */}
                  {freight > 0 && (
                    <ResultRow
                      label="CFR Contract Value"
                      subtitle="FOB + Freight"
                      value={totalCFR}
                      highlight
                    />
                  )}

                  {/* Insurance */}
                  {insRate > 0 && (
                    <ResultRow
                      label="Insurance Premium"
                      subtitle={`${insRate}% of CFR value`}
                      value={totalInsurance}
                    />
                  )}

                  {/* CIF */}
                  {(freight > 0 || insRate > 0) && (
                    <ResultRow
                      label="CIF Contract Value"
                      subtitle="CFR + Insurance"
                      value={totalCIF}
                      highlight
                      large
                    />
                  )}

                  {qty === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Enter quantity and price to see calculations
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Per-MT breakdown */}
              {qty > 0 && price > 0 && (
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Per MT Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <PerMTRow label="FOB" value={price} />
                    {freight > 0 && (
                      <PerMTRow label="+ Freight" value={freight} />
                    )}
                    {freight > 0 && (
                      <PerMTRow label="CFR" value={price + freight} bold />
                    )}
                    {insRate > 0 && (
                      <PerMTRow
                        label="+ Insurance"
                        value={((price + freight) * insRate) / 100}
                      />
                    )}
                    {(freight > 0 || insRate > 0) && (
                      <PerMTRow
                        label="CIF"
                        value={(price + freight) * (1 + insRate / 100)}
                        bold
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <p className="font-medium mb-1">Note</p>
            <p>
              This calculator provides estimates for planning purposes. Final
              contract values are subject to negotiation and confirmation. All
              values in USD.
            </p>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

function ResultRow({
  label,
  subtitle,
  value,
  highlight,
  large,
}: {
  label: string;
  subtitle: string;
  value: number;
  highlight?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${highlight ? "pb-3 border-b last:border-0 last:pb-0" : ""}`}
    >
      <div>
        <p
          className={`font-medium ${large ? "text-base" : "text-sm"} text-foreground`}
        >
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="text-right">
        <p
          className={`font-bold ${large ? "text-xl text-primary" : "text-base text-foreground"}`}
        >
          $
          {value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}

function PerMTRow({
  label,
  value,
  bold,
}: { label: string; value: number; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between text-sm ${bold ? "font-semibold text-foreground border-t pt-2" : "text-muted-foreground"}`}
    >
      <span>{label}</span>
      <span>
        USD {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}/MT
      </span>
    </div>
  );
}
