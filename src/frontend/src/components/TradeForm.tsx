import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  BROKEN_PERCENT_CASHEW,
  BROKEN_PERCENT_RICE,
  CASHEW_KERNEL_GRADES,
  CASHEW_KERNEL_PACKING,
  COMMODITY_TYPES,
  type CommonTradeFields,
  DEFECTIVE_OPTIONS,
  FOREIGN_MATTER_OPTIONS,
  INCOTERMS,
  INSPECTION_AGENCIES,
  MOISTURE_OPTIONS,
  NUT_COUNTS,
  ORIGINS,
  OUTTURN_LBS,
  PACKAGING_OPTIONS,
  PAYMENT_TERMS,
  RICE_PACKING,
  RICE_VARIETIES,
} from "../lib/documentTypes";

interface TradeFormProps {
  fields: CommonTradeFields & Record<string, string>;
  onChange: (fields: CommonTradeFields & Record<string, string>) => void;
  extraFields?: React.ReactNode;
}

function calcTotal(quantity: string, unitPrice: string): string {
  const qty = Number.parseFloat(quantity || "0");
  const price = Number.parseFloat(unitPrice || "0");
  if (qty > 0 && price > 0) {
    return (qty * price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return "";
}

function FieldRow({
  children,
  cols = 2,
}: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={`grid grid-cols-1 ${
        cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : ""
      } gap-4`}
    >
      {children}
    </div>
  );
}

interface SelectOrInputProps {
  label: string;
  fieldKey: string;
  options: string[];
  value: string;
  onChange: (key: string, val: string) => void;
  placeholder?: string;
  ocid?: string;
}

function SelectOrInput({
  label,
  fieldKey,
  options,
  value,
  onChange,
  placeholder,
  ocid,
}: SelectOrInputProps) {
  const isOther =
    value === "Other" || (!options.includes(value) && value !== "");
  const [showCustom, setShowCustom] = useState(isOther);
  const [customVal, setCustomVal] = useState(isOther ? value : "");

  const handleSelectChange = (val: string) => {
    if (val === "Other") {
      setShowCustom(true);
      onChange(fieldKey, customVal || "");
    } else {
      setShowCustom(false);
      onChange(fieldKey, val);
    }
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onChange(fieldKey, val);
  };

  const selectVal = options.includes(value) ? value : showCustom ? "Other" : "";

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={selectVal} onValueChange={handleSelectChange}>
        <SelectTrigger data-ocid={ocid || `form.${fieldKey}.select`}>
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showCustom && (
        <Input
          value={customVal}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder={`Enter custom ${label.toLowerCase()}`}
          data-ocid={`form.${fieldKey}.input`}
          className="mt-1"
        />
      )}
    </div>
  );
}

