"use client";

export function Footer() {
  return (
    <footer className="py-10 px-6 md:px-12 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <img src="/uniteIcon.png" alt="Logo" className="h-6 w-6 rounded-lg" />
            <span className="font-extrabold text-zinc-800 dark:text-zinc-300">Unite Attendance</span>
          </div>
          <div className="flex gap-6 text-zinc-600 dark:text-zinc-400 font-medium">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#ecosystem" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Ecosystem</a>
            <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-zinc-500">
          <p>© 2026 Unite Attendance. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Powered by{" "}
            <a
              href="https://www.unite-india.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
            >
              Unite India
            </a>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <a
              href="https://www.unite-india.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
            >
              www.unite-india.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
