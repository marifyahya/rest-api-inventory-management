import { z } from "zod";

export const createStockTransactionSchema = z.object({
  body: z.object({
    productId: z.number("Product ID must be a valid number"),
    quantity: z.number("Quantity must be a valid number").positive(),
    note: z.string().optional(),
  }),
});
