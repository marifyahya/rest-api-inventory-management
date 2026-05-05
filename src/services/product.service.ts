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

  async update(id: number, payload: { name: string; price: number; stock: number }) {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }

  async delete(id: number) {
    return await prisma.product.delete({
      where: {
        id: id,
      },
    });
  }
}

export const productService = new ProductService();
