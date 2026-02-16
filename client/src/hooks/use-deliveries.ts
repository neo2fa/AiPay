import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDelivery } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCreateDelivery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertDelivery) => {
      const res = await fetch(api.deliveries.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to submit delivery proof");
      return api.deliveries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      toast({
        title: "Proof Submitted",
        description: "Delivery proof uploaded. AI verification started.",
      });
    },
  });
}

export function useVerifyDelivery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.deliveries.verify.path, { id });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Verification failed");
      return api.deliveries.verify.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      if (data.verified) {
        toast({
          title: "Verified Successfully",
          description: `Confidence Score: ${(data.confidence * 100).toFixed(1)}%`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "AI could not verify this delivery proof.",
          variant: "destructive",
        });
      }
    },
  });
}
