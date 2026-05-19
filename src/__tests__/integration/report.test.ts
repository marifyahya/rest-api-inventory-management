import request from "supertest";
import app from "../../app";
import { reportService } from "../../services/report.service";

// Mocking reportService
jest.mock("../../services/report.service", () => ({
  reportService: {
    getDashboard: jest.fn(),
    getLowStock: jest.fn(),
    exportStockExcel: jest.fn(),
    exportTransactionExcel: jest.fn(),
  },
}));

const authMiddleware = (req: any, res: any, next: any) => {
  req.user = { id: 1, role: "ADMIN" };
  next();
};

jest.mock("../../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 1, role: "ADMIN" };
    next();
  },
}));

describe("Report API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reports", () => {
    it("should return 200 and dashboard data", async () => {
      const mockDashboardData = {
        totalProducts: 10,
        totalCategories: 5,
        totalSuppliers: 3,
        totalStockValue: 100000,
        lowStockProducts: [],
      };

      (reportService.getDashboard as jest.Mock).mockResolvedValue(mockDashboardData);

      const response = await request(app).get("/api/reports");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockDashboardData,
      });
      expect(reportService.getDashboard).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/reports/low-stock", () => {
    it("should return 200 and paginated low stock products", async () => {
      const mockLowStockData = {
        data: [
          { id: 1, name: "Product 1", stock: 5 },
          { id: 2, name: "Product 2", stock: 8 },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      (reportService.getLowStock as jest.Mock).mockResolvedValue(mockLowStockData);

      const response = await request(app).get("/api/reports/low-stock");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockLowStockData,
      });
      expect(reportService.getLowStock).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should handle pagination parameters correctly", async () => {
      const mockLowStockData = {
        data: [],
        meta: { total: 0, page: 2, limit: 5, totalPages: 0 },
      };

      (reportService.getLowStock as jest.Mock).mockResolvedValue(mockLowStockData);

      const response = await request(app)
        .get("/api/reports/low-stock")
        .query({ page: 2, limit: 5 });

      expect(response.status).toBe(200);
      expect(reportService.getLowStock).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { page: "2", limit: "5" },
        })
      );
    });
  });

  describe("GET /api/reports/stock-export", () => {
    it("should trigger excel export for stock report", async () => {
      (reportService.exportStockExcel as jest.Mock).mockImplementation((res) => {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send("mock excel data");
      });

      const response = await request(app).get("/api/reports/stock-export");

      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toMatch(/application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/);
      expect(reportService.exportStockExcel).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("GET /api/reports/transactions-export", () => {
    it("should trigger streaming excel export for transactions report", async () => {
      (reportService.exportTransactionExcel as jest.Mock).mockImplementation((res) => {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.write("mock stream data");
        res.end();
      });

      const response = await request(app).get("/api/reports/transactions-export");

      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toMatch(/application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/);
      expect(reportService.exportTransactionExcel).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
