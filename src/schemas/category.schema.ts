import z from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters").optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
});
