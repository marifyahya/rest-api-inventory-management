import prisma from "../lib/prisma";
import { NotFoundError } from "./errors/AppError";

export const generateSKU = async (categoryId: number): Promise<string> => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new NotFoundError(`Category with id ${categoryId} not found`);
  }

  const prefix = category.name.substring(0, 3).toUpperCase();

  const lastProduct = await prisma.product.findFirst({
    where: {
      categoryId: categoryId,
    },
    orderBy: {
      id: "desc",
    },
    select: {
      sku: true,
    },
  });

  if (!lastProduct) {
    return `${prefix}-000001`;
  }

  const lastSku = lastProduct.sku;
  const parts = lastSku.split("-");
  const lastNumber = parseInt(parts[1]) || 0;
  const nextNumber = lastNumber + 1;

  return `${prefix}-${nextNumber.toString().padStart(6, "0")}`;
};