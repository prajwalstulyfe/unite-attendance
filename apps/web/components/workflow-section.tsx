"use client";

export function WorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Create Organization",
      desc: "Sign up, create your company workspace, and configure your default time zone and work rules.",
      color: "bg-indigo-600 shadow-indigo-600/30"
    },
    {
      num: "02",
      title: "Roster Team Members",
      desc: "Add employees, branch managers, and department heads with assigned roles and employee IDs.",
      color: "bg-purple-600 shadow-purple-600/30"
    },
    {
      num: "03",
      title: "Configure Shift Rules",
      desc: "Define work schedules, grace periods for late marks, weekends, and location boundaries.",
      color: "bg-pink-600 shadow-pink-600/30"
    },
    {
      num: "04",
      title: "Start Attendance Scanning",
      desc: "Launch the kiosk app on any office tablet or PC, and members present their dynamic 30-second TOTP pass.",
      color: "bg-emerald-600 shadow-emerald-600/30"
    }
  ];

  return (
    <section id="workflow" className="py-20 px-6 md:px-12 bg-zinc-100/60 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">10-Minute Onboarding</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Up & Running Before Your Next Shift Starts</h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">No complex hardware installation, no lengthy staff training required.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className={`h-12 w-12 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-lg ${step.color}`}>
                  {step.num}
                </div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
