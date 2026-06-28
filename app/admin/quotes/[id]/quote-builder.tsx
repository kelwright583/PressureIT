"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Save,
  Phone,
  Mail,
  MessageCircle,
  FileText,
} from "lucide-react";
import { saveQuotation, updateQuotationStatus } from "@/app/admin/actions/quotations";
import type { QuoteRequest, Quotation, QuotationItem } from "@/db/types";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

function stripPhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

function whatsappUrl(phone: string): string {
  return `https://wa.me/${stripPhone(phone).replace(/^\+/, "")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

function buildMailtoLink(
  request: QuoteRequest,
  quotation: { quote_number: string; valid_days: number; notes: string },
  items: LineItem[],
  subtotal: number,
  vatAmount: number,
  total: number,
  companyPhone: string,
  companyEmail: string
): string {
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + quotation.valid_days);

  const lineItemsText = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.description}\n   Qty: ${item.quantity} × ${formatCurrency(item.unit_price)} = ${formatCurrency(item.quantity * item.unit_price)}`
    )
    .join("\n\n");

  const subject = encodeURIComponent(
    `Quotation ${quotation.quote_number} — Pressure-It Premium Property Care`
  );

  const body = encodeURIComponent(
    `Dear ${request.name},

Thank you for your enquiry. Please find your quotation below.

━━━━━━━━━━━━━━━━━━━━━━━━
QUOTATION ${quotation.quote_number}
━━━━━━━━━━━━━━━━━━━━━━━━

${request.service ? `Service: ${request.service}` : ""}
${request.area ? `Area: ${request.area}` : ""}

LINE ITEMS:
${lineItemsText}

━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:  ${formatCurrency(subtotal)}
VAT (15%): ${formatCurrency(vatAmount)}
TOTAL:     ${formatCurrency(total)}
━━━━━━━━━━━━━━━━━━━━━━━━

${quotation.notes ? `Notes:\n${quotation.notes}\n` : ""}
Valid until: ${formatDate(validUntil.toISOString())}

To accept this quotation, simply reply to this email or contact us:
Phone: ${companyPhone}
Email: ${companyEmail}

Kind regards,
Pressure-It — Premium Property Care
www.pressure-it.co.za`
  );

  return `mailto:${request.email ?? ""}?subject=${subject}&body=${body}`;
}

