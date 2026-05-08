import { NextFunction, Request, Response } from "express";
import { categoryService } from "../../../services/category.service";
import { createMockReqRes } from "../../utils/mock-factory";
import * as categoryController from "../../../controllers/category.controller";
import { NotFoundError } from "../../../utils/errors/AppError";

jest.mock("../../../services/category.service");

describe("CategoryController", () => {
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
    it("should return all categories", async () => {
      const mockCategories = [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Clothing" },
      ];

      (categoryService.getAll as jest.Mock).mockResolvedValue(mockCategories);

      await categoryController.index(mockRequest, mockResponse, mockNext);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCategories,
      });
    })
  })

  describe("show", () => {
    it("should return a category by id", async () => {
      const mockCategory = { id: 1, name: "Electronics" };
      (categoryService.getById as jest.Mock).mockResolvedValue(mockCategory);

      mockRequest.params = { id: "1" };

      await categoryController.show(mockRequest, mockResponse, mockNext);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCategory,
      });
    })

    it("should call next with NotFoundError when category not found", async () => {
      mockRequest.params = { id: "999" };

      (categoryService.getById as jest.Mock).mockResolvedValue(null);

      await categoryController.show(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe("Category not found");
      expect(error.statusCode).toBe(404);
    })
  })

  describe("store", () => {
    it("should create a category", async () => {
      const mockCategory = { id: 1, name: "Electronics" };
      (categoryService.create as jest.Mock).mockResolvedValue(mockCategory);

      mockRequest.body = { name: "Electronics" };

      await categoryController.store(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCategory,
      });
    })
  })

  describe("update", () => {
    it("should update a category", async () => {
      const mockCategory = { id: 1, name: "Electronics" };
      (categoryService.update as jest.Mock).mockResolvedValue(mockCategory);

      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Electronics" };

      await categoryController.update(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCategory,
      });
    })

    it("should call next with NotFoundError when category not found", async () => {
      mockRequest.params = { id: "999" };

      (categoryService.update as jest.Mock).mockResolvedValue(null);

      await categoryController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe("Category not found");
      expect(error.statusCode).toBe(404);
    })
  })

  describe("destroy", () => {
    it("should delete a category", async () => {
      const mockCategory = { id: 1, name: "Electronics" };
      (categoryService.delete as jest.Mock).mockResolvedValue(mockCategory);

      mockRequest.params = { id: "1" };

      await categoryController.destroy(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: "Delete success",
      });
    })
  })
})