import { faker } from "@faker-js/faker";
import { NextFunction, Request, Response } from "express";
import * as userController from "../../../controllers/user.controller";
import { userService } from "../../../services/user.service";
import { createMockReqRes } from "../../utils/mock-factory";
import { ConflictError } from "../../../utils/errors/AppError";

jest.mock("../../../services/user.service", () => ({
  userService: {
    findByEmail: jest.fn(),
    create: jest.fn(),
  },
}));

describe("UserController", () => {
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

  describe("store", () => {
    it("should create new user", async () => {
      const newUser = { name: faker.name.fullName(), email: faker.internet.email(), password: faker.internet.password(), role: "ADMIN" };
      mockRequest.body = newUser;

      (userService.create as jest.Mock).mockResolvedValue({
        id: 3,
        ...newUser,
      });

      await userController.store(mockRequest, mockResponse, mockNext);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { id: 3, ...newUser },
      });
    });

    it("should call next with ConflictError when email already exists", async () => {
      const newUser = { name: faker.name.fullName(), email: faker.internet.email(), password: faker.internet.password(), role: "ADMIN" };
      mockRequest.body = newUser;

      // Mock findByEmail to return an existing user (simulating duplication)
      (userService.findByEmail as jest.Mock).mockResolvedValue({ id: 1, ...newUser });

      await userController.store(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ConflictError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe("Email already exists");
      expect(error.statusCode).toBe(409);
    });
  });
});