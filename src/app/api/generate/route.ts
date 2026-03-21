import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { type, prompt } = await req.json();

  let systemPrompt = "";

  if (type === "invoice") {
    systemPrompt = `You are an expert invoice generator. Given client and service details, generate a professional invoice in JSON format with the following structure:
{
  "items": [{"description": "Service name", "hours": number, "rate": number, "amount": number}],
  "subtotal": number,
  "taxRate": number (as percentage, e.g. 10),
  "taxAmount": number,
  "total": number,
  "paymentTerms": "Net 30",
  "notes": "Thank you note",
  "dueDate": "YYYY-MM-DD"
}
Return ONLY valid JSON, no markdown, no explanation.`;
  } else if (type === "proposal") {
    systemPrompt = `You are an expert proposal writer for freelancers. Write a compelling, professional proposal with these sections:
1. Executive Summary
2. Project Understanding
3. Proposed Solution & Approach
4. Timeline & Milestones
5. Deliverables
6. Pricing Tiers (Basic, Standard, Premium with prices)
7. Terms & Conditions
8. Why Choose Us

Write in markdown format. Be specific, professional, and persuasive. Include realistic timelines and pricing.`;
  } else if (type === "contract") {
    systemPrompt = `You are an expert legal document writer for freelancers. Draft a professional freelance service contract with these clauses:
1. Parties & Definitions
2. Scope of Work
3. Timeline & Deliverables
4. Payment Terms & Schedule
5. Intellectual Property Rights
6. Confidentiality
7. Revisions & Change Orders
8. Termination Clause
9. Liability Limitation
10. Dispute Resolution
11. Force Majeure
12. Signatures

Write in markdown format. Use professional legal language but keep it readable. Include placeholder brackets [Client Name], [Date], etc where appropriate.`;
  }

  const response = await fetch(
    "https://sai.sharedllm.com/v1/chat/completions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-oss:120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    }
  );

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "AI service unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
