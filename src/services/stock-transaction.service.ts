import { Request } from "express";
import prisma from "../lib/prisma";
import { NotFoundError, ValidationError } from "../utils/errors/AppError";
import { paginate, paginationMeta } from "../utils/pagination.util";
import { lowStockQueue } from "../lib/queue";

class StockTransactionService {
  async stockIn(payload: { productId: number; quantity: number; note?: string }, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: { id: payload.productId },
      });

      if (!product) {
        throw new ValidationError(`Product with id ${payload.productId} not found`);
      }

      const transaction = await tx.stockTransaction.create({
        data: {
          productId: payload.productId,
          type: "IN",
          quantity: payload.quantity,
          note: payload.note,
          userId: userId
        },
        include: {
          product: true,
        },
      });
      await tx.product.update({
        where: { id: payload.productId },
        data: {
          stock: { increment: payload.quantity },
        },
      });

      return transaction;
    });
  }

  async stockOut(payload: { productId: number; quantity: number; note?: string }, userId: number) {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: { id: payload.productId },
      });

      if (!product) {
        throw new ValidationError(`Product with id ${payload.productId} not found`);
      }

      if (product.stock < payload.quantity) {
        throw new ValidationError(`Product with id ${payload.productId} has insufficient stock`);
      }

      const transaction = await tx.stockTransaction.create({
        data: {
          productId: payload.productId,
          type: "OUT",
          quantity: payload.quantity,
          note: payload.note,
          userId: userId
        },
        include: {
          product: true,
        },
      });

      const updatedProduct = await tx.product.update({
        where: { id: payload.productId },
        data: {
          stock: { decrement: payload.quantity },
        },
      });

      if (updatedProduct.stock <= updatedProduct.minStock) {
        return { transaction, lowStockProduct: updatedProduct };
      }

      return { transaction, lowStockProduct: null };
    });

    if (result.lowStockProduct) {
      lowStockQueue.add({
        productId: result.lowStockProduct.id,
        productName: result.lowStockProduct.name,
        sku: result.lowStockProduct.sku,
        currentStock: result.lowStockProduct.stock,
        minStock: result.lowStockProduct.minStock,
      }).catch((error) => {
        console.error("Failed to enqueue low stock alert:", error);
      });
    }

    return result.transaction;
  }

  async getAll(req: Request) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { skip, take } = paginate(page, limit);

    const [transactions, total] = await Promise.all([
      prisma.stockTransaction.findMany({
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              stock: true,
              price: true,
              description: true,
              createdAt: true,
              supplier: {
                select: {
                  name: true,
                },
              },
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),
      prisma.stockTransaction.count(),
    ]);

    const meta = paginationMeta(total, page, limit);

    return {
      data: transactions,
      meta,
    };
  }

  async getById(id: number) {
    const transaction = await prisma.stockTransaction.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
            stock: true,
            price: true,
            description: true,
            createdAt: true,
            supplier: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return transaction;
  }
}

export const stockTransactionService = new StockTransactionService();
