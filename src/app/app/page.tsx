"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  Shield,
  ArrowRight,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { getInvoices, Invoice, deleteInvoice, saveInvoice } from "@/lib/storage";

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
    paid: "text-accent bg-accent/10",
    pending: "text-warning bg-warning/10",
    overdue: "text-danger bg-danger/10",
  };

  if (!mounted) return null;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-textMuted">
          Track your invoices and manage your freelance business.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-6 rounded-2xl border border-border bg-surface/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <span className="text-textMuted text-sm">Total Earned</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            ${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-surface/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-textMuted text-sm">Pending</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            ${pending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-surface/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <span className="text-textMuted text-sm">Overdue</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            ${overdue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { href: "/app/invoice", icon: FileText, label: "New Invoice", color: "accent" },
          { href: "/app/proposal", icon: Send, label: "New Proposal", color: "accent" },
          { href: "/app/contract", icon: Shield, label: "New Contract", color: "accent" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between p-5 rounded-2xl border border-border bg-surface/30 card-hover group"
          >
            <div className="flex items-center gap-3">
              <action.icon className="w-5 h-5 text-accent" />
              <span className="font-medium">{action.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-textDim group-hover:text-accent transition-colors" />
          </Link>
        ))}
      </div>

      {/* Invoice list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
        {invoices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <FileText className="w-12 h-12 text-textDim mx-auto mb-4" />
            <p className="text-textMuted mb-2">No invoices yet</p>
            <Link
              href="/app/invoice"
              className="text-accent hover:underline text-sm"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-5 rounded-2xl border border-border bg-surface/30 card-hover"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium truncate">
                      {inv.clientName}
                    </span>
                    <span className="text-textDim text-xs font-mono">
                      {inv.invoiceNumber}
                    </span>
                  </div>
                  <div className="text-textDim text-sm">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">
                    ${inv.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => cycleStatus(inv)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[inv.status]}`}
                  >
                    {inv.status}
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="p-2 rounded-lg text-textDim hover:text-danger hover:bg-danger/10 transition-colors"
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
