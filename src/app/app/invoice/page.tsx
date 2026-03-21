"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import {
  Invoice,
  InvoiceItem,
  saveInvoice,
  generateId,
} from "@/lib/storage";

export default function InvoicePage() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [services, setServices] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState("tech");
  const printRef = useRef<HTMLDivElement>(null);

  const [manualItems, setManualItems] = useState<InvoiceItem[]>([
    { description: "", hours: 0, rate: 0, amount: 0 },
  ]);

  const addItem = () => {
    setManualItems([
      ...manualItems,
      { description: "", hours: 0, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (idx: number) => {
    setManualItems(manualItems.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...manualItems];
    if (field === "description") {
      updated[idx].description = value as string;
    } else {
      updated[idx][field] = Number(value);
      updated[idx].amount = updated[idx].hours * updated[idx].rate;
    }
    setManualItems(updated);
  };

  const generateWithAI = async () => {
    if (!clientName || !services) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "invoice",
          prompt: `Generate an invoice for client "${clientName}" (${clientEmail}). Services: ${services}. Include appropriate line items with hours and rates.`,
        }),
      });

      let fullText = "";
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content || "";
                fullText += content;
              } catch {}
            }
          }
        }
      }

      // Extract JSON from response
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        const inv: Invoice = {
          id: generateId(),
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          clientName,
          clientEmail,
          items: data.items || [],
          subtotal: data.subtotal || 0,
          taxRate: data.taxRate || 0,
          taxAmount: data.taxAmount || 0,
          total: data.total || 0,
          status: "pending",
          createdAt: new Date().toISOString(),
          dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
          paymentTerms: data.paymentTerms || "Net 30",
          notes: data.notes || "Thank you for your business.",
          template,
        };
        setInvoice(inv);
        saveInvoice(inv);
      }
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const createManual = () => {
    if (!clientName) return;
    const validItems = manualItems.filter((i) => i.description && i.amount > 0);
    const subtotal = validItems.reduce((sum, i) => sum + i.amount, 0);
    const taxRate = 10;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const inv: Invoice = {
      id: generateId(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientName,
      clientEmail,
      items: validItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      paymentTerms: "Net 30",
      notes: "Thank you for your business.",
      template,
    };
    setInvoice(inv);
    saveInvoice(inv);
  };

  const exportPDF = () => {
    window.print();
  };

  const copyMarkdown = () => {
    if (!invoice) return;
    const md = `# Invoice ${invoice.invoiceNumber}\n\n**Client:** ${invoice.clientName}\n**Email:** ${invoice.clientEmail}\n**Date:** ${new Date(invoice.createdAt).toLocaleDateString()}\n**Due:** ${invoice.dueDate}\n\n## Line Items\n\n| Description | Hours | Rate | Amount |\n|---|---|---|---|\n${invoice.items.map((i) => `| ${i.description} | ${i.hours} | $${i.rate} | $${i.amount.toFixed(2)} |`).join("\n")}\n\n**Subtotal:** $${invoice.subtotal.toFixed(2)}\n**Tax (${invoice.taxRate}%):** $${invoice.taxAmount.toFixed(2)}\n**Total:** $${invoice.total.toFixed(2)}\n\n**Payment Terms:** ${invoice.paymentTerms}\n\n${invoice.notes}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-accent" />
          Invoice Generator
        </h1>
        <p className="text-textMuted">
          Create professional invoices with AI or manually.
        </p>
      </div>

      {!invoice ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-surface/30 space-y-4">
              <h2 className="text-lg font-semibold">Client Details</h2>
              <div>
                <label className="text-sm text-textMuted block mb-1.5">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-textDim focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-textMuted block mb-1.5">
                  Client Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="billing@acme.com"
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-textDim focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-textMuted block mb-1.5">
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text focus:outline-none focus:border-accent/50 transition-colors"
                >
                  {["minimal", "corporate", "creative", "tech", "agency", "consulting"].map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI generation */}
            <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Generation
              </h2>
              <div>
                <label className="text-sm text-textMuted block mb-1.5">
                  Describe services provided
                </label>
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="Built a responsive React dashboard with authentication, API integration, and deployment. 40 hours of development at $150/hr. Also did 8 hours of consulting at $200/hr."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-textDim focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>
              <button
                onClick={generateWithAI}
                disabled={loading || !clientName || !services}
                className="w-full py-3 px-6 bg-accent text-bg font-semibold rounded-xl hover:bg-accentDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Manual entry */}
          <div className="p-6 rounded-2xl border border-border bg-surface/30 space-y-4">
            <h2 className="text-lg font-semibold">Manual Line Items</h2>
            <div className="space-y-3">
              {manualItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    {idx === 0 && (
                      <label className="text-xs text-textDim block mb-1">
                        Description
                      </label>
                    )}
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Service"
                      className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text text-sm placeholder:text-textDim focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div className="col-span-2">
                    {idx === 0 && (
                      <label className="text-xs text-textDim block mb-1">
                        Hours
                      </label>
                    )}
                    <input
                      type="number"
                      value={item.hours || ""}
                      onChange={(e) => updateItem(idx, "hours", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text text-sm placeholder:text-textDim focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div className="col-span-2">
                    {idx === 0 && (
                      <label className="text-xs text-textDim block mb-1">
                        Rate
                      </label>
                    )}
                    <input
                      type="number"
                      value={item.rate || ""}
                      onChange={(e) => updateItem(idx, "rate", e.target.value)}
                      placeholder="$0"
                      className="w-full px-3 py-2.5 rounded-lg bg-bg border border-border text-text text-sm placeholder:text-textDim focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm text-textMuted py-2.5">
                    ${item.amount.toFixed(2)}
                  </div>
                  <div className="col-span-1">
                    {manualItems.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 text-textDim hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="flex items-center gap-2 text-sm text-textMuted hover:text-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add line item
            </button>
            <div className="pt-4 border-t border-border">
              <button
                onClick={createManual}
                disabled={!clientName}
                className="w-full py-3 px-6 border border-border text-text font-medium rounded-xl hover:bg-surfaceHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Invoice preview */
        <div>
          <div className="flex items-center gap-3 mb-6 no-print">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-bg font-medium rounded-xl hover:bg-accentDark transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-2 px-5 py-2.5 border border-border text-text font-medium rounded-xl hover:bg-surfaceHover transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
            <button
              onClick={() => setInvoice(null)}
              className="px-5 py-2.5 text-textMuted hover:text-text transition-colors"
            >
              New Invoice
            </button>
          </div>

          <div
            ref={printRef}
            className="print-area max-w-3xl mx-auto p-10 rounded-2xl border border-border bg-surface/30"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">
                  INVOICE
                </h2>
                <p className="text-textDim font-mono text-sm">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{invoice.clientName}</p>
                {invoice.clientEmail && (
                  <p className="text-textMuted text-sm">{invoice.clientEmail}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4 mb-10 p-4 rounded-xl bg-bg/50 border border-border/50">
              <div>
                <p className="text-xs text-textDim uppercase tracking-wider mb-1">
                  Issue Date
                </p>
                <p className="text-sm font-medium">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-textDim uppercase tracking-wider mb-1">
                  Due Date
                </p>
                <p className="text-sm font-medium">{invoice.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-textDim uppercase tracking-wider mb-1">
                  Terms
                </p>
                <p className="text-sm font-medium">{invoice.paymentTerms}</p>
              </div>
            </div>

            {/* Items table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-xs text-textDim uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-right py-3 text-xs text-textDim uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="text-right py-3 text-xs text-textDim uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="text-right py-3 text-xs text-textDim uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-4 text-sm">{item.description}</td>
                    <td className="py-4 text-sm text-right text-textMuted">
                      {item.hours}
                    </td>
                    <td className="py-4 text-sm text-right text-textMuted">
                      ${item.rate.toFixed(2)}
                    </td>
                    <td className="py-4 text-sm text-right font-medium">
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">
                    Tax ({invoice.taxRate}%)
                  </span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent">
                    ${invoice.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-10 pt-6 border-t border-border/50">
                <p className="text-xs text-textDim uppercase tracking-wider mb-2">
                  Notes
                </p>
                <p className="text-sm text-textMuted">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
