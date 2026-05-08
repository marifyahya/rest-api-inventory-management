import request from "supertest";
import { categoryService } from "../../services/category.service";
import app from "../../app";

jest.mock("../../services/category.service", () => ({
  categoryService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 1, role: "ADMIN" };
    next();
  },
}));

describe("Category API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should response 201 when create a new category", async () => {
    const mockCategory = { id: 1, name: "Electronics", description: "Electronics products" };
    (categoryService.create as jest.Mock).mockResolvedValue(mockCategory);

    const response = await request(app).post("/api/admin/categories").send({
      name: "Electronics",
      description: "Electronics products",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toEqual(expect.objectContaining({
      id: 1,
      name: "Electronics"
    }));
  })

  it("Should response 200 when get all categories", async () => {
    const mockCategories = [{ id: 1, name: "Electronics", description: "Electronics products" }];
    (categoryService.getAll as jest.Mock).mockResolvedValue(mockCategories);

    const response = await request(app).get("/api/categories");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: "Electronics" })
    ]));
  })

  it("Should response 200 when get category by id", async () => {
    const mockCategory = { id: 1, name: "Electronics", description: "Electronics products" };
    (categoryService.getById as jest.Mock).mockResolvedValue(mockCategory);

    const response = await request(app).get("/api/categories/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(expect.objectContaining({
      id: 1,
      name: "Electronics"
    }));
  })

  it("Should response 200 when update a category", async () => {
    const mockCategory = { id: 1, name: "Electronics", description: "Electronics products" };
    (categoryService.update as jest.Mock).mockResolvedValue(mockCategory);

    const response = await request(app).put("/api/admin/categories/1").send({
      name: "Electronics",
      description: "Electronics products",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(expect.objectContaining({
      id: 1,
      name: "Electronics"
    }));
  })

  it("Should response 200 when delete a category", async () => {
    const response = await request(app).delete("/api/admin/categories/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Delete success");
  })
})