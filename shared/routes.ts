import { z } from 'zod';
import { insertInvoiceSchema, insertDeliverySchema, invoices, deliveries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // --- INVOICES ---
  invoices: {
    list: {
      method: 'GET' as const,
      path: '/api/invoices' as const,
      input: z.object({
        role: z.enum(['supplier', 'buyer', 'admin']).optional(),
        status: z.string().optional()
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof invoices.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/invoices/:id' as const,
      responses: {
        200: z.custom<typeof invoices.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/invoices' as const,
      input: insertInvoiceSchema,
      responses: {
        201: z.custom<typeof invoices.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: { // For Buyer approval or Admin overrides
      method: 'PATCH' as const,
      path: '/api/invoices/:id/status' as const,
      input: z.object({ status: z.enum(["pending", "approved", "shipped", "delivered", "paid", "disputed"]) }),
      responses: {
        200: z.custom<typeof invoices.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },

  // --- DELIVERIES ---
  deliveries: {
    create: {
      method: 'POST' as const,
      path: '/api/deliveries' as const,
      input: insertDeliverySchema,
      responses: {
        201: z.custom<typeof deliveries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    verify: { // AI Trigger endpoint
      method: 'POST' as const,
      path: '/api/deliveries/:id/verify' as const, // :id is delivery ID
      responses: {
        200: z.object({
          verified: z.boolean(),
          confidence: z.number(),
          analysis: z.any()
        }),
        404: errorSchemas.notFound,
      },
    }
  },

  // --- AI FEATURES ---
  ai: {
    extractInvoice: {
      method: 'POST' as const,
      path: '/api/ai/extract-invoice' as const,
      input: z.object({ fileUrl: z.string() }), // Pass the uploaded file URL
      responses: {
        200: z.object({
          invoiceNumber: z.string(),
          amount: z.number(),
          currency: z.string(),
          dueDate: z.string(),
          lineItems: z.array(z.object({ description: z.string(), quantity: z.number(), price: z.number() })),
          confidence: z.number()
        })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
