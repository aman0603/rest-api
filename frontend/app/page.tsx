import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 font-mono selection:bg-emerald-500/30">
      <div className="space-y-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-zinc-900/50 rounded-full border border-zinc-800 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
            <Terminal className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500">
            SECURE TASK OPS
          </h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">
            Advanced Protocol Management System v1.0
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold tracking-wide w-full sm:w-auto shadow-lg shadow-emerald-900/20">
              INITIALIZE SESSION
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 w-full sm:w-auto">
              NEW REGISTRATION
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-xs text-zinc-700 uppercase tracking-widest">
        System Status: OPERATIONAL
      </div>
    </div>
  );
}
