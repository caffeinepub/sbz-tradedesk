export interface DocTypeInfo {
  id: string;
  label: string;
  description: string;
  icon: string;
  category:
    | "inquiry"
    | "offer"
    | "contract"
    | "invoice"
    | "certificate"
    | "inspection";
}

export const DOC_TYPES: DocTypeInfo[] = [
  {
    id: "buyer-inquiry",
    label: "Buyer Inquiry",
    description: "Professional purchase inquiry letter to sellers",
    icon: "FileSearch",
    category: "inquiry",
  },
  {
    id: "loi",
    label: "Letter of Intent (LOI)",
    description: "Formal buyer letter of intent to purchase",
    icon: "FileText",
    category: "inquiry",
  },
  {
    id: "fco",
    label: "Full Corporate Offer (FCO)",
    description: "Seller's formal offer with all trade terms",
    icon: "Handshake",
    category: "offer",
  },
  {
    id: "icpo",
    label: "ICPO",
    description: "Irrevocable Corporate Purchase Order",
    icon: "ShoppingCart",
    category: "offer",
  },
  {
    id: "proforma-invoice",
    label: "Proforma Invoice",
    description: "Pre-shipment invoice with specifications",
    icon: "Receipt",
    category: "invoice",
  },
  {
    id: "sales-contract",
    label: "Sales Contract",
    description: "Full trade contract with all legal clauses",
    icon: "ScrollText",
    category: "contract",
  },
  {
    id: "lc-draft",
    label: "LC Draft (MT700)",
    description: "SWIFT MT700 Letter of Credit draft",
    icon: "Building2",
    category: "contract",
  },
  {
    id: "sgs-inspection",
    label: "SGS Inspection Request",
    description: "Inspection agency request for quality checks",
    icon: "ClipboardCheck",
    category: "inspection",
  },
  {
    id: "commercial-invoice",
    label: "Commercial Invoice",
    description: "Standard export commercial invoice",
    icon: "FileSpreadsheet",
    category: "invoice",
  },
  {
    id: "packing-list",
    label: "Packing List",
    description: "Container packing details and weights",
    icon: "Package",
    category: "invoice",
  },
  {
    id: "certificate-of-origin",
    label: "Certificate of Origin",
    description: "Country of origin certification document",
    icon: "Globe",
    category: "certificate",
  },
  {
    id: "phytosanitary",
    label: "Phytosanitary Certificate",
    description: "Plant health certificate for export",
    icon: "Leaf",
    category: "certificate",
  },
  {
    id: "fumigation",
    label: "Fumigation Certificate",
    description: "Cargo fumigation treatment certificate",
    icon: "Wind",
    category: "certificate",
  },
];

export interface CommonTradeFields {
  sellerName: string;
  sellerAddress: string;
  buyerName: string;
  buyerAddress: string;
  commodity: string;
  commodityType: string;
  origin: string;
  cropYear: string;
  quantity: string;
  unitPrice: string;
  totalValue: string;
  incoterm: string;
  portOfLoading: string;
  portOfDischarge: string;
  shipmentPeriod: string;
  paymentTerms: string;
  inspectionAgency: string;
  packaging: string;
  // RCN specs
  nutCount: string;
  outtureLbs: string;
  moisture: string;
  defective: string;
  foreignMatter: string;
  // Cashew Kernel specs
  cashewKernelGrade: string;
  cashewKernelPacking: string;
  brokenPercent: string;
  // Rice specs
  riceVariety: string;
  riceLength: string;
  riceColor: string;
  ricePacking: string;
  // Generic specs
  gradeQuality: string;
  additionalSpecs: string;
}

export const DEFAULT_COMMON_FIELDS: CommonTradeFields = {
  sellerName: "",
  sellerAddress: "",
  buyerName: "",
  buyerAddress: "",
  commodity: "Raw Cashew Nuts in Shell",
  commodityType: "Raw Cashew Nuts (RCN)",
  origin: "",
  cropYear: new Date().getFullYear().toString(),
  quantity: "",
  unitPrice: "",
  totalValue: "",
  incoterm: "FOB",
  portOfLoading: "",
  portOfDischarge: "",
  shipmentPeriod: "",
  paymentTerms: "LC at Sight",
  inspectionAgency: "SGS",
  packaging: "80 KG Jute Bags",
  nutCount: "180",
  outtureLbs: "48",
  moisture: "10%",
  defective: "10%",
  foreignMatter: "1%",
  cashewKernelGrade: "",
  cashewKernelPacking: "",
  brokenPercent: "",
  riceVariety: "",
  riceLength: "",
  riceColor: "",
  ricePacking: "",
  gradeQuality: "",
  additionalSpecs: "",
};

export const COMMODITY_TYPES = [
  "Raw Cashew Nuts (RCN)",
  "Cashew Kernels",
  "Rice",
  "Spices",
  "Other Agro Commodities",
];

export const CASHEW_KERNEL_GRADES = [
  "W180",
  "W210",
  "W240",
  "W320",
  "W450",
  "Splits",
  "Pieces",
  "Other",
];

export const CASHEW_KERNEL_PACKING = ["Vacuum Tin", "Carton", "Other"];

export const RICE_VARIETIES = [
  "Basmati",
  "1121 Basmati",
  "1509 Basmati",
  "Sella Rice",
  "Non-Basmati Rice",
  "IR64",
  "Ponni",
  "Sona Masoori",
  "Other",
];

export const RICE_PACKING = ["25kg bags", "50kg bags", "Other"];

export const BROKEN_PERCENT_CASHEW = ["2%", "5%", "8%", "Other"];
export const BROKEN_PERCENT_RICE = ["2%", "5%", "10%", "25%", "Other"];

export const ORIGINS = [
  "Ivory Coast",
  "Benin",
  "Ghana",
  "Tanzania",
  "Nigeria",
  "Guinea-Bissau",
  "Other",
];
export const INCOTERMS = ["FOB", "CFR", "CIF"];
export const PAYMENT_TERMS = ["LC at Sight", "CAD", "TT"];
export const INSPECTION_AGENCIES = [
  "SGS",
  "Bureau Veritas",
  "Intertek",
  "Other",
];
export const PACKAGING_OPTIONS = [
  "80 KG Jute Bags",
  "100 KG Jute Bags",
  "Other",
];
export const NUT_COUNTS = ["170", "180", "190", "200", "Other"];
export const OUTTURN_LBS = ["45", "46", "47", "48", "49", "50", "Other"];
export const MOISTURE_OPTIONS = ["8%", "9%", "10%", "Other"];
export const DEFECTIVE_OPTIONS = ["8%", "10%", "12%", "Other"];
export const FOREIGN_MATTER_OPTIONS = ["0.5%", "1%", "Other"];
