export interface InvoiceItem {
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: "paid" | "pending" | "overdue";
  createdAt: string;
  dueDate: string;
  paymentTerms: string;
  notes: string;
  template: string;
}

export interface Proposal {
  id: string;
  clientName: string;
  projectTitle: string;
  content: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  clientName: string;
  projectTitle: string;
  content: string;
  createdAt: string;
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getInvoices(): Invoice[] {
  return getItem<Invoice[]>("invoiceforge_invoices", []);
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const idx = invoices.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) invoices[idx] = invoice;
  else invoices.unshift(invoice);
  setItem("invoiceforge_invoices", invoices);
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((i) => i.id !== id);
  setItem("invoiceforge_invoices", invoices);
}

export function getProposals(): Proposal[] {
  return getItem<Proposal[]>("invoiceforge_proposals", []);
}

export function saveProposal(proposal: Proposal): void {
  const proposals = getProposals();
  proposals.unshift(proposal);
  setItem("invoiceforge_proposals", proposals);
}

export function getContracts(): Contract[] {
  return getItem<Contract[]>("invoiceforge_contracts", []);
}

export function saveContract(contract: Contract): void {
  const contracts = getContracts();
  contracts.unshift(contract);
  setItem("invoiceforge_contracts", contracts);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
