import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import auth tables to link against
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// --- INVOICES ---
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  supplierId: text("supplier_id").notNull().references(() => users.id),
  buyerId: text("buyer_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("USDC").notNull(),
  status: text("status", { enum: ["pending", "approved", "shipped", "delivered", "paid", "disputed"] }).default("pending").notNull(),
  dueDate: timestamp("due_date").notNull(),
  lineItems: jsonb("line_items").default([]).notNull(), // Array of { description, quantity, price }
  
  // AI Extraction Metadata
  originalPdfUrl: text("original_pdf_url"),
  aiConfidence: numeric("ai_confidence"),
  
  // Blockchain / RWA Metadata
  rwaTokenId: text("rwa_token_id"),
  contractAddress: text("contract_address"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- DELIVERIES ---
export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  proofImageUrl: text("proof_image_url").notNull(),
  
  // AI Verification Results
  aiVerified: boolean("ai_verified").default(false).notNull(),
  aiConfidence: numeric("ai_confidence"),
  aiAnalysis: jsonb("ai_analysis"), // Detailed breakdown of what AI saw
  
  location: text("location"),
  verifiedAt: timestamp("verified_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- PAYMENTS (Escrow & Release) ---
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull(),
  
  status: text("status", { enum: ["escrowed", "released", "refunded"] }).notNull(),
  txHash: text("tx_hash"), // Blockchain transaction hash
  
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

// --- RELATIONS ---
export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  supplier: one(users, {
    fields: [invoices.supplierId],
    references: [users.id],
    relationName: "supplierInvoices"
  }),
  buyer: one(users, {
    fields: [invoices.buyerId],
    references: [users.id],
    relationName: "buyerInvoices"
  }),
  delivery: one(deliveries, {
    fields: [invoices.id],
    references: [deliveries.invoiceId],
  }),
  payment: one(payments, {
    fields: [invoices.id],
    references: [payments.invoiceId],
  }),
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  invoice: one(invoices, {
    fields: [deliveries.invoiceId],
    references: [invoices.id],
  }),
}));

// --- SCHEMAS ---
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  rwaTokenId: true,
  contractAddress: true 
});

export const insertDeliverySchema = createInsertSchema(deliveries).omit({ 
  id: true, 
  createdAt: true,
  verifiedAt: true
});

// --- TYPES ---
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;

export type Payment = typeof payments.$inferSelect;

// --- API TYPES ---
export type CreateInvoiceRequest = InsertInvoice;
export type UpdateInvoiceRequest = Partial<InsertInvoice>;

export type CreateDeliveryRequest = InsertDelivery;

export type InvoiceResponse = Invoice & { 
  supplier?: typeof users.$inferSelect, 
  buyer?: typeof users.$inferSelect,
  delivery?: Delivery,
  payment?: Payment
};

// AI Types
export interface AiExtractionResponse {
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  lineItems: { description: string; quantity: number; price: number }[];
  confidence: number;
  supplierName?: string;
  buyerName?: string;
}

export interface AiVerificationResponse {
  verified: boolean;
  confidence: number;
  analysis: string;
  issues: string[];
}
