import { Request } from "express";
import prisma from "../lib/prisma";
import { NotFoundError } from "../utils/errors/AppError";
import { Prisma } from "@prisma/client";
import { paginate, paginationMeta } from "../utils/pagination.util";
import { generateSKU } from "../utils/sku.util";

class ProductService {
  async getAll(req: Request) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const name = req.query.name as string;

    const { skip, take } = paginate(page, limit);

    const where: Prisma.ProductWhereInput = name
      ? {
        name: {
          contains: name,
        },
      }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: {
            select: {
              name: true,
            },
          },
          supplier: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const meta = paginationMeta(total, page, limit);

    return {
      data: products,
      meta,
    };
  }

  async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(payload: { name: string; price: number; stock: number; categoryId: number; supplierId?: number }) {
    return await prisma.product.create({
      data: {
        ...payload,
        sku: await generateSKU(payload.categoryId),
      },
    });
  }

  async update(id: number, payload: { name: string; price: number; stock: number; categoryId: number; supplierId?: number }) {
    try {
      return await prisma.product.update({
        where: {
          id: id,
        },
        data: payload,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError(`Product with id ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await prisma.product.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError(`Product with id ${id} not found`);
      }
      throw error;
    }
  }
}

export const productService = new ProductService();
