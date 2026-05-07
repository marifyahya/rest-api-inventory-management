import request from "supertest";
import { faker } from "@faker-js/faker";
import app from "../../app";
import { userService } from "../../services/user.service";

const url = "/api/admin/users";

jest.mock("../../services/user.service", () => ({
  userService: {
    create: jest.fn(),
    findByEmail: jest.fn(),
  },
}));

const mockAuth = jest.fn();
jest.mock("../../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => mockAuth(req, res, next),
}));

describe("User API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAuth.mockImplementation((req, res, next) => {
      req.user = { id: 1, role: "ADMIN" };
      next();
    });
  });

  describe("POST /api/admin/users", () => {
    it("should return 400 when validation fails", async () => {
      const invalidUser = { name: "", email: "Invalid Email", password: "123", role: "Invalid Role" };

      const response = await request(app).post(url).send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 201 when user is created", async () => {
      const validUser = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "STAFF"
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(null);
      (userService.create as jest.Mock).mockResolvedValue({ id: 1, ...validUser });

      const response = await request(app).post(url).send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({ id: 1, ...validUser });
    });

    it("should return 403 when user is not admin", async () => {
      mockAuth.mockImplementation((req, res, next) => {
        req.user = { id: 1, role: "STAFF" };
        next();
      });

      const validUser = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "STAFF"
      };

      const response = await request(app).post(url).send(validUser);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe("Insufficient permissions");
    });
  });
});