function CommoditySpecs({
  commodityType,
  fields,
  set,
}: {
  commodityType: string;
  fields: CommonTradeFields & Record<string, string>;
  set: (key: string, val: string) => void;
}) {
  if (commodityType === "Raw Cashew Nuts (RCN)") {
    return (
      <>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
          RCN Quality Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <SelectOrInput
            label="Nut Count"
            fieldKey="nutCount"
            options={NUT_COUNTS}
            value={fields.nutCount}
            onChange={set}
          />
          <SelectOrInput
            label="Outturn (LBS)"
            fieldKey="outtureLbs"
            options={OUTTURN_LBS}
            value={fields.outtureLbs}
            onChange={set}
          />
          <SelectOrInput
            label="Moisture %"
            fieldKey="moisture"
            options={MOISTURE_OPTIONS}
            value={fields.moisture}
            onChange={set}
          />
          <SelectOrInput
            label="Defective %"
            fieldKey="defective"
            options={DEFECTIVE_OPTIONS}
            value={fields.defective}
            onChange={set}
          />
          <SelectOrInput
            label="Foreign Matter %"
            fieldKey="foreignMatter"
            options={FOREIGN_MATTER_OPTIONS}
            value={fields.foreignMatter}
            onChange={set}
          />
        </div>
      </>
    );
  }

  if (commodityType === "Cashew Kernels") {
    return (
      <>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
          Cashew Kernel Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SelectOrInput
            label="Grade"
            fieldKey="cashewKernelGrade"
            options={CASHEW_KERNEL_GRADES}
            value={fields.cashewKernelGrade}
            onChange={set}
          />
          <SelectOrInput
            label="Packing Type"
            fieldKey="cashewKernelPacking"
            options={CASHEW_KERNEL_PACKING}
            value={fields.cashewKernelPacking}
            onChange={set}
          />
          <SelectOrInput
            label="Moisture %"
            fieldKey="moisture"
            options={MOISTURE_OPTIONS}
            value={fields.moisture}
            onChange={set}
          />
          <SelectOrInput
            label="Broken %"
            fieldKey="brokenPercent"
            options={BROKEN_PERCENT_CASHEW}
            value={fields.brokenPercent}
            onChange={set}
          />
        </div>
      </>
    );
  }

  if (commodityType === "Rice") {
    return (
      <>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
          Rice Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SelectOrInput
            label="Variety"
            fieldKey="riceVariety"
            options={RICE_VARIETIES}
            value={fields.riceVariety}
            onChange={set}
          />
          <SelectOrInput
            label="Broken %"
            fieldKey="brokenPercent"
            options={BROKEN_PERCENT_RICE}
            value={fields.brokenPercent}
            onChange={set}
          />
          <SelectOrInput
            label="Moisture %"
            fieldKey="moisture"
            options={MOISTURE_OPTIONS}
            value={fields.moisture}
            onChange={set}
          />
          <div className="space-y-1.5">
            <Label htmlFor="riceLength">Length (e.g. 8.30mm min)</Label>
            <Input
              id="riceLength"
              value={fields.riceLength}
              onChange={(e) => set("riceLength", e.target.value)}
              placeholder="e.g. 8.30mm min"
              data-ocid="form.rice-length.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="riceColor">Color</Label>
            <Input
              id="riceColor"
              value={fields.riceColor}
              onChange={(e) => set("riceColor", e.target.value)}
              placeholder="e.g. White"
              data-ocid="form.rice-color.input"
            />
          </div>
          <SelectOrInput
            label="Packing"
            fieldKey="ricePacking"
            options={RICE_PACKING}
            value={fields.ricePacking}
            onChange={set}
          />
        </div>
      </>
    );
  }

  // Spices / Other
  return (
    <>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
        Quality Specifications
      </h3>
      <div className="space-y-4">
        <FieldRow>
          <div className="space-y-1.5">
            <Label htmlFor="gradeQuality">Grade / Quality</Label>
            <Input
              id="gradeQuality"
              value={fields.gradeQuality}
              onChange={(e) => set("gradeQuality", e.target.value)}
              placeholder="e.g. Export Grade A"
              data-ocid="form.grade-quality.input"
            />
          </div>
          <SelectOrInput
            label="Moisture %"
            fieldKey="moisture"
            options={MOISTURE_OPTIONS}
            value={fields.moisture}
            onChange={set}
          />
        </FieldRow>
        <div className="space-y-1.5">
          <Label htmlFor="additionalSpecs">Additional Specifications</Label>
          <Textarea
            id="additionalSpecs"
            value={fields.additionalSpecs}
            onChange={(e) => set("additionalSpecs", e.target.value)}
            placeholder="Enter any additional quality or product specifications..."
            rows={3}
            data-ocid="form.additional-specs.textarea"
          />
        </div>
      </div>
    </>
  );
}

