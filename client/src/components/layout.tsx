import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  PlusCircle, 
  ShieldCheck,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isSupplier = user?.id?.endsWith("supplier") || true; // Mock role logic for now

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    ...(isSupplier ? [{ name: 'Create Invoice', href: '/create-invoice', icon: PlusCircle }] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border shadow-sm">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <ShieldCheck className="h-8 w-8 text-primary mr-2" />
          <span className="font-display font-bold text-xl tracking-tight">AI Pay</span>
        </div>
        
        <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href} className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.firstName || 'User'}</span>
              <span className="text-xs text-muted-foreground truncate">Supplier Account</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/50"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header (visible only on small screens) */}
        <div className="md:hidden h-16 bg-card border-b flex items-center justify-between px-4 sticky top-0 z-40">
           <div className="flex items-center">
            <ShieldCheck className="h-6 w-6 text-primary mr-2" />
            <span className="font-display font-bold text-lg">AI Pay</span>
           </div>
           {/* Mobile menu trigger would go here */}
        </div>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
