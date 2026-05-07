import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { generateToken } from "../utils/jwt.util";
import { UnauthorizedError } from "../utils/errors/AppError";
import { asyncHandler } from "../utils/async-handler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await userService.comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = generateToken({ id: user.id, role: user.role });
  return res.json({
    success: true,
    data: { token: token, user: user },
  });
});
