import { productService } from "../../../services/product.service";
import prisma from "../../../lib/prisma";

// Mock Prisma
jest.mock("../../../lib/prisma", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  },
}));

describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call prisma.product.findMany and return paginated data", async () => {
      const mockProducts = [{ id: 1, name: "Test", categoryId: 1, price: 100, stock: 10, supplierId: 1, sku: "PROD-1" }];
      const mockReq = {
        query: { page: "1", limit: "10", name: "Test" },
      } as any;

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      const result = await productService.getAll(mockReq);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(prisma.product.count).toHaveBeenCalled();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("meta");
      expect(result.data).toEqual(mockProducts);
      expect(result.meta).toEqual({
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 1,
      });
    });
  });

  describe("getById", () => {
    it("should return product when found", async () => {
      const mockProduct = { id: 1, name: "Test" };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.getById(1);

      expect(prisma.product.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it("should throw NotFoundError when product not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(productService.getById(999)).rejects.toThrow("Product with id 999 not found");
    });
  });

  describe("create", () => {
    it("should create a product with generated SKU based on category", async () => {
      const payload = { name: "New Product", price: 100, stock: 10, categoryId: 1 };
      const mockCategory = { id: 1, name: "Electronics" };

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.product.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.product.create as jest.Mock).mockResolvedValue({ id: 1, ...payload, sku: "ELE-001" });

      const result = await productService.create(payload);

      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.product.create).toHaveBeenCalled();
      expect(result.sku).toBe("ELE-001");
    });
  });

  describe("update", () => {
    it("should update an existing product", async () => {
      const payload = { name: "Updated", price: 150, stock: 5, categoryId: 1 };
      (prisma.product.update as jest.Mock).mockResolvedValue({ id: 1, ...payload });

      const result = await productService.update(1, payload);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: payload,
      });
      expect(result.name).toBe("Updated");
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await productService.delete(1);

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ id: 1 });
    });
  });
});
