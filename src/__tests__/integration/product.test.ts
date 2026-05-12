import request from "supertest";
import { productService } from "../../services/product.service";
import app from "../../app";

jest.mock("../../services/product.service", () => ({
  productService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 1, role: "STAFF" };
    next();
  },
}));

describe("Product API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return 200 and all products", async () => {
      const mockProducts = [{ id: 1, name: "Product A", price: 100, stock: 10 }];
      const mockData = {
        data: mockProducts,
        meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 1 },
      };
      (productService.getAll as jest.Mock).mockResolvedValue(mockData);

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        ...mockData,
      });
    });
  });

  describe("POST /api/products", () => {
    it("should return 400 when validation fails", async () => {
      const invalidProduct = { name: "", price: -10 }; // Invalid data

      const response = await request(app).post("/api/products").send(invalidProduct);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 201 when product is created", async () => {
      const validProduct = { name: "New Product", price: 150, stock: 5, categoryId: 1 };
      (productService.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...validProduct,
      });

      const response = await request(app).post("/api/products").send(validProduct);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: { id: 1, ...validProduct },
      });
    });
  });

  describe("General Error Handling", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/non-existent-route");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe("Route not found");
    });
  });
});
