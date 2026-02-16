import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "shipped" | "delivered" | "paid" | "disputed";

const styles: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-indigo-100 text-indigo-800 border-indigo-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  disputed: "bg-red-100 text-red-800 border-red-200",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  // Normalize string to match keys or fallback
  const normalizedStatus = (status?.toLowerCase() || "pending") as Status;
  const style = styles[normalizedStatus] || styles.pending;

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
      style,
      className
    )}>
      {status}
    </span>
  );
}
