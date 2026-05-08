import prisma from "../lib/prisma";
import { NotFoundError, ValidationError } from "../utils/errors/AppError";

class SupplierService {
  async getAll() {
    return await prisma.supplier.findMany({ include: { _count: { select: { products: true } } } });
  }

  async findById(id: number) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!supplier) {
      throw new NotFoundError();
    }

    return supplier;
  }

  async create(data: { name: string; contact?: string; address?: string }) {
    return await prisma.supplier.create({ data });
  }

  async update(id: number, data: { name?: string; contact?: string; address?: string }) {
    await this.findById(id);

    const supplier = await prisma.supplier.update({
      where: { id },
      data,
    });

    return supplier;
  }

  async delete(id: number) {
    const supplier = await this.findById(id);

    if (supplier._count.products > 0) {
      throw new ValidationError("Cannot delete supplier with associated products");
    }

    await prisma.supplier.delete({ where: { id } });

    return supplier;
  }
}

export const supplierService = new SupplierService();
