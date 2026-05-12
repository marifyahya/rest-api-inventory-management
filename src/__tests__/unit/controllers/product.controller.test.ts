import { Request, Response, NextFunction } from "express";
import * as productController from "../../../controllers/product.controller";
import { productService } from "../../../services/product.service";
import { createMockReqRes } from "../../utils/mock-factory";
import { NotFoundError } from "../../../utils/errors/AppError";

jest.mock("../../../services/product.service", () => ({
  productService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("ProductController", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    const mocked = createMockReqRes();
    mockRequest = mocked.req;
    mockResponse = mocked.res;
    mockNext = jest.fn();
    jsonMock = mocked.jsonMock;
    statusMock = mocked.statusMock;

    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return all products with pagination meta", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", price: 100, stock: 10 },
        { id: 2, name: "Product 2", price: 200, stock: 20 },
      ];
      const mockMeta = { currentPage: 1, lastPage: 1, perPage: 10, total: 2 };

      (productService.getAll as jest.Mock).mockResolvedValue({
        data: mockProducts,
        meta: mockMeta,
      });

      await productController.index(mockRequest, mockResponse, mockNext);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
        meta: mockMeta,
      });
    });
  });

  describe("show", () => {
    it("should return product by id", async () => {
      const mockProduct = { id: 1, name: "Product 1", price: 100, stock: 10 };
      mockRequest.params = { id: "1" };

      (productService.getById as jest.Mock).mockResolvedValue(mockProduct);

      await productController.show(mockRequest, mockResponse, mockNext);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
      });
    });

    it("should call next with NotFoundError when product not found", async () => {
      mockRequest.params = { id: "999" };

      (productService.getById as jest.Mock).mockResolvedValue(null);

      await productController.show(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe("Product not found");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("store", () => {
    it("should create new product", async () => {
      const newProduct = { name: "New Product", price: 150, stock: 5 };
      mockRequest.body = newProduct;

      (productService.create as jest.Mock).mockResolvedValue({
        id: 3,
        ...newProduct,
      });

      await productController.store(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { id: 3, ...newProduct },
      });
    });
  });

  describe("update", () => {
    it("should update product", async () => {
      const updatedProduct = { id: 1, name: "Updated", price: 300, stock: 15 };
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Updated", price: 300, stock: 15 };

      (productService.update as jest.Mock).mockResolvedValue(updatedProduct);

      await productController.update(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedProduct,
      });
    });
  });

  describe("destroy", () => {
    it("should delete product", async () => {
      const mockProduct = { id: 1, name: "Product 1", price: 100, stock: 10 };
      mockRequest.params = { id: "1" };

      (productService.getById as jest.Mock).mockResolvedValue(mockProduct);
      (productService.delete as jest.Mock).mockResolvedValue(mockProduct);

      await productController.destroy(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: "Product deleted successfully",
      });
    });

    it("should call next with NotFoundError when product not found", async () => {
      mockRequest.params = { id: "999" };

      (productService.getById as jest.Mock).mockResolvedValue(null);

      await productController.destroy(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });
});