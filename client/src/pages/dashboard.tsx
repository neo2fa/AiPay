import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoices } from "@/hooks/use-invoices";
import { useAuth } from "@/hooks/use-auth";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  DollarSign
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { format } from "date-fns";
import { NearWallet } from "@/components/near-wallet";
import { AiAssistant } from "@/components/ai-assistant";

const mockChartData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
  { name: 'Jul', amount: 3490 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: invoices, isLoading } = useInvoices();

  const totalAmount = invoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const pendingCount = invoices?.filter(i => i.status === 'pending').length || 0;
  const paidCount = invoices?.filter(i => i.status === 'paid').length || 0;

  return (
    <Layout>
      <div className="flex flex-col space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.firstName || 'User'}. Here's your financial overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <NearWallet />
            <Link href="/create-invoice">
              <Button size="lg" className="bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Create New Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="dashboard-card border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" /> +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requiring approval or verification
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid Invoices</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully processed
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disputes</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Action required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Invoices Table */}
          <Card className="col-span-1 lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-10 w-full bg-muted animate-pulse rounded" />
                  <div className="h-10 w-full bg-muted animate-pulse rounded" />
                  <div className="h-10 w-full bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <div className="space-y-1">
                  {invoices?.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {invoice.invoiceNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-medium">${Number(invoice.amount).toLocaleString()}</span>
                        <StatusBadge status={invoice.status} />
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="sm" className="hidden sm:flex">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {invoices?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No invoices found.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Chart */}
          <Card className="col-span-1 shadow-md">
            <CardHeader>
              <CardTitle>Cash Flow</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} prefix="$" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <AiAssistant />
    </Layout>
  );
}
