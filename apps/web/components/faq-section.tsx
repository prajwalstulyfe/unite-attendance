"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to buy a expensive biometric machine?",
      a: "No hardware investment is required! You can use any existing office tablet, iPad, PC, laptop, or smartphone as your dedicated kiosk attendance scanner."
    },
    {
      q: "How long does setup take?",
      a: "Setup takes literally 10 minutes. Create an organization account, set up your shift timings, import your employee list via Excel, and start scanning right away."
    },
    {
      q: "Can I manage multiple branches and departments?",
      a: "Yes! Unite Attendance is built for scale. You can manage multiple office locations, factory sites, and departments from a single real-time admin dashboard with role-based access control."
    },
    {
      q: "Does it require software installation on my PC?",
      a: "No, Unite Attendance is a 100% cloud-based SaaS platform. You access the admin dashboard and kiosk scanners through standard web browsers, ensuring your operational data is backed up and accessible from anywhere."
    },
    {
      q: "How does the anti-spoofing dynamic TOTP QR pass work?",
      a: "Our mobile pass app generates dynamic 30-second time-based encrypted TOTP QR codes. Unlike static QR images, screenshots shared over WhatsApp or Slack expire instantly and fail verification at kiosk terminals."
    },
    {
      q: "Can we export attendance logs for payroll software?",
      a: "Absolutely! Unite Attendance provides 1-click PDF summary reports and CSV raw data exports with custom date ranges, branch filters, and department metrics ready for any HR or payroll software."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 md:px-12 bg-zinc-100/60 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Got Questions? We Have Answers</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-zinc-900 dark:text-white cursor-pointer"
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
