import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").nullable(),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().positive("Stock must be a positive number"),
  }),
});
