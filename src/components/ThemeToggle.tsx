"use client";

import { useState, useEffect } from "react";

type Theme = "dark" | "light" | "system";

const STORAGE_KEY = "invoiceforge-theme";

function applyTheme(theme: Theme) {
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);

  if (resolved === "light") {
    root.style.setProperty("--if-bg", "#f7f7f8");
    root.style.setProperty("--if-text", "#09090b");
    root.style.setProperty("--if-bg-card", "#ffffff");
    root.style.setProperty("--if-border", "rgba(0,0,0,0.08)");
    root.style.setProperty("--if-surface", "rgba(0,0,0,0.02)");
    root.style.setProperty("--if-text-secondary", "#52525b");
    root.style.setProperty("--if-text-muted", "#71717a");
    root.style.setProperty("--if-bg-hover", "#f0f0f2");
    root.style.setProperty("--if-sidebar-bg", "#ffffff");
    document.body.style.background = "#f7f7f8";
    document.body.style.color = "#09090b";
  } else {
    root.style.setProperty("--if-bg", "#09090b");
    root.style.setProperty("--if-text", "#fafafa");
    root.style.setProperty("--if-bg-card", "#111113");
    root.style.setProperty("--if-border", "#27272a");
    root.style.setProperty("--if-surface", "rgba(255,255,255,0.03)");
    root.style.setProperty("--if-text-secondary", "#a1a1aa");
    root.style.setProperty("--if-text-muted", "#71717a");
    root.style.setProperty("--if-bg-hover", "#18181b");
    root.style.setProperty("--if-sidebar-bg", "rgba(17,17,19,0.5)");
    document.body.style.background = "#09090b";
    document.body.style.color = "#fafafa";
  }
}

const order: Theme[] = ["dark", "light", "system"];

const labels: Record<Theme, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

const icons: Record<Theme, JSX.Element> = {
  dark: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  light: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  system: (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  ),
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && order.includes(stored)) {
        setTheme(stored);
        applyTheme(stored);
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  const cycle = () => {
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-[var(--if-border,#27272a)] bg-[var(--if-surface,rgba(255,255,255,0.03))] text-[var(--if-text-muted,#71717a)] hover:text-[var(--if-text,#fafafa)] hover:border-green-500/30 focus:ring-2 focus:ring-green-500/30 focus:outline-none transition-all"
      title={`Theme: ${labels[theme]}`}
    >
      {icons[theme]}
      <span className="hidden sm:inline">{labels[theme]}</span>
    </button>
  );
}
