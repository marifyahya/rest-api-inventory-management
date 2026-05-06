import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { generateToken } from "../utils/jwt.util";
import { UnauthorizedError, ConflictError } from "../utils/errors/AppError";
import { asyncHandler } from "../utils/async-handler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (user.password !== password) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return res.json({
    success: true,
    data: { token: generateToken({ id: user.id }), user: user },
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const findUser = await userService.findByEmail(email);
  if (findUser) {
    throw new ConflictError("Email already exists");
  }

  const user = await userService.create({ email, password, name });
  return res.status(201).json({
    success: true,
    data: { token: generateToken({ id: user.id }), user: user },
  });
});
