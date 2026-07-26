import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 gap-6 text-center">
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Unite Attendance</h1>
      <p className="text-muted-foreground text-center max-w-md text-sm sm:text-base">
        Scalable, Secure, and Seamless Attendance Management for Educational Institutions and Organizations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
        <Button variant="default" className="w-full sm:w-auto">Get Started</Button>
        <Button variant="outline" className="w-full sm:w-auto">Documentation</Button>
      </div>
    </main>
  );
}

