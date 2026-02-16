import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertInvoice, type Invoice } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useInvoices(filters?: { role?: string; status?: string }) {
  const queryString = filters 
    ? "?" + new URLSearchParams(filters as Record<string, string>).toString()
    : "";

  return useQuery({
    queryKey: [api.invoices.list.path, filters],
    queryFn: async () => {
      const res = await fetch(api.invoices.list.path + queryString, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return api.invoices.list.responses[200].parse(await res.json());
    },
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: [api.invoices.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.invoices.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch invoice");
      return api.invoices.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertInvoice) => {
      const res = await fetch(api.invoices.create.path, {
        method: api.invoices.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create invoice");
      }
      return api.invoices.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      toast({
        title: "Invoice Created",
        description: "Your invoice has been successfully submitted for approval.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl(api.invoices.updateStatus.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.invoices.get.path, variables.id] });
      toast({
        title: "Status Updated",
        description: `Invoice status changed to ${variables.status}`,
      });
    },
  });
}
