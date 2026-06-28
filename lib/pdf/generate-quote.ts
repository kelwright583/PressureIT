import jsPDF from "jspdf";

interface QuoteLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface QuotePDFData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  customer: {
    name: string;
    phone: string;
    email: string | null;
    service: string | null;
    area: string | null;
    propertyType: string | null;
    surfaceArea: string | null;
    address: string | null;
  };
  items: QuoteLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes: string;
  company: {
    phone: string;
    email: string;
  };
}

function formatCurrency(amount: number): string {
  return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function loadImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

// Brand colors
const BLACK = "#000000";
const YELLOW = "#FDE500";
const DARK_GRAY = "#1A1A1A";
const MID_GRAY = "#666666";
const LIGHT_GRAY = "#F5F5F5";
const WHITE = "#FFFFFF";

export async function generateQuotePDF(data: QuotePDFData): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  // Load logo
  let logoData: string | null = null;
  try {
    logoData = await loadImageAsDataUrl("/brand/logo-primary.jpg");
  } catch {
    // Logo loading failed, continue without
  }

  // ─── HEADER BAR ───────────────────────────────────────────────────
  doc.setFillColor(BLACK);
  doc.rect(0, 0, pageW, 42, "F");

  // Yellow accent stripe
  doc.setFillColor(YELLOW);
  doc.rect(0, 42, pageW, 3, "F");

  // Logo
  if (logoData) {
    doc.addImage(logoData, "JPEG", margin, 6, 55, 30);
  }

  // QUOTATION title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(YELLOW);
  doc.text("QUOTATION", pageW - margin, 20, { align: "right" });

  // Quote number
  doc.setFontSize(11);
  doc.setTextColor(WHITE);
  doc.text(data.quoteNumber, pageW - margin, 28, { align: "right" });

  // Date
  doc.setFontSize(9);
  doc.setTextColor("#AAAAAA");
  doc.text(`Date: ${data.date}`, pageW - margin, 35, { align: "right" });

  y = 55;

  // ─── CUSTOMER & QUOTE INFO CARDS ──────────────────────────────────
  const cardH = 52;
  const cardW = (contentW - 8) / 2;

  // Left card — PREPARED FOR
  doc.setFillColor(LIGHT_GRAY);
  doc.roundedRect(margin, y, cardW, cardH, 3, 3, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(MID_GRAY);
  doc.text("PREPARED FOR", margin + 6, y + 7);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BLACK);
  doc.text(data.customer.name, margin + 6, y + 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(DARK_GRAY);
  let infoY = y + 21;
  doc.text(data.customer.phone, margin + 6, infoY);
  infoY += 5;
  if (data.customer.email) {
    doc.text(data.customer.email, margin + 6, infoY);
    infoY += 5;
  }
  if (data.customer.address) {
    doc.text(data.customer.address, margin + 6, infoY);
    infoY += 5;
  }
  if (data.customer.propertyType) {
    doc.setTextColor(MID_GRAY);
    doc.text(`${data.customer.propertyType}`, margin + 6, infoY);
    infoY += 5;
  }
  if (data.customer.surfaceArea) {
    doc.text(`~${data.customer.surfaceArea}`, margin + 6, infoY);
  }

  // Right card — QUOTE DETAILS
  const rightX = margin + cardW + 8;
  doc.setFillColor(LIGHT_GRAY);
  doc.roundedRect(rightX, y, cardW, cardH, 3, 3, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(MID_GRAY);
  doc.text("QUOTE DETAILS", rightX + 6, y + 7);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(DARK_GRAY);
  let detailY = y + 15;

  const detailRows = [
    ["Quote No.", data.quoteNumber],
    ["Date", data.date],
    ["Valid Until", data.validUntil],
  ];
  if (data.customer.service) detailRows.push(["Service", data.customer.service]);
  if (data.customer.area) detailRows.push(["Area", data.customer.area]);

  for (const [label, value] of detailRows) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(MID_GRAY);
    doc.text(label, rightX + 6, detailY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK_GRAY);
    doc.text(value, rightX + cardW - 6, detailY, { align: "right" });
    detailY += 6;
  }

  y += cardH + 12;

  // ─── LINE ITEMS TABLE ─────────────────────────────────────────────
  const colDesc = margin;
  const colQty = margin + contentW - 70;
  const colPrice = margin + contentW - 45;
  const colTotal = margin + contentW;
  const rowH = 9;

  // Table header — yellow background
  doc.setFillColor(YELLOW);
  doc.roundedRect(margin, y, contentW, rowH + 2, 2, 2, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BLACK);
  doc.text("DESCRIPTION", colDesc + 4, y + 6.5);
  doc.text("QTY", colQty, y + 6.5, { align: "right" });
  doc.text("UNIT PRICE", colPrice + 15, y + 6.5, { align: "right" });
  doc.text("TOTAL", colTotal, y + 6.5, { align: "right" });

  y += rowH + 4;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  data.items.forEach((item, i) => {
    const lineTotal = item.quantity * item.unit_price;

    // Alternating row background
    if (i % 2 === 0) {
      doc.setFillColor("#FAFAFA");
      doc.rect(margin, y - 3, contentW, rowH, "F");
    }

    doc.setTextColor(DARK_GRAY);
    doc.text(item.description, colDesc + 4, y + 3);
    doc.text(item.quantity.toString(), colQty, y + 3, { align: "right" });
    doc.text(formatCurrency(item.unit_price), colPrice + 15, y + 3, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(lineTotal), colTotal, y + 3, { align: "right" });
    doc.setFont("helvetica", "normal");

    y += rowH;

    // Separator line
    doc.setDrawColor("#E0E0E0");
    doc.setLineWidth(0.2);
    doc.line(margin, y - 2, margin + contentW, y - 2);
  });

  y += 6;

  // ─── TOTALS SECTION ───────────────────────────────────────────────
  const totalsX = margin + contentW - 75;
  const totalsValX = margin + contentW;

  // Subtotal
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MID_GRAY);
  doc.text("Subtotal", totalsX, y);
  doc.setTextColor(DARK_GRAY);
  doc.text(formatCurrency(data.subtotal), totalsValX, y, { align: "right" });
  y += 7;

  // VAT
  doc.setTextColor(MID_GRAY);
  doc.text(`VAT (${data.vatRate}%)`, totalsX, y);
  doc.setTextColor(DARK_GRAY);
  doc.text(formatCurrency(data.vatAmount), totalsValX, y, { align: "right" });
  y += 9;

  // Total — highlighted box
  doc.setFillColor(BLACK);
  doc.roundedRect(totalsX - 6, y - 5, contentW - totalsX + margin + 6, 14, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(YELLOW);
  doc.text("TOTAL (incl. VAT)", totalsX, y + 4);
  doc.setFontSize(13);
  doc.text(formatCurrency(data.total), totalsValX, y + 4, { align: "right" });

  y += 20;

  // ─── NOTES ────────────────────────────────────────────────────────
  if (data.notes) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(MID_GRAY);
    doc.text("NOTES & TERMS", margin, y);
    y += 5;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(DARK_GRAY);
    const noteLines = doc.splitTextToSize(data.notes, contentW - 10);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4 + 6;
  }

  // ─── ACCEPTANCE LINE ──────────────────────────────────────────────
  if (y < pageH - 80) {
    y = Math.max(y + 10, pageH - 80);
  }

  doc.setDrawColor(MID_GRAY);
  doc.setLineWidth(0.3);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MID_GRAY);
  doc.text("Accepted by (signature):", margin, y);
  doc.line(margin + 42, y + 1, margin + contentW / 2 - 5, y + 1);

  doc.text("Date:", margin + contentW / 2 + 5, y);
  doc.line(margin + contentW / 2 + 18, y + 1, margin + contentW, y + 1);

  // ─── FOOTER ───────────────────────────────────────────────────────
  const footerY = pageH - 25;

  // Yellow accent stripe
  doc.setFillColor(YELLOW);
  doc.rect(0, footerY, pageW, 2.5, "F");

  // Black footer bar
  doc.setFillColor(BLACK);
  doc.rect(0, footerY + 2.5, pageW, 22.5, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(YELLOW);
  doc.text("PRESSURE-IT", margin, footerY + 10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(WHITE);
  doc.text("Premium Property Care", margin + 28, footerY + 10);

  doc.setFontSize(7.5);
  doc.setTextColor("#CCCCCC");
  doc.text(
    `${data.company.phone}  |  ${data.company.email}  |  www.pressure-it.co.za`,
    margin,
    footerY + 16
  );

  doc.setTextColor(MID_GRAY);
  doc.setFontSize(6.5);
  doc.text("Restore. Protect. Transform.", pageW - margin, footerY + 16, {
    align: "right",
  });

  return doc;
}

export async function downloadQuotePDF(data: QuotePDFData): Promise<void> {
  const doc = await generateQuotePDF(data);
  doc.save(`${data.quoteNumber}.pdf`);
}
