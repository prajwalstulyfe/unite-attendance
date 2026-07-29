"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the anti-spoofing TOTP QR pass work?",
      a: "Our mobile pass app generates dynamic 30-second time-based encrypted TOTP QR codes. Unlike static QR images, screenshots shared over WhatsApp or Slack expire instantly and fail verification at kiosk terminals."
    },
    {
      q: "Can we install the Kiosk Scanner PWA on tablets and iPads?",
      a: "Yes! The Kiosk Scanner is a lightweight Progressive Web App (PWA) that installs on iPadOS, Android tablets, Windows PCs, and dedicated kiosk hardware. Each device locks to its assigned department or gate."
    },
    {
      q: "How does multi-branch & department locking work?",
      a: "Administrators can pair hardware kiosks to specific departments (e.g. Engineering, HR, Sales). Members assigned to other departments are flagged with instant access denial when attempting to scan at restricted gates."
    },
    {
      q: "Can we export attendance data for payroll or ERP systems?",
      a: "Absolutely! Unite Attendance provides 1-click PDF summary reports and CSV raw data exports with custom date ranges, branch filters, and department metrics ready for SAP, Workday, or custom HR systems."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 md:px-12 bg-zinc-100/60 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Got Questions? We Have Answers</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-zinc-900 dark:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === idx && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium pt-2 pl-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
