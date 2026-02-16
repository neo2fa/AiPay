import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useExtractInvoice() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fileUrl: string) => {
      const res = await fetch(api.ai.extractInvoice.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("AI Extraction failed");
      return api.ai.extractInvoice.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Extraction Failed",
        description: "Could not analyze the document. Please try again.",
        variant: "destructive",
      });
    }
  });
}
