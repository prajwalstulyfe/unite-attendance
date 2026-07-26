import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-6">
      <h1 className="text-4xl font-bold tracking-tight">Unite Attendance</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Scalable, Secure, and Seamless Attendance Management for Educational Institutions and Organizations.
      </p>
      <div className="flex gap-4">
        <Button variant="default">Get Started</Button>
        <Button variant="outline">Documentation</Button>
      </div>
    </main>
  );
}
