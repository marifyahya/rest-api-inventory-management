import request from "supertest";
import app from "../../app";
import { stockTransactionService } from "../../services/stock-transaction.service";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";

jest.mock("../../services/stock-transaction.service", () => ({
  stockTransactionService: {
    getAll: jest.fn(),
    stockIn: jest.fn(),
    stockOut: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock("../../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 1, role: "STAFF" };
    next();
  },
}));

describe("Stock Transaction Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/stock/transactions", () => {
    it("should return 200 and list of transactions", async () => {
      const mockTransactions = [
        { id: 1, productId: 1, quantity: 10, type: "IN", note: "Initial stock" },
      ];
      const mockData = {
        data: mockTransactions,
        meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 1 },
      };
      (stockTransactionService.getAll as jest.Mock).mockResolvedValue(mockData);

      const response = await request(app).get("/api/stock/transactions");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        ...mockData,
      });
      expect(stockTransactionService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/stock/in", () => {
    it("should return 200 and create stock in record", async () => {
      const mockTransaction = { id: 1, productId: 1, quantity: 10, type: "IN", note: "Initial stock" };
      (stockTransactionService.stockIn as jest.Mock).mockResolvedValue(mockTransaction);

      const response = await request(app).post("/api/stock/in").send({
        productId: 1,
        quantity: 10,
        note: "Initial stock",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockTransaction,
      });
      expect(stockTransactionService.stockIn).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if validation fails", async () => {
      (stockTransactionService.stockIn as jest.Mock).mockRejectedValue(new ValidationError("Validation failed"));

      const response = await request(app).post("/api/stock/in").send({
        productId: null,
        quantity: null,
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "The given data was invalid.",
      });
    });
  });

  describe("POST /api/stock/out", () => {
    it("should return 200 and create stock out record", async () => {
      const mockTransaction = { id: 1, productId: 1, quantity: 5, type: "OUT", note: "Sold to customer" };
      (stockTransactionService.stockOut as jest.Mock).mockResolvedValue(mockTransaction);

      const response = await request(app).post("/api/stock/out").send({
        productId: 1,
        quantity: 5,
        note: "Sold to customer",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockTransaction,
      });
    });

    it("should return 400 if stock is insufficient", async () => {
      (stockTransactionService.stockOut as jest.Mock).mockRejectedValue(new ValidationError("Insufficient stock"));

      const response = await request(app).post("/api/stock/out").send({
        productId: null,
        quantity: null,
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "The given data was invalid.",
      });
    });
  });

  describe("GET /api/stock/transactions/:id", () => {
    it("should return 200 and transaction detail", async () => {
      const mockTransaction = { id: 1, productId: 1, quantity: 5, type: "OUT", note: "Sold to customer" };
      (stockTransactionService.getById as jest.Mock).mockResolvedValue(mockTransaction);

      const response = await request(app).get("/api/stock/transactions/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockTransaction,
      });
    });

    it("should return 404 if transaction not found", async () => {
      (stockTransactionService.getById as jest.Mock).mockRejectedValue(new NotFoundError("Transaction not found"));

      const response = await request(app).get("/api/stock/transactions/1");

      expect(response.status).toBe(404);
    });
  });
});
