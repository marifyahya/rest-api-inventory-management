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
    },
  },
}));

describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call prisma.product.findMany", async () => {
      const mockProducts = [{ id: 1, name: "Test", categoryId: 1, price: 100, stock: 10, supplierId: 1, sku: "PROD-1" }];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productService.getAll();

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getById", () => {
    it("should return product when found", async () => {
      const mockProduct = { id: 1, name: "Test" };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.getById(1);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProduct);
    });
  });
});
