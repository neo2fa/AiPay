import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExtractInvoice } from "@/hooks/use-ai";
import { useCreateInvoice } from "@/hooks/use-invoices";
import { useLocation } from "wouter";
import { Loader2, UploadCloud, FileCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function CreateInvoice() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [file, setFile] = useState<File | null>(null);
  
  const extractInvoice = useExtractInvoice();
  const createInvoice = useCreateInvoice();

  // Form State (usually managed by react-hook-form, simplified here for clarity with multi-step)
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    currency: "USDC",
    dueDate: "",
    supplierId: "1", // Mock
    buyerId: "2", // Mock
    originalPdfUrl: "",
    lineItems: [] as any[]
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Simulate upload delay & AI processing
    const fakeUrl = URL.createObjectURL(selectedFile);
    
    try {
      // In a real app, we'd upload to S3/Blob storage first, then pass URL to AI
      // Here we just pass a mock URL to our mock AI endpoint
      const aiResult = await extractInvoice.mutateAsync(fakeUrl);
      
      setFormData(prev => ({
        ...prev,
        invoiceNumber: aiResult.invoiceNumber,
        amount: String(aiResult.amount),
        currency: aiResult.currency,
        dueDate: aiResult.dueDate.split('T')[0], // YYYY-MM-DD
        lineItems: aiResult.lineItems,
        originalPdfUrl: fakeUrl,
        supplierId: "1", // Hardcoded for demo
        buyerId: "2"     // Hardcoded for demo
      }));
      
      setStep("review");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      await createInvoice.mutateAsync({
        ...formData,
        amount: formData.amount, // Schema expects numeric string or number depending on implementation
        dueDate: new Date(formData.dueDate).toISOString(),
      });
      setLocation("/invoices");
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground mt-2">Upload your invoice PDF and let AI extract the details.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/5">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {extractInvoice.isPending ? (
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    ) : (
                      <UploadCloud className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {extractInvoice.isPending ? "AI is Analyzing..." : "Upload Invoice PDF"}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {extractInvoice.isPending 
                      ? "Extracting vendor, amount, line items, and dates automatically." 
                      : "Drag and drop your file here, or click to browse."
                    }
                  </p>
                  
                  <div className="relative">
                    <Button disabled={extractInvoice.isPending} size="lg">
                      Select File
                    </Button>
                    <Input 
                      type="file" 
                      accept=".pdf,.png,.jpg"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                      disabled={extractInvoice.isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-green-500" />
                    Review Extracted Data
                  </CardTitle>
                  <CardDescription>
                    Please verify the AI extracted details before submitting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input 
                        id="invoiceNumber" 
                        value={formData.invoiceNumber} 
                        onChange={e => setFormData({...formData, invoiceNumber: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input 
                        id="dueDate" 
                        type="date"
                        value={formData.dueDate} 
                        onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          id="amount" 
                          className="pl-7"
                          value={formData.amount} 
                          onChange={e => setFormData({...formData, amount: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input 
                        id="currency" 
                        value={formData.currency} 
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Line Items</h4>
                    <div className="bg-muted/30 rounded-lg border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                          <tr>
                            <th className="p-3 font-medium">Description</th>
                            <th className="p-3 font-medium w-20">Qty</th>
                            <th className="p-3 font-medium w-32">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.lineItems.map((item, i) => (
                            <tr key={i} className="border-t border-border/50">
                              <td className="p-3">{item.description}</td>
                              <td className="p-3">{item.quantity}</td>
                              <td className="p-3 font-mono">${item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep("upload")}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={createInvoice.isPending} className="bg-primary">
                      {createInvoice.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        <>
                          Submit Invoice <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