export function QuoteBuilder({
  request,
  existingQuotation,
  existingItems,
  companyPhone,
  companyEmail,
}: {
  request: QuoteRequest;
  existingQuotation: Quotation | null;
  existingItems: QuotationItem[];
  companyPhone: string;
  companyEmail: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [items, setItems] = useState<LineItem[]>(
    existingItems.length > 0
      ? existingItems.map((i) => ({
          description: i.description,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
        }))
      : [{ description: "", quantity: 1, unit_price: 0 }]
  );
  const [notes, setNotes] = useState(existingQuotation?.notes ?? "");
  const [validDays, setValidDays] = useState(existingQuotation?.valid_days ?? 30);
  const [vatRate] = useState(existingQuotation?.vat_rate ?? 15);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const vatAmount = +(subtotal * (vatRate / 100)).toFixed(2);
  const total = +(subtotal + vatAmount).toFixed(2);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function handleSave() {
    const hasEmpty = items.some((i) => !i.description.trim());
    if (hasEmpty) {
      toast.error("All line items need a description.");
      return;
    }

    startTransition(async () => {
      const result = await saveQuotation({
        quote_request_id: request.id,
        notes,
        valid_days: validDays,
        vat_rate: vatRate,
        items: items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
      });
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleSendEmail() {
    if (!existingQuotation && items.some((i) => !i.description.trim())) {
      toast.error("Save the quotation first.");
      return;
    }

    // Mark as sent if we have a saved quotation
    if (existingQuotation) {
      startTransition(async () => {
        await updateQuotationStatus(existingQuotation.id, "sent");
        router.refresh();
      });
    }

    const quoteNumber =
      existingQuotation?.quote_number ?? `PIT-${new Date().getFullYear()}-DRAFT`;

    const url = buildMailtoLink(
      request,
      { quote_number: quoteNumber, valid_days: validDays, notes },
      items,
      subtotal,
      vatAmount,
      total,
      companyPhone,
      companyEmail
    );

    window.location.href = url;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back link + header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/quotes"
          className="rounded-lg p-2 text-muted hover:bg-line hover:text-bone"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl tracking-tight text-accent sm:text-3xl">
            {existingQuotation ? `Quotation ${existingQuotation.quote_number}` : "New Quotation"}
          </h1>
          <p className="text-sm text-muted">
            For {request.name} &middot; {formatDate(request.created_at)}
          </p>
        </div>
        {existingQuotation && (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            {existingQuotation.status}
          </span>
        )}
      </div>

      {/* Customer details card */}
      <div className="rounded-xl border border-line bg-ink-soft p-4 sm:p-6">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          Customer Details
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Name</p>
            <p className="text-sm font-medium text-bone">{request.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Service</p>
            <p className="text-sm font-medium text-bone">{request.service || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Area</p>
            <p className="text-sm font-medium text-bone">{request.area || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Property Type</p>
            <p className="text-sm font-medium text-bone">{request.property_type || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Surface Area</p>
            <p className="text-sm font-medium text-bone">{request.surface_area || "-"}</p>
          </div>
          {request.address && (
            <div className="col-span-2">
              <p className="text-xs text-muted">Address</p>
              <p className="text-sm font-medium text-bone">{request.address}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted">Status</p>
            <p className="text-sm font-medium text-bone capitalize">{request.status}</p>
          </div>
        </div>
        {request.message && (
          <div className="mt-3">
            <p className="text-xs text-muted">Message</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-bone">{request.message}</p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`tel:${stripPhone(request.phone)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm text-bone hover:bg-line"
          >
            <Phone className="h-4 w-4 text-accent" />
            {request.phone}
          </a>
          {request.email && (
            <a
              href={`mailto:${request.email}`}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm text-bone hover:bg-line"
            >
              <Mail className="h-4 w-4 text-accent" />
              {request.email}
            </a>
          )}
          <a
            href={whatsappUrl(request.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600/20 px-3 py-2 text-sm text-green-400 hover:bg-green-600/30"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-xl border border-line bg-ink-soft p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
            Line Items
          </h2>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 rounded-lg bg-ink p-3"
            >
              <div className="col-span-12 sm:col-span-6">
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="e.g. Driveway pressure wash"
                  className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted">
                  Qty
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", +e.target.value)}
                  className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="col-span-5 sm:col-span-2">
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted">
                  Unit Price (R)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, "unit_price", +e.target.value)}
                  className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="col-span-3 sm:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted">
                    Total
                  </label>
                  <p className="rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm font-medium text-accent">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </p>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mb-0.5 rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals + notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notes */}
        <div className="rounded-xl border border-line bg-ink-soft p-4 sm:p-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
            Notes & Terms
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Payment terms, special conditions, etc."
            className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-bone placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="mt-3">
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted">
              Valid for (days)
            </label>
            <input
              type="number"
              min="1"
              value={validDays}
              onChange={(e) => setValidDays(+e.target.value)}
              className="w-24 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Totals */}
        <div className="rounded-xl border border-line bg-ink-soft p-4 sm:p-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
            Quote Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-bone">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">VAT ({vatRate}%)</span>
              <span className="text-bone">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="border-t border-line pt-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-bone">Total</span>
                <span className="font-display text-2xl text-accent">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-ink transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {pending ? "Saving..." : existingQuotation ? "Update Quotation" : "Save Quotation"}
        </button>

        {request.email && (
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={pending || items.some((i) => !i.description.trim())}
            className="inline-flex items-center gap-2 rounded-lg border border-accent bg-transparent px-5 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent/10 active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Send via Email
          </button>
        )}

        {!request.email && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <FileText className="h-4 w-4" />
            No email on file — save and send via WhatsApp instead
          </p>
        )}
      </div>
    </div>
  );
}
