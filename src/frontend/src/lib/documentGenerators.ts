import type { CommonTradeFields } from "./documentTypes";

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function refNum(prefix: string): string {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

function buildCommoditySpec(
  f: CommonTradeFields & Record<string, string>,
): string {
  const commodityType = f.commodityType || "Raw Cashew Nuts (RCN)";
  const lines: string[] = [];

  const addLine = (label: string, value: string | undefined, unit = "") => {
    if (value?.trim()) {
      lines.push(`  ${label.padEnd(16)}: ${value}${unit}`);
    }
  };

  if (commodityType === "Raw Cashew Nuts (RCN)") {
    addLine("Commodity", f.commodity);
    addLine("Origin", f.origin);
    addLine("Crop Year", f.cropYear);
    addLine("Nut Count", f.nutCount, " nuts/kg");
    addLine("Outturn", f.outtureLbs ? `Min ${f.outtureLbs} LBS` : "");
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Defective", f.defective ? `Max ${f.defective}` : "");
    addLine("Foreign Matter", f.foreignMatter ? `Max ${f.foreignMatter}` : "");
    addLine("Packaging", f.packaging);
  } else if (commodityType === "Cashew Kernels") {
    addLine("Commodity", f.commodity);
    addLine("Origin", f.origin);
    addLine("Crop Year", f.cropYear);
    addLine("Grade", f.cashewKernelGrade);
    addLine("Packing Type", f.cashewKernelPacking);
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Broken", f.brokenPercent ? `Max ${f.brokenPercent}` : "");
    addLine("Packaging", f.packaging);
  } else if (commodityType === "Rice") {
    addLine("Commodity", f.commodity);
    addLine("Origin", f.origin);
    addLine("Crop Year", f.cropYear);
    addLine("Variety", f.riceVariety);
    addLine("Broken", f.brokenPercent ? `Max ${f.brokenPercent}` : "");
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Length", f.riceLength);
    addLine("Color", f.riceColor);
    addLine("Packing", f.ricePacking);
    addLine("Packaging", f.packaging);
  } else {
    // Spices / Other
    addLine("Commodity", f.commodity);
    addLine("Origin", f.origin);
    addLine("Crop Year", f.cropYear);
    addLine("Grade / Quality", f.gradeQuality);
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Packaging", f.packaging);
    if (f.additionalSpecs?.trim()) {
      lines.push(`  Additional Specs : ${f.additionalSpecs}`);
    }
  }

  if (lines.length === 0) return "";
  return `COMMODITY SPECIFICATIONS:\n${lines.join("\n")}`;
}

/** Build inline spec lines (for use inside sections like Sales Contract clause 2, LC :45A) */
function buildInlineSpecLines(
  f: CommonTradeFields & Record<string, string>,
): string {
  const commodityType = f.commodityType || "Raw Cashew Nuts (RCN)";
  const lines: string[] = [];

  const addLine = (label: string, value: string | undefined, unit = "") => {
    if (value?.trim()) {
      lines.push(`   ${label.padEnd(16)}: ${value}${unit}`);
    }
  };

  if (commodityType === "Raw Cashew Nuts (RCN)") {
    addLine("Nut Count", f.nutCount, " nuts/kg");
    addLine(
      "Outturn",
      f.outtureLbs ? `Min ${f.outtureLbs} LBS per 80kg bag` : "",
    );
    addLine("Moisture Content", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Defective Nuts", f.defective ? `Max ${f.defective}` : "");
    addLine("Foreign Matter", f.foreignMatter ? `Max ${f.foreignMatter}` : "");
  } else if (commodityType === "Cashew Kernels") {
    addLine("Grade", f.cashewKernelGrade);
    addLine("Packing Type", f.cashewKernelPacking);
    addLine("Moisture Content", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Broken", f.brokenPercent ? `Max ${f.brokenPercent}` : "");
  } else if (commodityType === "Rice") {
    addLine("Variety", f.riceVariety);
    addLine("Broken", f.brokenPercent ? `Max ${f.brokenPercent}` : "");
    addLine("Moisture Content", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Length", f.riceLength);
    addLine("Color", f.riceColor);
    addLine("Packing", f.ricePacking);
  } else {
    addLine("Grade / Quality", f.gradeQuality);
    addLine("Moisture Content", f.moisture ? `Max ${f.moisture}` : "");
    if (f.additionalSpecs?.trim()) {
      lines.push(`   Additional Specs : ${f.additionalSpecs}`);
    }
  }

  return lines.join("\n");
}

/** Build LC :45A spec block (uppercase, compact) */
function buildLCSpecLines(
  f: CommonTradeFields & Record<string, string>,
): string {
  const commodityType = f.commodityType || "Raw Cashew Nuts (RCN)";
  const lines: string[] = [];

  const addLine = (label: string, value: string | undefined, unit = "") => {
    if (value?.trim()) {
      lines.push(`        ${label}: ${value.toUpperCase()}${unit}`);
    }
  };

  if (commodityType === "Raw Cashew Nuts (RCN)") {
    addLine("NUT COUNT", f.nutCount, " NUTS/KG");
    addLine("OUTTURN", f.outtureLbs ? `MIN ${f.outtureLbs} LBS` : "");
    addLine("MOISTURE", f.moisture ? `MAX ${f.moisture}` : "");
    addLine("DEFECTIVE", f.defective ? `MAX ${f.defective}` : "");
    addLine("FOREIGN MATTER", f.foreignMatter ? `MAX ${f.foreignMatter}` : "");
  } else if (commodityType === "Cashew Kernels") {
    addLine("GRADE", f.cashewKernelGrade);
    addLine("PACKING TYPE", f.cashewKernelPacking);
    addLine("MOISTURE", f.moisture ? `MAX ${f.moisture}` : "");
    addLine("BROKEN", f.brokenPercent ? `MAX ${f.brokenPercent}` : "");
  } else if (commodityType === "Rice") {
    addLine("VARIETY", f.riceVariety);
    addLine("BROKEN", f.brokenPercent ? `MAX ${f.brokenPercent}` : "");
    addLine("MOISTURE", f.moisture ? `MAX ${f.moisture}` : "");
    addLine("LENGTH", f.riceLength);
    addLine("COLOR", f.riceColor);
  } else {
    addLine("GRADE / QUALITY", f.gradeQuality);
    addLine("MOISTURE", f.moisture ? `MAX ${f.moisture}` : "");
    if (f.additionalSpecs?.trim()) {
      lines.push(
        `        ADDITIONAL SPECS: ${f.additionalSpecs.toUpperCase()}`,
      );
    }
  }

  return lines.length > 0 ? `      SPECIFICATIONS:\n${lines.join("\n")}` : "";
}

/** Build SGS inspection scope lines dynamically */
function buildSGSScope(f: CommonTradeFields & Record<string, string>): string {
  const commodityType = f.commodityType || "Raw Cashew Nuts (RCN)";
  const lines: string[] = [];

  const addLine = (label: string, value: string | undefined, prefix = "") => {
    if (value?.trim()) {
      lines.push(`     * ${label} (Target: ${prefix}${value})`);
    }
  };

  if (commodityType === "Raw Cashew Nuts (RCN)") {
    addLine("Moisture Content", f.moisture, "Max ");
    addLine("Defective Nuts", f.defective, "Max ");
    addLine("Foreign Matter", f.foreignMatter, "Max ");
    addLine("Nut Count", f.nutCount ? `${f.nutCount} nuts/kg` : "");
    addLine("Outturn Analysis", f.outtureLbs ? `Min ${f.outtureLbs} LBS` : "");
  } else if (commodityType === "Cashew Kernels") {
    addLine("Grade", f.cashewKernelGrade);
    addLine("Moisture Content", f.moisture, "Max ");
    addLine("Broken", f.brokenPercent, "Max ");
  } else if (commodityType === "Rice") {
    addLine("Moisture Content", f.moisture, "Max ");
    addLine("Broken", f.brokenPercent, "Max ");
    addLine("Variety", f.riceVariety);
  } else {
    addLine("Grade / Quality", f.gradeQuality);
    addLine("Moisture Content", f.moisture, "Max ");
    if (f.additionalSpecs?.trim()) {
      lines.push(`     * Additional Specs: ${f.additionalSpecs}`);
    }
  }

  return lines.join("\n");
}

/** Build SGS quality parameters block */
function buildSGSQualityParams(
  f: CommonTradeFields & Record<string, string>,
): string {
  const commodityType = f.commodityType || "Raw Cashew Nuts (RCN)";
  const lines: string[] = [];

  const addLine = (label: string, value: string | undefined, unit = "") => {
    if (value?.trim()) {
      lines.push(`  ${label.padEnd(16)}: ${value}${unit}`);
    }
  };

  if (commodityType === "Raw Cashew Nuts (RCN)") {
    addLine("Nut Count", f.nutCount, " nuts/kg");
    addLine("Outturn (LBS)", f.outtureLbs ? `Min ${f.outtureLbs} LBS` : "");
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Defective", f.defective ? `Max ${f.defective}` : "");
    addLine("Foreign Matter", f.foreignMatter ? `Max ${f.foreignMatter}` : "");
  } else if (commodityType === "Cashew Kernels") {
    addLine("Grade", f.cashewKernelGrade);
    addLine("Packing Type", f.cashewKernelPacking);
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Broken", f.brokenPercent ? `Max ${f.brokenPercent}` : "");
  } else if (commodityType === "Rice") {
    addLine("Variety", f.riceVariety);
    addLine("Broken", f.brokenPercent ? `Max ${f.brokenPercent}` : "");
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    addLine("Length", f.riceLength);
    addLine("Color", f.riceColor);
  } else {
    addLine("Grade / Quality", f.gradeQuality);
    addLine("Moisture", f.moisture ? `Max ${f.moisture}` : "");
    if (f.additionalSpecs?.trim()) {
      lines.push(`  Additional Specs : ${f.additionalSpecs}`);
    }
  }

  return lines.join("\n");
}

export function generateBuyerInquiry(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const specBlock = buildCommoditySpec(fields);
  return `
BUYER INQUIRY LETTER
Reference: ${refNum("BI")}
Date: ${today()}

FROM:
${fields.buyerName}
${fields.buyerAddress || "[Buyer Address]"}

TO:
${fields.sellerName || "[Seller Name]"}
${fields.sellerAddress || "[Seller Address]"}

Dear Sir/Madam,

RE: FIRM INQUIRY FOR ${fields.commodity.toUpperCase()} – ${fields.origin.toUpperCase()}

We write to express our serious interest in purchasing the above-referenced commodity and
hereby submit our formal inquiry as follows:

INQUIRY DETAILS:
  Commodity       : ${fields.commodity}
  Origin          : ${fields.origin}
  Quantity        : ${fields.quantity} MT
  Target Price    : USD ${fields.unitPrice}/MT ${fields.incoterm}
  Payment Terms   : ${fields.paymentTerms}
  Destination Port: ${fields.portOfDischarge || "[Port of Discharge]"}
${
  specBlock
    ? `
${specBlock}`
    : ""
}

We kindly request you to revert with your best offer including product specifications, availability,
and any documents required to proceed with the transaction.

This inquiry is issued in good faith and we look forward to a productive business relationship.

Yours faithfully,

_________________________________
${fields.buyerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generateLOI(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const specBlock = buildCommoditySpec(fields);
  return `
LETTER OF INTENT (LOI)
Reference: ${refNum("LOI")}
Date: ${today()}

FROM (BUYER):
${fields.buyerName}
${fields.buyerAddress || "[Buyer Address]"}

TO (SELLER):
${fields.sellerName || "[Seller Name]"}
${fields.sellerAddress || "[Seller Address]"}

Dear Sir/Madam,

RE: LETTER OF INTENT TO PURCHASE – ${fields.commodity.toUpperCase()}

We, ${fields.buyerName}, hereby issue this irrevocable Letter of Intent (LOI) to purchase
the following commodity under the terms stated below:

PURCHASE TERMS:
  Commodity       : ${fields.commodity}
  Origin          : ${fields.origin}
  Quantity        : ${fields.quantity} MT
  Target Price    : USD ${fields.unitPrice}/MT ${fields.incoterm}
  Total Value     : USD ${fields.totalValue}
  Payment Terms   : ${fields.paymentTerms}
  Port of Loading : ${fields.portOfLoading || "[Port of Loading]"}
  Destination Port: ${fields.portOfDischarge || "[Port of Discharge]"}
  Shipment Period : ${fields.shipmentPeriod || "[Shipment Period]"}
${
  specBlock
    ? `
${specBlock}`
    : ""
}

INSPECTION: The shipment shall be subject to inspection by ${fields.inspectionAgency} at
load port prior to shipment.

VALIDITY OF THIS LOI: This Letter of Intent is valid for 72 hours from the date hereof.
Upon receipt of the Seller's Full Corporate Offer (FCO), the Buyer shall proceed to issue
the relevant proof of funds and payment instrument.

This LOI is issued in good faith. The Buyer is a serious and capable buyer with full
mandate to consummate this transaction.

Issued by:

_________________________________
${fields.buyerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generateFCO(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const validity = fields.validity || "72 hours from the date of issuance";
  const specBlock = buildCommoditySpec(fields);
  return `
FULL CORPORATE OFFER (FCO)
Reference: ${refNum("FCO")}
Date: ${today()}

FROM (SELLER):
${fields.sellerName}
${fields.sellerAddress || "[Seller Address]"}

TO (BUYER):
${fields.buyerName || "[Buyer Name]"}
${fields.buyerAddress || "[Buyer Address]"}

Dear Sir/Madam,

RE: FULL CORPORATE OFFER – ${fields.commodity.toUpperCase()} – ${fields.origin.toUpperCase()}

We, ${fields.sellerName}, hereby issue this Full Corporate Offer (FCO) for the sale
of the following commodity:

OFFER TERMS:
  Commodity       : ${fields.commodity}
  Origin          : ${fields.origin}
  Quantity        : ${fields.quantity} MT (±5% at Seller's option)
  Unit Price      : USD ${fields.unitPrice}/MT ${fields.incoterm}
  Total Value     : USD ${fields.totalValue}
  Port of Loading : ${fields.portOfLoading || "[Port of Loading]"}
  Port of Discharge: ${fields.portOfDischarge || "[Port of Discharge]"}
  Shipment Period : ${fields.shipmentPeriod || "[Shipment Period]"}
  Payment Terms   : ${fields.paymentTerms}
  Validity        : ${validity}
${
  specBlock
    ? `
${specBlock}`
    : ""
}

INSPECTION: Cargo to be inspected by ${fields.inspectionAgency} at origin warehouse
and at load port prior to loading. Inspection cost at Buyer's account.

CONDITIONS:
1. Price is subject to final confirmation upon receipt of Buyer's signed ICPO.
2. Seller reserves the right to withdraw this offer before acceptance.
3. This offer is subject to contract to be mutually agreed.
4. Force Majeure conditions as per ICC rules shall apply.

We look forward to your prompt response and hope for a successful partnership.

Sincerely,

_________________________________
${fields.sellerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generateICPO(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const specBlock = buildCommoditySpec(fields);
  return `
IRREVOCABLE CORPORATE PURCHASE ORDER (ICPO)
Reference: ${refNum("ICPO")}
Date: ${today()}

FROM (BUYER):
${fields.buyerName}
${fields.buyerAddress || "[Buyer Address]"}

TO (SELLER):
${fields.sellerName || "[Seller Name]"}
${fields.sellerAddress || "[Seller Address]"}

Dear Sir/Madam,

We, ${fields.buyerName} (hereinafter "Buyer"), hereby issue this Irrevocable Corporate
Purchase Order (ICPO) for the purchase of the below-described commodity:

PURCHASE ORDER DETAILS:
  Commodity       : ${fields.commodity}
  Origin          : ${fields.origin}
  Quantity        : ${fields.quantity} MT
  Unit Price      : USD ${fields.unitPrice}/MT ${fields.incoterm}
  Total Value     : USD ${fields.totalValue}
  Payment Method  : ${fields.paymentTerms}
  Port of Loading : ${fields.portOfLoading || "[Port of Loading]"}
  Port of Discharge: ${fields.portOfDischarge || "[Port of Discharge]"}
  Shipment Period : ${fields.shipmentPeriod || "[Shipment Period]"}
${
  specBlock
    ? `
${specBlock}`
    : ""
}

BUYER'S DECLARATION:
1. This ICPO is irrevocable and firm from the date of signing.
2. The Buyer has the full mandate and financial capability to complete this transaction.
3. Upon receipt of the Seller's FCO, the Buyer undertakes to proceed with the agreed
   payment instrument within the stipulated timeframe.
4. Inspection shall be conducted by ${fields.inspectionAgency} at load port.

We request the Seller to proceed and revert with the Sales/Purchase Contract for execution.

Signed by Buyer:

_________________________________
${fields.buyerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generateProformaInvoice(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const invoiceNo = fields.invoiceNumber || refNum("PI");
  const hsCode = fields.hsCode || "0801.31.00";
  const specBlock = buildCommoditySpec(fields);
  return `
PROFORMA INVOICE
Invoice No   : ${invoiceNo}
Date         : ${today()}

SELLER / EXPORTER:
${fields.sellerName}
${fields.sellerAddress || "[Seller Address]"}

BUYER / IMPORTER:
${fields.buyerName || "[Buyer Name]"}
${fields.buyerAddress || "[Buyer Address]"}

SHIPMENT DETAILS:
  Port of Loading   : ${fields.portOfLoading || "[Port of Loading]"}
  Port of Discharge : ${fields.portOfDischarge || "[Port of Discharge]"}
  Incoterm          : ${fields.incoterm}
  Shipment Period   : ${fields.shipmentPeriod || "[Shipment Period]"}
  Payment Terms     : ${fields.paymentTerms}

LINE ITEM:
─────────────────────────────────────────────────────────────────
  Description   : ${fields.commodity}
  HS Code       : ${hsCode}
  Origin        : ${fields.origin}
${fields.cropYear ? `  Crop Year     : ${fields.cropYear}` : ""}
  Quantity      : ${fields.quantity} Metric Tons
  Unit Price    : USD ${fields.unitPrice} per MT (${fields.incoterm})
  Total Amount  : USD ${fields.totalValue}
─────────────────────────────────────────────────────────────────
  TOTAL         : USD ${fields.totalValue}
─────────────────────────────────────────────────────────────────
${
  specBlock
    ? `
${specBlock}`
    : ""
}

INSPECTION: By ${fields.inspectionAgency} at load port. SGS weight and quality
certificate shall be provided.

BANKING DETAILS: As per Sales Contract / LC instructions.

This proforma invoice is valid for 7 days from the date of issuance.

Authorized by:

_________________________________
${fields.sellerName}
`.trim();
}

export function generateSalesContract(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const contractNo = fields.contractNumber || refNum("SC");
  const specLines = buildInlineSpecLines(fields);
  return `
SALES CONTRACT
Contract No : ${contractNo}
Date        : ${today()}

PARTIES:
  SELLER : ${fields.sellerName}
           ${fields.sellerAddress || "[Seller Address]"}

  BUYER  : ${fields.buyerName || "[Buyer Name]"}
           ${fields.buyerAddress || "[Buyer Address]"}

1. COMMODITY
   ${fields.commodity}${fields.origin ? `, Origin: ${fields.origin}` : ""}${fields.cropYear ? `, Crop Year: ${fields.cropYear}` : ""}

2. SPECIFICATIONS
${specLines || "   [Specifications as per mutual agreement]"}

3. QUANTITY
   ${fields.quantity} Metric Tons (±5% at Seller's option)

4. PRICE & VALUE
   Unit Price  : USD ${fields.unitPrice} per Metric Ton, ${fields.incoterm}
   Total Value : USD ${fields.totalValue}

5. PACKING
   ${fields.packaging || "[Packaging as agreed]"}. All bags shall be new, clean, and suitable for ocean freight.

6. PORT OF LOADING
   ${fields.portOfLoading || "[Port of Loading]"}

7. PORT OF DISCHARGE
   ${fields.portOfDischarge || "[Port of Discharge]"}

8. SHIPMENT PERIOD
   ${fields.shipmentPeriod || "[Shipment Period]"}

9. PAYMENT TERMS
   ${fields.paymentTerms}. All bank charges outside the Seller's country are for Buyer's account.

10. INSPECTION
    Cargo shall be inspected by ${fields.inspectionAgency} or any internationally recognized
    inspection agency at load port. Quality and weight at loading shall be final.
    Inspection costs to be borne by the Buyer.

11. DOCUMENTS
    The following documents shall be provided:
    a) Original Bill of Lading (3/3)
    b) Commercial Invoice
    c) Packing List
    d) ${fields.inspectionAgency} Quality & Weight Certificate
    e) Certificate of Origin (Form A or relevant)
    f) Phytosanitary Certificate
    g) Fumigation Certificate

12. FORCE MAJEURE
    Neither party shall be liable for failure or delay in performance resulting from
    circumstances beyond their reasonable control, including but not limited to acts
    of God, war, strikes, floods, embargoes, or government restrictions. The affected
    party shall notify the other within 7 days of occurrence.

13. ARBITRATION
    Any dispute arising from or in connection with this contract that cannot be resolved
    amicably shall be referred to arbitration under the rules of the International Chamber
    of Commerce (ICC), Paris. The arbitration shall be conducted in English.

14. GOVERNING LAW
    This contract shall be governed by the laws of [Jurisdiction as agreed].

15. ENTIRE AGREEMENT
    This contract constitutes the entire agreement between the parties and supersedes
    all prior negotiations and communications.

IN WITNESS WHEREOF, the parties have executed this contract as of the date first written above.

SELLER:                              BUYER:
_______________________              _______________________
${fields.sellerName}                   ${fields.buyerName || "[Buyer Name]"}
Authorized Signatory                  Authorized Signatory
Date: ${today()}                        Date: ${today()}
`.trim();
}

export function generateLCDraft(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const lcRef = fields.lcReference || refNum("LC");
  const issueDate = today();
  const expiryDate = fields.expiryDate || "[Expiry Date]";
  const lcSpecBlock = buildLCSpecLines(fields);
  return `
SWIFT MESSAGE TYPE MT700 – ISSUE OF A DOCUMENTARY CREDIT

:40A: IRREVOCABLE
:20:  ${lcRef}
:31C: ${issueDate}
:31D: ${expiryDate} ${fields.portOfDischarge || "[Place of Expiry]"}

:50:  [ISSUING BANK NAME]
      [ISSUING BANK ADDRESS]
      [COUNTRY]

:59:  ${fields.sellerName}
      ${fields.sellerAddress || "[Seller Address]"}

:32B: USD ${fields.totalValue}
:39A: 05/05

:41A: [CONFIRMING BANK / ANY BANK] BY NEGOTIATION

:42C: SIGHT AFTER BILL OF LADING DATE
:43P: PARTIAL SHIPMENTS NOT ALLOWED
:43T: TRANSHIPMENT NOT ALLOWED

:44A: ${fields.portOfLoading || "[Port of Loading]"}
:44B: ${fields.portOfDischarge || "[Port of Discharge]"}
:44C: ${fields.shipmentPeriod || "[Latest Shipment Date]"}

:45A: GOODS DESCRIPTION:
      ${fields.quantity} METRIC TONS OF ${fields.commodity.toUpperCase()}
      ORIGIN: ${fields.origin.toUpperCase()}
${fields.cropYear ? `      CROP YEAR: ${fields.cropYear}` : ""}
${lcSpecBlock}
      PACKING: ${fields.packaging ? fields.packaging.toUpperCase() : "[PACKING AS PER CONTRACT]"}
      INCOTERM: ${fields.incoterm} ${fields.portOfLoading ? fields.portOfLoading.toUpperCase() : "[PORT OF LOADING]"}
      UNIT PRICE: USD ${fields.unitPrice}/MT
      TOTAL: USD ${fields.totalValue}

:46A: REQUIRED DOCUMENTS:
      1. SIGNED COMMERCIAL INVOICE IN 3 ORIGINALS AND 3 COPIES
      2. FULL SET (3/3) ORIGINAL CLEAN ON BOARD OCEAN BILLS OF LADING
         MADE OUT TO ORDER AND BLANK ENDORSED
         MARKED FREIGHT PREPAID/COLLECT
         NOTIFY APPLICANT
      3. PACKING LIST IN 2 ORIGINALS AND 2 COPIES
      4. ${fields.inspectionAgency} QUALITY AND WEIGHT CERTIFICATE (ORIGINAL)
      5. CERTIFICATE OF ORIGIN ISSUED BY CHAMBER OF COMMERCE (ORIGINAL)
      6. PHYTOSANITARY CERTIFICATE ISSUED BY COMPETENT AUTHORITY (ORIGINAL)
      7. FUMIGATION CERTIFICATE (ORIGINAL)

:47A: ADDITIONAL CONDITIONS:
      1. ALL DOCUMENTS TO BE IN ENGLISH
      2. STALE DOCUMENTS NOT ACCEPTABLE
      3. THIRD PARTY DOCUMENTS NOT ACCEPTABLE
      4. INSPECTION AT LOAD PORT BY ${fields.inspectionAgency}. INSPECTION
         CERTIFICATE REQUIRED FOR PAYMENT.
      5. THIS CREDIT IS SUBJECT TO UCP 600.

:71B: ALL BANK CHARGES OUTSIDE ${fields.origin.toUpperCase()} ARE FOR ACCOUNT OF BENEFICIARY

:48:  DOCUMENTS MUST BE PRESENTED WITHIN 21 DAYS AFTER THE DATE OF
      SHIPMENT BUT WITHIN THE VALIDITY OF THIS CREDIT.

:49:  WITHOUT
`.trim();
}

export function generateSGSInspection(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const sgsScope = buildSGSScope(fields);
  const sgsQuality = buildSGSQualityParams(fields);
  return `
SGS INSPECTION REQUEST FORM
Reference: ${refNum("SGS")}
Date: ${today()}

TO: ${fields.inspectionAgency}
    [${fields.inspectionAgency} Regional Office – ${fields.origin}]

FROM:
${fields.sellerName}
${fields.sellerAddress || "[Seller Address]"}

RE: INSPECTION REQUEST FOR ${fields.commodity.toUpperCase()} SHIPMENT

We hereby request ${fields.inspectionAgency} to carry out inspection and supervision services
for the following cargo:

CARGO DETAILS:
  Commodity       : ${fields.commodity}
  Origin          : ${fields.origin}
${fields.cropYear ? `  Crop Year       : ${fields.cropYear}` : ""}
  Quantity        : ${fields.quantity} MT
${fields.packaging ? `  Packaging       : ${fields.packaging}` : ""}
  Port of Loading : ${fields.portOfLoading || "[Port of Loading]"}
  Buyer           : ${fields.buyerName || "[Buyer Name]"}

INSPECTION SCOPE:

A. WAREHOUSE INSPECTION (PRE-SHIPMENT)
   - Visual inspection of bags for damage or contamination
   - Sampling and laboratory analysis for:
${sgsScope || "     * As per contractual specifications"}
   - Weight determination (gross / net / tare)
   - Bag count and condition report

B. PORT STUFFING SUPERVISION (AT LOAD PORT)
   - Supervision of container/vessel stuffing
   - Final weight verification (draft survey or weighbridge)
   - Container sealing and seal number recording
   - Photo documentation of loading process
${
  sgsQuality
    ? `
QUALITY PARAMETERS TO CERTIFY:
${sgsQuality}`
    : ""
}

CERTIFICATES REQUIRED:
  1. Quality Certificate (original)
  2. Weight Certificate (original)
  3. Sampling and Analysis Report
  4. Phytosanitary Inspection Support

CONTACT FOR COORDINATION:
  Name  : [Contact Name]
  Phone : [Phone Number]
  Email : [Email Address]

Please confirm your availability and quote your inspection fees at the earliest.

Yours faithfully,

_________________________________
${fields.sellerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generateCommercialInvoice(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const invoiceNo = fields.invoiceNumber || refNum("CI");
  const hsCode = fields.hsCode || "0801.31.00";
  return `
COMMERCIAL INVOICE
Invoice No   : ${invoiceNo}
Date         : ${today()}

EXPORTER / SELLER:
${fields.sellerName}
${fields.sellerAddress || "[Seller Address]"}
Country of Export: ${fields.origin}

IMPORTER / BUYER / CONSIGNEE:
${fields.buyerName || "[Buyer Name]"}
${fields.buyerAddress || "[Buyer Address]"}

SHIPMENT INFORMATION:
  Vessel/Voyage     : [Vessel Name / Voyage No]
  Bill of Lading No : [B/L Number]
  Port of Loading   : ${fields.portOfLoading || "[Port of Loading]"}
  Port of Discharge : ${fields.portOfDischarge || "[Port of Discharge]"}
  Shipment Date     : ${fields.shipmentPeriod || "[Shipment Date]"}
  Incoterm          : ${fields.incoterm}

GOODS DESCRIPTION:
─────────────────────────────────────────────────────────────────────
  HS Code    : ${hsCode}
  Description: ${fields.commodity}${fields.origin ? ` (${fields.origin}` : ""}${fields.cropYear ? `, ${fields.cropYear} crop)` : fields.origin ? ")" : ""}
  Quantity   : ${fields.quantity} Metric Tons
${fields.packaging ? `  Packaging  : ${fields.packaging}` : ""}
  Unit Price : USD ${fields.unitPrice} per MT (${fields.incoterm})
─────────────────────────────────────────────────────────────────────
  SUBTOTAL   : USD ${fields.totalValue}
  FREIGHT    : [If applicable]
  INSURANCE  : [If applicable]
─────────────────────────────────────────────────────────────────────
  TOTAL DUE  : USD ${fields.totalValue}
─────────────────────────────────────────────────────────────────────

PAYMENT TERMS: ${fields.paymentTerms}

COUNTRY OF ORIGIN: ${fields.origin}

INSPECTION: ${fields.inspectionAgency} Quality & Weight Certificate No: [Cert No]

DECLARATION:
I/We declare that the goods described above are in conformity with the specifications
and are the genuine product of ${fields.origin}${fields.cropYear ? `, crop year ${fields.cropYear}` : ""}.

_________________________________
${fields.sellerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generatePackingList(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const plNo = fields.packingListNumber || refNum("PL");
  const bagCount = fields.bagCount || "[Number of Bags]";
  const netPerBag =
    fields.netWeightPerBag || (fields.packaging.includes("80") ? "80" : "100");
  const grossPerBag =
    fields.grossWeightPerBag || String(Number(netPerBag) + 0.5);
  const totalNet =
    fields.totalNetWeight || `${Number(fields.quantity || 0) * 1000} KGS`;
  const totalGross = fields.totalGrossWeight || "[Total Gross Weight]";
  const containerNo = fields.containerNumber || "[Container No]";
  const specBlock = buildCommoditySpec(fields);

  return `
PACKING LIST
Packing List No : ${plNo}
Date            : ${today()}

EXPORTER / SHIPPER:
${fields.sellerName}
${fields.sellerAddress || "[Seller Address]"}

BUYER / CONSIGNEE:
${fields.buyerName || "[Buyer Name]"}
${fields.buyerAddress || "[Buyer Address]"}

SHIPMENT DETAILS:
  Port of Loading   : ${fields.portOfLoading || "[Port of Loading]"}
  Port of Discharge : ${fields.portOfDischarge || "[Port of Discharge]"}
  Incoterm          : ${fields.incoterm}
  Container Number  : ${containerNo}
  Seal Number       : [Seal Number]

PACKING DETAILS:
─────────────────────────────────────────────────────────────────────────────────────
  Mark & Number   Packages   Description             Net Weight    Gross Weight
─────────────────────────────────────────────────────────────────────────────────────
  SBZ/${plNo}    ${bagCount} Bags  ${fields.commodity}  ${netPerBag} KG/bag  ${grossPerBag} KG/bag
                            Origin: ${fields.origin}
${fields.cropYear ? `                            Crop Year: ${fields.cropYear}` : ""}
─────────────────────────────────────────────────────────────────────────────────────
  TOTAL           ${bagCount} Bags                        ${totalNet}      ${totalGross}
─────────────────────────────────────────────────────────────────────────────────────
${
  specBlock
    ? `
${specBlock.replace("COMMODITY SPECIFICATIONS:", "COMMODITY SPECIFICATIONS (AS PER CONTRACT):")}
`
    : ""
}

Note: Net and Gross weights are as per ${fields.inspectionAgency} weight certificate.
${fields.packaging ? `All bags are new ${fields.packaging} suitable for export.` : ""}

_________________________________
${fields.sellerName}
Authorized Signatory
Date: ${today()}
`.trim();
}

export function generateCertificateOfOrigin(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const certNo = refNum("COO");
  return `
CERTIFICATE OF ORIGIN
Certificate No : ${certNo}
Date           : ${today()}

ISSUED BY: CHAMBER OF COMMERCE AND INDUSTRY
           [Country of Origin Chamber / Authority]

1. EXPORTER / PRODUCER:
   ${fields.sellerName}
   ${fields.sellerAddress || "[Seller Address]"}
   ${fields.origin}

2. CONSIGNEE:
   ${fields.buyerName || "[Buyer Name]"}
   ${fields.buyerAddress || "[Buyer Address]"}

3. TRANSPORT DETAILS:
   Means of Transport : Ocean Freight
   Port of Loading    : ${fields.portOfLoading || "[Port of Loading]"}
   Port of Discharge  : ${fields.portOfDischarge || "[Port of Discharge]"}

4. GOODS DESCRIPTION:
─────────────────────────────────────────────────────────────────────
  Item  HS Code      Description                  Qty         Net Wt
─────────────────────────────────────────────────────────────────────
  01    0801.31.00   ${fields.commodity}      ${fields.quantity} MT  ${Number(fields.quantity || 0) * 1000} KGS
${fields.cropYear ? `                     Crop Year: ${fields.cropYear}` : ""}
${fields.packaging ? `                     Packaging: ${fields.packaging}` : ""}
─────────────────────────────────────────────────────────────────────

5. COUNTRY OF ORIGIN: ${fields.origin.toUpperCase()}

DECLARATION:
The undersigned authority certifies that the goods described above originate in
${fields.origin} and comply with the requirements applicable for export.

CERTIFICATION:

_________________________________
Authorized Issuing Officer
[Chamber of Commerce Stamp & Seal]
Certificate No: ${certNo}
Date: ${today()}

Note: This certificate is subject to verification by the competent authority.
`.trim();
}

export function generatePhytosanitary(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const certNo = refNum("PHY");
  return `
PHYTOSANITARY CERTIFICATE
Certificate No : ${certNo}
Date           : ${today()}

MINISTRY OF AGRICULTURE / NATIONAL PLANT PROTECTION ORGANIZATION
[Issuing Authority – ${fields.origin}]

1. NAME AND ADDRESS OF EXPORTER:
   ${fields.sellerName}
   ${fields.sellerAddress || "[Seller Address]"}

2. DECLARED NAME AND ADDRESS OF CONSIGNEE:
   ${fields.buyerName || "[Buyer Name]"}
   ${fields.buyerAddress || "[Buyer Address]"}

3. PLACE OF ORIGIN: ${fields.origin}

4. DECLARED MEANS OF CONVEYANCE: Ocean Vessel

5. DECLARED PORT OF ENTRY: ${fields.portOfDischarge || "[Port of Discharge]"}

6. DISTINGUISHING MARKS:   SBZ / ${certNo}

7. NUMBER AND DESCRIPTION OF PACKAGES:
   [Number of Bags] x ${fields.packaging}

8. NAME OF PRODUCE: ${fields.commodity}

9. QUANTITY DECLARED: ${fields.quantity} Metric Tons

10. BOTANICAL NAME OF PLANT: ${(fields.commodityType || "").includes("Rice") ? "Oryza sativa" : "Anacardium occidentale"}

ADDITIONAL DECLARATION:
This consignment of ${fields.commodity} originates from ${fields.origin} and
is free from quarantine pests. The cargo has been inspected and found to comply
with the phytosanitary requirements of the importing country.

Fumigation Details (if applicable):
  Fumigant        : Methyl Bromide / Phosphine
  Dosage          : [As per treatment details]
  Treatment Date  : [Date of Treatment]
  Duration        : [Treatment Duration]

This certificate is issued in accordance with the IPPC Model Certificate.

_________________________________
Authorized Certifying Officer
[Official Stamp]
National Plant Protection Organization
${fields.origin}
Date: ${today()}
`.trim();
}

export function generateFumigation(
  fields: CommonTradeFields & Record<string, string>,
): string {
  const certNo = refNum("FUM");
  return `
FUMIGATION CERTIFICATE
Certificate No : ${certNo}
Date           : ${today()}

ISSUED BY: [Licensed Fumigation Company]
           [Company Address]
           [License No]

1. APPLICANT / EXPORTER:
   ${fields.sellerName}
   ${fields.sellerAddress || "[Seller Address]"}

2. CONSIGNEE:
   ${fields.buyerName || "[Buyer Name]"}
   ${fields.buyerAddress || "[Buyer Address]"}

3. CARGO DETAILS:
   Commodity         : ${fields.commodity}
   Origin            : ${fields.origin}
${fields.cropYear ? `   Crop Year         : ${fields.cropYear}` : ""}
   Quantity          : ${fields.quantity} Metric Tons
${fields.packaging ? `   Packaging         : ${fields.packaging}` : ""}

4. VESSEL / CONTAINER DETAILS:
   Vessel Name       : [Vessel Name]
   Voyage No         : [Voyage Number]
   Container No(s)   : [Container Numbers]
   Seal No(s)        : [Seal Numbers]
   Port of Loading   : ${fields.portOfLoading || "[Port of Loading]"}

5. FUMIGATION TREATMENT DETAILS:
   Fumigant Used     : Phosphine (Aluminium Phosphide) / Methyl Bromide
   Dosage Applied    : [g/m³ or applicable dosage]
   Concentration     : [ppm]
   Application Date  : [Date of Application]
   Exposure Period   : [Minimum exposure hours]
   Completion Date   : [Date completed]
   Treatment Method  : [In-transit / In-store / Container fumigation]
   Temperature       : [°C during fumigation]

6. CERTIFICATION:
   This is to certify that the above-described cargo was treated with the fumigant
   as specified above in accordance with current standards and regulations. The cargo
   is hereby certified as fumigated and suitable for export.

   Clearance Date: [Date cleared for loading]

_________________________________
Fumigation Supervisor
[Licensed Fumigator Name]
[License No]
[Company Stamp]
Date: ${today()}
`.trim();
}

export type GeneratorFn = (
  fields: CommonTradeFields & Record<string, string>,
) => string;

export const GENERATORS: Record<string, GeneratorFn> = {
  "buyer-inquiry": generateBuyerInquiry,
  loi: generateLOI,
  fco: generateFCO,
  icpo: generateICPO,
  "proforma-invoice": generateProformaInvoice,
  "sales-contract": generateSalesContract,
  "lc-draft": generateLCDraft,
  "sgs-inspection": generateSGSInspection,
  "commercial-invoice": generateCommercialInvoice,
  "packing-list": generatePackingList,
  "certificate-of-origin": generateCertificateOfOrigin,
  phytosanitary: generatePhytosanitary,
  fumigation: generateFumigation,
};
