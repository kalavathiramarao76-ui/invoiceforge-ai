"use client";

import { templates } from "@/lib/templates";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

const templateColors: Record<string, { accent: string; bg: string; border: string }> = {
  minimal: { accent: "text-zinc-300", bg: "bg-zinc-800/30", border: "border-zinc-700" },
  corporate: { accent: "text-blue-400", bg: "bg-blue-950/30", border: "border-blue-800/50" },
  creative: { accent: "text-purple-400", bg: "bg-purple-950/30", border: "border-purple-800/50" },
  tech: { accent: "text-green-400", bg: "bg-green-950/30", border: "border-green-800/50" },
  agency: { accent: "text-amber-400", bg: "bg-amber-950/30", border: "border-amber-800/50" },
  consulting: { accent: "text-teal-400", bg: "bg-teal-950/30", border: "border-teal-800/50" },
};

export default function TemplatesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Layers className="w-8 h-8 text-accent" />
          Template Library
        </h1>
        <p className="text-textMuted">
          Six professionally designed invoice templates. Choose your style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => {
          const colors = templateColors[t.id] || templateColors.minimal;
          return (
            <div
              key={t.id}
              className={`rounded-2xl border ${colors.border} ${colors.bg} card-hover overflow-hidden`}
            >
              {/* Preview mockup */}
              <div className="p-6 pb-0">
                <div className="rounded-t-xl bg-bg/80 border border-border/50 p-4 space-y-3">
                  {/* Mock invoice header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
                        INVOICE
                      </div>
                      <div className="text-[10px] text-textDim mt-0.5">
                        #INV-001
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-2 w-16 bg-border/50 rounded" />
                      <div className="h-1.5 w-12 bg-border/30 rounded mt-1" />
                    </div>
                  </div>
                  {/* Mock line items */}
                  <div className="space-y-1.5 pt-2 border-t border-border/30">
                    <div className="flex justify-between">
                      <div className="h-1.5 w-24 bg-border/40 rounded" />
                      <div className="h-1.5 w-10 bg-border/40 rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-1.5 w-20 bg-border/40 rounded" />
                      <div className="h-1.5 w-10 bg-border/40 rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-1.5 w-28 bg-border/40 rounded" />
                      <div className="h-1.5 w-10 bg-border/40 rounded" />
                    </div>
                  </div>
                  {/* Mock total */}
                  <div className="flex justify-end pt-2 border-t border-border/30">
                    <div className={`h-2.5 w-16 rounded ${colors.bg} border ${colors.border}`} />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-2 ${colors.accent}`}>
                  {t.name}
                </h3>
                <p className="text-textMuted text-sm leading-relaxed mb-4">
                  {t.description}
                </p>
                <Link
                  href="/app/invoice"
                  className="inline-flex items-center gap-2 text-sm font-medium text-textMuted hover:text-text transition-colors"
                >
                  Use template
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
