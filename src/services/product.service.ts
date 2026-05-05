import prisma from "../lib/prisma";

class ProductService {
  async getAll() {
    return await prisma.product.findMany();
  }

  async getById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async create(payload: { name: string; price: number; stock: number }) {
    return await prisma.product.create({
      data: payload,
    });
  }
}

export const productService = new ProductService();
