import request from "supertest";
import app from "../../app";
import { userService } from "../../services/user.service";
import { generateToken } from "../../utils/jwt.util";

jest.mock("../../services/user.service", () => ({
  userService: {
    findByEmail: jest.fn(),
    comparePassword: jest.fn(),
    findById: jest.fn(),
  },
}));

describe("Auth API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("should return token with valid credentials", async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        role: "ADMIN",
      });

      (userService.comparePassword as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "john@sample.test",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("user");
    });

    it("should return 400 when email format is invalid", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "john",
          password: "password123",
        })
        .expect(400);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return current user profile when authenticated", async () => {
      const user = {
        id: 1,
        password: "password",
        role: "ADMIN",
      };

      (userService.findById as jest.Mock).mockResolvedValue(user);

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${generateToken({ id: user.id, role: user.role })}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id", 1);
      expect(response.body.data).toHaveProperty("role", "ADMIN");
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request(app).get("/api/auth/me")
        .set("Authorization", `Bearer testtoken`)
        .expect(401);

      expect(response.body.error).toHaveProperty("message", "Unauthorized");
    });
  });
});
