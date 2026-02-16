import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  users, invoices, deliveries, payments,
  type User, type InsertUser,
  type Invoice, type InsertInvoice,
  type Delivery, type InsertDelivery,
  type Payment
} from "@shared/schema";

// Import Auth Storage interface to extend it
import { type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Invoices
  getInvoices(role?: 'supplier' | 'buyer' | 'admin', userId?: string): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoiceStatus(id: number, status: string): Promise<Invoice | undefined>;
  
  // Deliveries
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  getDeliveryByInvoiceId(invoiceId: number): Promise<Delivery | undefined>;
  updateDeliveryVerification(id: number, verified: boolean, confidence: number, analysis: any): Promise<Delivery | undefined>;
  
  // Payments
  createPayment(payment: typeof payments.$inferInsert): Promise<Payment>;
  getPaymentByInvoiceId(invoiceId: number): Promise<Payment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // --- Auth Implementation (Required for Replit Auth) ---
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // --- Users ---
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return this.upsertUser(insertUser);
  }

  // --- Invoices ---
  async getInvoices(role?: 'supplier' | 'buyer' | 'admin', userId?: string): Promise<Invoice[]> {
    let query = db.select().from(invoices).orderBy(desc(invoices.createdAt));
    
    if (role === 'supplier' && userId) {
      query = query.where(eq(invoices.supplierId, userId)) as any;
    } else if (role === 'buyer' && userId) {
      query = query.where(eq(invoices.buyerId, userId)) as any;
    }
    
    return await query;
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async updateInvoiceStatus(id: number, status: string): Promise<Invoice | undefined> {
    const [updated] = await db
      .update(invoices)
      .set({ status, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  // --- Deliveries ---
  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const [delivery] = await db.insert(deliveries).values(insertDelivery).returning();
    return delivery;
  }

  async getDeliveryByInvoiceId(invoiceId: number): Promise<Delivery | undefined> {
    const [delivery] = await db.select().from(deliveries).where(eq(deliveries.invoiceId, invoiceId));
    return delivery;
  }
  
  async updateDeliveryVerification(id: number, verified: boolean, confidence: number, analysis: any): Promise<Delivery | undefined> {
    const [updated] = await db
      .update(deliveries)
      .set({ aiVerified: verified, aiConfidence: confidence.toString(), aiAnalysis: analysis, verifiedAt: new Date() })
      .where(eq(deliveries.id, id))
      .returning();
    return updated;
  }

  // --- Payments ---
  async createPayment(insertPayment: typeof payments.$inferInsert): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getPaymentByInvoiceId(invoiceId: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
    return payment;
  }
}

export const storage = new DatabaseStorage();
