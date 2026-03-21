"use client";

import { useState, useEffect } from "react";

const steps = [
  {
    title: "Welcome to InvoiceForge AI",
    desc: "Create professional invoices, proposals, and contracts in seconds using AI or manually. Everything stays local in your browser.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Create Your First Invoice",
    desc: "Describe the services you provided and let AI generate a detailed invoice with line items, tax, and payment terms. Or add items manually for full control.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Templates & Export",
    desc: "Save templates for repeat clients. Export to PDF with one click. Star your favorites for quick access from the dashboard.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("invoiceforge-onboarding-done");
    if (!seen) {
      setShow(true);
    }
  }, []);

  const finish = () => {
    setConfetti(true);
    setTimeout(() => {
      localStorage.setItem("invoiceforge-onboarding-done", "true");
      setShow(false);
      setConfetti(false);
    }, 1500);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const skip = () => {
    localStorage.setItem("invoiceforge-onboarding-done", "true");
    setShow(false);
  };

  if (!show) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={skip}
      />

      {/* Confetti */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[101]">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                background: ["#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#3b82f6"][
                  Math.floor(Math.random() * 5)
                ],
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Card */}
      <div className="relative z-[102] w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-[#111113]/95 backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(34,197,94,0.1)]">
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-green-500"
                  : i < step
                  ? "w-4 bg-green-500/40"
                  : "w-4 bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          {current.icon}
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-center text-white mb-3">
          {current.title}
        </h2>
        <p className="text-sm text-zinc-400 text-center leading-relaxed mb-8">
          {current.desc}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={skip}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={next}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            {step < steps.length - 1 ? "Next" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
}
