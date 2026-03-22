"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Send,
  Shield,
  BarChart3,
  Layers,
  Download,
  ArrowRight,
  Zap,
  Clock,
  DollarSign,
} from "lucide-react";

// ── Reduced motion check ─────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ── Letter-by-letter hero reveal ─────────────────────────────────────
function LetterReveal({ text, className = "", stagger = 30, delay = 0 }: { text: string; className?: string; stagger?: number; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="letter-reveal-char"
          style={{
            transitionDelay: visible ? `${i * stagger}ms` : "0ms",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(0.3em)",
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// ── Stats counter animation ──────────────────────────────────────────
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced) {
      if (started) setCount(value);
      return;
    }
    let frame: number;
    const duration = 800;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, reduced]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ── Scroll fade-up via IntersectionObserver ───────────────────────────
function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-up-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── 3D Card tilt ─────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    }
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: "Invoice Generator",
    desc: "Enter client details, services, hours and rates. AI creates professional invoices with line items, tax calculations, and payment terms.",
  },
  {
    icon: Send,
    title: "Proposal Writer",
    desc: "Describe your project scope. AI writes compelling proposals with timelines, deliverables, and tiered pricing.",
  },
  {
    icon: Shield,
    title: "Contract Drafting",
    desc: "Specify your terms. AI generates freelance contracts with IP rights, confidentiality, and termination clauses.",
  },
  {
    icon: BarChart3,
    title: "Client Dashboard",
    desc: "Track every invoice. See total earned, pending payments, and overdue amounts at a glance.",
  },
  {
    icon: Layers,
    title: "Template Library",
    desc: "Six professionally designed invoice templates. Minimal, corporate, creative, tech, agency, and consulting.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    desc: "Download as PDF through print dialog. Copy as markdown. Your documents, your way.",
  },
];

const stats = [
  { value: "$0", label: "Platform fees", sublabel: "forever" },
  { value: "<10s", label: "To generate", sublabel: "any document" },
  { value: "6", label: "Templates", sublabel: "ready to use" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              InvoiceForge
            </span>
          </div>
          <Link
            href="/app"
            className="px-5 py-2 bg-accent text-bg font-medium rounded-full text-sm hover:bg-accentDark transition-colors"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl">
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-6 fade-in">
              For freelancers who mean business
            </p>
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-8"
            >
              <LetterReveal text="Get paid" stagger={30} />
              <br />
              <span className="text-gradient"><LetterReveal text="faster." stagger={35} delay={300} /></span>
            </h1>
            <p
              className="text-xl sm:text-2xl text-textMuted max-w-2xl leading-relaxed mb-12 fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              AI-powered invoices, proposals, and contracts. Professional
              documents in seconds, not hours. No templates to wrestle with. No
              fees. Ever.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-bg font-semibold rounded-full text-lg hover:bg-accentDark transition-all glow-green"
              >
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/app/templates"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-textMuted font-medium rounded-full text-lg hover:border-borderLight hover:text-text transition-all"
              >
                View Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <FadeUp>
        <section className="border-y border-border bg-surface/50">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="text-center sm:text-left">
              <div className="text-5xl font-bold tracking-tighter text-text mb-2">
                <AnimatedCounter value={0} prefix="$" />
              </div>
              <div className="text-textMuted">Platform fees <span className="text-textDim">forever</span></div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-5xl font-bold tracking-tighter text-text mb-2">
                &lt;<AnimatedCounter value={10} suffix="s" />
              </div>
              <div className="text-textMuted">To generate <span className="text-textDim">any document</span></div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-5xl font-bold tracking-tighter text-text mb-2">
                <AnimatedCounter value={6} />
              </div>
              <div className="text-textMuted">Templates <span className="text-textDim">ready to use</span></div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* How it works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-accent font-mono text-sm tracking-widest uppercase mb-4">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-6">
            Three steps. That&apos;s it.
          </h2>
          <p className="text-textMuted text-lg mb-20 max-w-xl">
            No sign-up. No credit card. No learning curve. Just open the app and
            start generating.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Clock,
                title: "Enter Details",
                desc: "Client name, services, rates, project scope. Whatever the document needs.",
              },
              {
                step: "02",
                icon: Zap,
                title: "AI Generates",
                desc: "Our AI creates a professional document with proper formatting, calculations, and legal language.",
              },
              {
                step: "03",
                icon: DollarSign,
                title: "Export & Send",
                desc: "Download as PDF, copy as markdown, or print directly. Send to your client and get paid.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl border border-border bg-surface/30 card-hover"
              >
                <div className="text-6xl font-bold text-border/50 absolute top-6 right-8 tracking-tighter">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-textMuted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-accent font-mono text-sm tracking-widest uppercase mb-4">
            Everything you need
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-20">
            Built for the way
            <br />
            freelancers work.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={i * 80}>
                <TiltCard className="p-8 rounded-2xl border border-border bg-surface/30 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <f.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                  <p className="text-textMuted text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter mb-6">
            Stop chasing payments.
            <br />
            <span className="text-gradient">Start closing deals.</span>
          </h2>
          <p className="text-textMuted text-xl mb-12 max-w-2xl mx-auto">
            Professional invoices and proposals in seconds. No sign-up required.
            Completely free. Built by freelancers, for freelancers.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-10 py-5 bg-accent text-bg font-semibold rounded-full text-xl hover:bg-accentDark transition-all glow-green"
          >
            Launch InvoiceForge
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-semibold">InvoiceForge AI</span>
          </div>
          <p className="text-textDim text-sm">
            Built with AI. No data stored on servers. Everything stays in your
            browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
