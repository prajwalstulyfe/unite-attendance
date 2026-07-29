"use client";

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 px-6 md:px-12 bg-zinc-900/40 border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">3 Simple Steps</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How Unite Attendance Works</h2>
          <p className="text-sm text-zinc-400 font-medium">Deployment takes less than 5 minutes per campus.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
              1
            </div>
            <h3 className="text-lg font-extrabold text-white">Setup Admin Rules</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Create departments, roster members, and launch department-locked hardware kiosks from your Admin Dashboard.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
              2
            </div>
            <h3 className="text-lg font-extrabold text-white">Members Open Pass</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Employees and students open their Unite Mobile App to display their dynamic TOTP encrypted QR pass card.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
              3
            </div>
            <h3 className="text-lg font-extrabold text-white">Sub-Second Scan</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Kiosk hardware scans the pass instantly, verifies department lock, and streams telemetry to the cloud.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
