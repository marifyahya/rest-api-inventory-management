import { z } from "zod";

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    contact: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional().nullable(),
    contact: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});
