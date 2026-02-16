import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight">AI Pay</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={() => window.location.href = "/api/login"} variant="outline">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-enter">
            <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight tracking-tight text-foreground">
              Autonomous Supply Chain <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Payments</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Upload an invoice. AI verifies delivery. Get paid instantly. 
              The future of B2B payments is automated, secure, and fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all" onClick={() => window.location.href = "/api/login"}>
                Start Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                View Demo
              </Button>
            </div>
            
            <div className="pt-8 flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>AI Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Instant Payouts</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full flex items-center justify-center animate-enter animate-delay-200">
            {/* Abstract UI representation */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="h-32 bg-gradient-to-br from-primary/10 to-blue-500/10 p-6 flex items-center justify-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-primary fill-primary" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <div className="text-sm text-muted-foreground">Invoice #INV-2024</div>
                    <div className="font-bold text-lg">$50,000.00</div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Paid</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">AI Verified Delivery</div>
                      <div className="text-xs text-muted-foreground">Confidence: 99.8%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <DollarSign className="h-4 w-4" /> {/* Missing import, fixed below */}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Payment Released</div>
                      <div className="text-xs text-muted-foreground">Via Smart Contract</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2024 AI Pay. Built for the Future of Supply Chain.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper to fix missing import in the visual component
function DollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
