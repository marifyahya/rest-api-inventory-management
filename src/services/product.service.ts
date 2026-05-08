import prisma from "../lib/prisma";
import { NotFoundError } from "../utils/errors/AppError";
import { Prisma } from "@prisma/client";

class ProductService {
  async getAll() {
    return await prisma.product.findMany();
  }

  async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
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
        sku: await this.generateSKU(),
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

  private async generateSKU(): Promise<string> {
    const lastProduct = await prisma.product.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    let suffix = 1;
    if (lastProduct) {
      const lastSKU = lastProduct.sku;
      const lastSuffix = parseInt(lastSKU.split("-")[1]);
      suffix = lastSuffix + 1;
    }

    return `PROD-${suffix}`;
  }
}

export const productService = new ProductService();