export default function TradeForm({
  fields,
  onChange,
  extraFields,
}: TradeFormProps) {
  const set = (key: string, val: string) => {
    const updated = { ...fields, [key]: val };
    if (key === "quantity" || key === "unitPrice") {
      const qty = key === "quantity" ? val : fields.quantity;
      const price = key === "unitPrice" ? val : fields.unitPrice;
      updated.totalValue = calcTotal(qty, price);
    }
    onChange(updated);
  };

  const handleCommodityTypeChange = (val: string) => {
    const commodityTextMap: Record<string, string> = {
      "Raw Cashew Nuts (RCN)": "Raw Cashew Nuts in Shell",
      "Cashew Kernels": "Cashew Kernels",
      Rice: "Rice",
      Spices: "Spices",
      "Other Agro Commodities": "Agro Commodities",
    };
    onChange({
      ...fields,
      commodityType: val,
      commodity: commodityTextMap[val] || val,
    });
  };

  const commodityType = fields.commodityType || "Raw Cashew Nuts (RCN)";

  return (
    <div className="space-y-8">
      {/* Parties */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
          Parties
        </h3>
        <div className="space-y-4">
          <FieldRow>
            <div className="space-y-1.5">
              <Label htmlFor="sellerName">Seller / Exporter Name</Label>
              <Input
                id="sellerName"
                value={fields.sellerName}
                onChange={(e) => set("sellerName", e.target.value)}
                placeholder="Company or trader name"
                data-ocid="form.seller-name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyerName">Buyer / Importer Name</Label>
              <Input
                id="buyerName"
                value={fields.buyerName}
                onChange={(e) => set("buyerName", e.target.value)}
                placeholder="Company or trader name"
                data-ocid="form.buyer-name.input"
              />
            </div>
          </FieldRow>
          <FieldRow>
            <div className="space-y-1.5">
              <Label htmlFor="sellerAddr">Seller Address</Label>
              <Textarea
                id="sellerAddr"
                value={fields.sellerAddress}
                onChange={(e) => set("sellerAddress", e.target.value)}
                placeholder="Full address"
                rows={3}
                data-ocid="form.seller-address.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyerAddr">Buyer Address</Label>
              <Textarea
                id="buyerAddr"
                value={fields.buyerAddress}
                onChange={(e) => set("buyerAddress", e.target.value)}
                placeholder="Full address"
                rows={3}
                data-ocid="form.buyer-address.textarea"
              />
            </div>
          </FieldRow>
        </div>
      </section>

      {/* Commodity */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
          Commodity & Origin
        </h3>
        <div className="space-y-4">
          <FieldRow>
            <div className="space-y-1.5">
              <Label>Commodity Type</Label>
              <Select
                value={commodityType}
                onValueChange={handleCommodityTypeChange}
              >
                <SelectTrigger data-ocid="form.commodity-type.select">
                  <SelectValue placeholder="Select commodity type" />
                </SelectTrigger>
                <SelectContent>
                  {COMMODITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SelectOrInput
              label="Origin"
              fieldKey="origin"
              options={ORIGINS}
              value={fields.origin}
              onChange={set}
              ocid="form.origin.select"
            />
          </FieldRow>
          <FieldRow>
            <div className="space-y-1.5">
              <Label htmlFor="commodity">Commodity Description</Label>
              <Input
                id="commodity"
                value={fields.commodity}
                onChange={(e) => set("commodity", e.target.value)}
                placeholder="e.g. Raw Cashew Nuts in Shell"
                data-ocid="form.commodity.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cropYear">Crop Year</Label>
              <Input
                id="cropYear"
                value={fields.cropYear}
                onChange={(e) => set("cropYear", e.target.value)}
                placeholder="e.g. 2025"
                data-ocid="form.crop-year.input"
              />
            </div>
          </FieldRow>
        </div>
      </section>

      {/* Trade Terms */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
          Trade Terms & Value
        </h3>
        <div className="space-y-4">
          <FieldRow cols={3}>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity (MT)</Label>
              <Input
                id="quantity"
                type="number"
                value={fields.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="e.g. 500"
                data-ocid="form.quantity.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unitPrice">Unit Price (USD/MT)</Label>
              <Input
                id="unitPrice"
                type="number"
                value={fields.unitPrice}
                onChange={(e) => set("unitPrice", e.target.value)}
                placeholder="e.g. 850"
                data-ocid="form.unit-price.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="totalValue">Total Value (USD)</Label>
              <Input
                id="totalValue"
                value={`$${fields.totalValue}`}
                readOnly
                className="bg-muted cursor-default font-medium text-foreground"
                data-ocid="form.total-value.input"
              />
            </div>
          </FieldRow>

          <FieldRow>
            <div className="space-y-1.5">
              <Label>Incoterm</Label>
              <Select
                value={fields.incoterm}
                onValueChange={(v) => set("incoterm", v)}
              >
                <SelectTrigger data-ocid="form.incoterm.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INCOTERMS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Terms</Label>
              <Select
                value={fields.paymentTerms}
                onValueChange={(v) => set("paymentTerms", v)}
              >
                <SelectTrigger data-ocid="form.payment-terms.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FieldRow>

          <FieldRow>
            <div className="space-y-1.5">
              <Label htmlFor="portOfLoading">Port of Loading</Label>
              <Input
                id="portOfLoading"
                value={fields.portOfLoading}
                onChange={(e) => set("portOfLoading", e.target.value)}
                placeholder="e.g. Abidjan, Cotonou"
                data-ocid="form.port-of-loading.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="portOfDischarge">Port of Discharge</Label>
              <Input
                id="portOfDischarge"
                value={fields.portOfDischarge}
                onChange={(e) => set("portOfDischarge", e.target.value)}
                placeholder="e.g. Ho Chi Minh City, Mumbai"
                data-ocid="form.port-of-discharge.input"
              />
            </div>
          </FieldRow>

          <div className="space-y-1.5">
            <Label htmlFor="shipmentPeriod">Shipment Period</Label>
            <Input
              id="shipmentPeriod"
              value={fields.shipmentPeriod}
              onChange={(e) => set("shipmentPeriod", e.target.value)}
              placeholder="e.g. April/May 2025 or within 30 days of LC"
              data-ocid="form.shipment-period.input"
            />
          </div>

          <FieldRow>
            <div className="space-y-1.5">
              <Label>Inspection Agency</Label>
              <Select
                value={fields.inspectionAgency}
                onValueChange={(v) => set("inspectionAgency", v)}
              >
                <SelectTrigger data-ocid="form.inspection-agency.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSPECTION_AGENCIES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Packaging</Label>
              <Select
                value={fields.packaging}
                onValueChange={(v) => set("packaging", v)}
              >
                <SelectTrigger data-ocid="form.packaging.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGING_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FieldRow>
        </div>
      </section>

      {/* Dynamic Commodity Specifications */}
      <section>
        <CommoditySpecs
          commodityType={commodityType}
          fields={fields}
          set={set}
        />
      </section>

      {/* Extra document-specific fields */}
      {extraFields && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
            Additional Details
          </h3>
          {extraFields}
        </section>
      )}
    </div>
  );
}
