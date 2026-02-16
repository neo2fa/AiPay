import { Layout } from "@/components/layout";
import { useInvoices } from "@/hooks/use-invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Link } from "wouter";
import { Search, Filter, Plus } from "lucide-react";
import { format } from "date-fns";

export default function Invoices() {
  const { data: invoices, isLoading } = useInvoices();

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage and track your invoice payments.</p>
          </div>
          <Link href="/create-invoice">
            <Button className="bg-primary shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> New Invoice
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search invoices..." className="pl-9" />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading invoices...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">Invoice #</th>
                      <th className="px-6 py-4 font-medium">Supplier</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Due Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoices?.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{invoice.invoiceNumber}</td>
                        <td className="px-6 py-4 text-muted-foreground">Acme Corp</td>
                        <td className="px-6 py-4 font-mono">${Number(invoice.amount).toLocaleString()}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Button size="sm" variant="ghost">Details</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {invoices?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          No invoices found. Create one to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
