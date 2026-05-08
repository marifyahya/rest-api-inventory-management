import prisma from "../lib/prisma";
import { ConflictError, NotFoundError } from "../utils/errors/AppError";

class CategoryService {
  getAll() {
    return prisma.category.findMany(
      { include: { _count: { select: { products: true } } } }
    );
  }

  getById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });
  }

  async create(payload: { name: string; description?: string }) {
    const findCategory = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (findCategory) {
      throw new ConflictError("Category already exists");
    }

    return await prisma.category.create({
      data: payload,
    });
  }

  update(id: number, payload: { name?: string; description?: string }) {
    return prisma.category.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category._count.products > 0) {
      throw new ConflictError("Category has linked products");
    }

    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();