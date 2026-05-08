import prisma from "../../../lib/prisma";
import { categoryService } from "../../../services/category.service";

jest.mock("../../../lib/prisma", () => ({
  __esModule: true,
  default: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

describe("CategoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all categories", async () => {
      const categories = [{
        id: 1,
        name: "Electronics",
        description: "Electronics products",
        createdAt: "2022-01-01T00:00:00.000Z",
        updatedAt: "2022-01-01T00:00:00.000Z",
      }];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(categories);

      const result = await categoryService.getAll();

      expect(prisma.category.findMany).toHaveBeenCalled();
      expect(result).toEqual(categories);
    })
  })

  describe("findById", () => {
    it("should return category by id", async () => {
      const category = {
        id: 1,
        name: "Electronics",
        description: "Electronics products",
        createdAt: "2022-01-01T00:00:00.000Z",
        updatedAt: "2022-01-01T00:00:00.000Z",
      };

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(category);

      const result = await categoryService.getById(1);

      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(category);
    })

    it("should return null if category not found", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.getById(1);
      expect(result).toBeNull();
    })
  })

  describe("create", () => {
    it("should create category", async () => {
      const category = {
        id: 1,
        name: "Electronics",
        description: "Electronics products",
        createdAt: "2022-01-01T00:00:00.000Z",
        updatedAt: "2022-01-01T00:00:00.000Z",
      };

      (prisma.category.create as jest.Mock).mockResolvedValue(category);

      const result = await categoryService.create({
        name: "Electronics",
        description: "Electronics products",
      });

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: "Electronics",
          description: "Electronics products",
        },
      });
      expect(result).toEqual(category);
    })

    it("should throw error if category already exists", async () => {
      (prisma.category.create as jest.Mock).mockRejectedValue(new Error("Category already exists"));

      await expect(categoryService.create({
        name: "Electronics",
        description: "Electronics products",
      })).rejects.toThrow("Category already exists");
    })
  })

  describe("update", () => {
    it("should update category", async () => {
      const category = {
        id: 1,
        name: "Electronics",
        description: "Electronics products"
      };

      (prisma.category.update as jest.Mock).mockResolvedValue(category);

      const result = await categoryService.update(1, {
        name: "Electronics",
        description: "Electronics products",
      });

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "Electronics",
          description: "Electronics products",
        },
      });
      expect(result).toEqual(category);
    })

    it("should throw error if category not found", async () => {
      (prisma.category.update as jest.Mock).mockRejectedValue(new Error("Category not found"));

      await expect(categoryService.update(1, {
        name: "Electronics",
        description: "Electronics products",
      })).rejects.toThrow("Category not found");
    })

    it("should throw error if category already exists", async () => {
      (prisma.category.update as jest.Mock).mockRejectedValue(new Error("Category already exists"));

      await expect(categoryService.update(1, {
        name: "Electronics",
        description: "Electronics products",
      })).rejects.toThrow("Category already exists");
    })
  })

  describe("delete", () => {
    it("should delete category", async () => {
      (prisma.category.delete as jest.Mock).mockResolvedValue({});

      await categoryService.delete(1);

      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    })

    it("should throw error if category not found", async () => {
      (prisma.category.delete as jest.Mock).mockRejectedValue(new Error("Category not found"));

      await expect(categoryService.delete(1)).rejects.toThrow("Category not found");
    })
  })
})