import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().positive("Stock must be a positive number"),
    categoryId: z
      .number("Category ID must be a valid number")
      .positive("Category ID must be a positive number"),
    supplierId: z
      .number("Supplier ID must be a valid number")
      .positive("Supplier ID must be a positive number")
      .optional(),
  }),
});
