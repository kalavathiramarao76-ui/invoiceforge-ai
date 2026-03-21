"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getInvoices, Invoice, deleteInvoice, saveInvoice } from "@/lib/storage";
import FavoriteButton from "@/components/FavoriteButton";

const tools = [
  {
    num: "01",
    href: "/app/invoice",
    title: "Invoice",
    desc: "Generate professional invoices with line items, tax calculations, and payment terms.",
  },
  {
    num: "02",
    href: "/app/proposal",
    title: "Proposal",
    desc: "Create compelling project proposals with scope, timeline, and pricing.",
  },
  {
    num: "03",
    href: "/app/contract",
    title: "Contract",
    desc: "Generate freelance contracts with payment terms, deliverables, and legal clauses.",
  },
  {
    num: "04",
    href: "/app/templates",
    title: "Templates",
    desc: "Save and reuse your best-performing document templates.",
  },
];

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInvoices(getInvoices());
  }, []);

  const totalEarned = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);
  const pending = invoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.total, 0);
  const overdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setInvoices(getInvoices());
  };

  const cycleStatus = (invoice: Invoice) => {
    const order: Invoice["status"][] = ["pending", "paid", "overdue"];
    const idx = order.indexOf(invoice.status);
    const next = order[(idx + 1) % order.length];
    saveInvoice({ ...invoice, status: next });
    setInvoices(getInvoices());
  };

  const statusColor = {
    paid: "text-green-400 bg-green-500/10 border-green-500/20",
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    overdue: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  if (!mounted) return null;

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-16 pt-4">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Billing Studio
          </h1>
          <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-semibold tracking-[0.15em] uppercase">
            Workspace
          </span>
        </div>
        <p className="text-zinc-500 text-lg max-w-xl">
          Track invoices and manage your freelance business.
        </p>
      </div>

      {/* Stats — massive mono numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-zinc-500 text-xs font-medium tracking-[0.15em] uppercase mb-4">
            Total Earned
          </p>
          <p className="text-5xl font-mono font-bold tracking-tight text-green-400 tabular-nums">
            ${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-zinc-500 text-xs font-medium tracking-[0.15em] uppercase mb-4">
            Pending
          </p>
          <p className="text-5xl font-mono font-bold tracking-tight text-amber-400 tabular-nums">
            ${pending.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-zinc-500 text-xs font-medium tracking-[0.15em] uppercase mb-4">
            Overdue
          </p>
          <p className="text-5xl font-mono font-bold tracking-tight text-red-400 tabular-nums">
            ${overdue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Tool rows */}
      <div className="space-y-0 mb-16">
        {tools.map((tool, i) => (
          <Link
            key={i}
            href={tool.href}
            className="group flex items-start gap-8 py-8 border-t border-white/[0.06] last:border-b hover:bg-white/[0.01] transition-colors -mx-6 px-6 lg:-mx-10 lg:px-10"
          >
            {/* Number */}
            <span className="font-mono text-sm text-green-500/40 pt-1 shrink-0 w-8 tabular-nums">
              {tool.num}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-semibold tracking-tight text-white group-hover:text-green-400 transition-colors mb-2">
                {tool.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
                {tool.desc}
              </p>
            </div>

            {/* Arrow */}
            <div className="pt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Invoices */}
      <div>
        <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-zinc-500 mb-6">
          Recent Invoices
        </h2>
        {invoices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
            <p className="text-zinc-600 mb-2">No invoices yet</p>
            <Link
              href="/app/invoice"
              className="text-green-400 hover:text-green-300 text-sm transition-colors"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between py-5 px-6 -mx-6 rounded-xl hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-white truncate">
                      {inv.clientName}
                    </span>
                    <span className="text-zinc-600 text-xs font-mono">
                      {inv.invoiceNumber}
                    </span>
                  </div>
                  <div className="text-zinc-600 text-sm">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-mono font-semibold text-white tabular-nums">
                    ${inv.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      cycleStatus(inv);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize border ${statusColor[inv.status]}`}
                  >
                    {inv.status}
                  </button>
                  <FavoriteButton id={inv.id} type="invoice" size="sm" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(inv.id);
                    }}
                    className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
