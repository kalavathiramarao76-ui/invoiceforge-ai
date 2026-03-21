"use client";

import { useState } from "react";
import {
  Send,
  Sparkles,
  Loader2,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { saveProposal, generateId } from "@/lib/storage";
import FavoriteButton from "@/components/FavoriteButton";
import ExportMenu from "@/components/ExportMenu";

export default function ProposalPage() {
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [scope, setScope] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [proposalId, setProposalId] = useState("");

  const generate = async () => {
    if (!clientName || !projectTitle || !scope) return;
    setLoading(true);
    setContent("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "proposal",
          prompt: `Write a professional proposal for client "${clientName}" for project "${projectTitle}". Scope: ${scope}. ${budget ? `Budget range: ${budget}.` : ""} Include pricing tiers (Basic, Standard, Premium).`,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

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
                const c = json.choices?.[0]?.delta?.content || "";
                fullText += c;
                setContent(fullText);
              } catch {}
            }
          }
        }
      }

      const id = generateId();
      setProposalId(id);
      saveProposal({
        id,
        clientName,
        projectTitle,
        content: fullText,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Send className="w-8 h-8 text-accent" />
          Proposal Writer
        </h1>
        <p className="text-textMuted">
          AI writes compelling proposals with timelines, deliverables, and
          pricing tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div className="p-6 rounded-2xl border border-border bg-surface/30 space-y-4">
          <h2 className="text-lg font-semibold">Project Details</h2>
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
              Project Title *
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="E-commerce Platform Redesign"
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-textDim focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-textMuted block mb-1.5">
              Project Scope *
            </label>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Complete redesign of the e-commerce platform including new product pages, checkout flow, user dashboard, mobile responsive design, and integration with Stripe for payments. The site currently has 500+ products and 10,000 monthly visitors."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-textDim focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-textMuted block mb-1.5">
              Budget Range (optional)
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="$5,000 - $15,000"
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-textDim focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <button
            onClick={generate}
            disabled={loading || !clientName || !projectTitle || !scope}
            className="w-full py-3 px-6 bg-accent text-bg font-semibold rounded-xl hover:bg-accentDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Writing proposal...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Proposal
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {content && (
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-bg font-medium rounded-xl hover:bg-accentDark transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={copyContent}
                className="flex items-center gap-2 px-5 py-2.5 border border-border text-text font-medium rounded-xl hover:bg-surfaceHover transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Markdown"}
              </button>
              <ExportMenu content={content} title="Proposal" />
              {proposalId && (
                <FavoriteButton id={proposalId} type="proposal" />
              )}
            </div>
          )}

          <div className="print-area p-6 rounded-2xl border border-border bg-surface/30 min-h-[500px]">
            {content ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div
                  className="whitespace-pre-wrap text-sm leading-relaxed text-textMuted"
                  style={{ fontFamily: "inherit" }}
                >
                  {content.split("\n").map((line, i) => {
                    if (line.startsWith("# "))
                      return (
                        <h1
                          key={i}
                          className="text-2xl font-bold text-text mt-8 mb-4"
                        >
                          {line.slice(2)}
                        </h1>
                      );
                    if (line.startsWith("## "))
                      return (
                        <h2
                          key={i}
                          className="text-xl font-semibold text-text mt-6 mb-3"
                        >
                          {line.slice(3)}
                        </h2>
                      );
                    if (line.startsWith("### "))
                      return (
                        <h3
                          key={i}
                          className="text-lg font-medium text-text mt-4 mb-2"
                        >
                          {line.slice(4)}
                        </h3>
                      );
                    if (line.startsWith("- ") || line.startsWith("* "))
                      return (
                        <p key={i} className="ml-4 mb-1">
                          <span className="text-accent mr-2">&#8226;</span>
                          {line.slice(2)}
                        </p>
                      );
                    if (line.startsWith("**") && line.endsWith("**"))
                      return (
                        <p key={i} className="font-semibold text-text mb-1">
                          {line.slice(2, -2)}
                        </p>
                      );
                    if (line.trim() === "") return <br key={i} />;
                    return (
                      <p key={i} className="mb-1">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-textDim">
                <Send className="w-12 h-12 mb-4 opacity-20" />
                <p>Your proposal will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
