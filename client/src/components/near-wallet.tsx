import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function NearWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setIsConnecting(true);
    // Simulating NEAR wallet connection
    setTimeout(() => {
      setAccount("user.near");
      setIsConnecting(false);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to NEAR wallet.",
      });
    }, 1500);
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "NEAR wallet disconnected.",
    });
  };

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="h-9 px-3 flex items-center gap-2 border-primary/30 bg-primary/5">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-mono text-xs">{account}</span>
        </Badge>
        <Button variant="ghost" size="icon" onClick={disconnectWallet} className="h-9 w-9 text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet} 
      disabled={isConnecting}
      variant="outline"
      className="h-9 gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4 text-primary" />
      )}
      Connect NEAR
    </Button>
  );
}
