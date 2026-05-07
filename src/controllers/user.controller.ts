import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { userService } from "../services/user.service";
import { withLocalTime } from "../utils/date.util";
import { ConflictError } from "../utils/errors/AppError";

export const store = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const findUser = await userService.findByEmail(email);
  if (findUser) {
    throw new ConflictError("Email already exists");
  }

  const user = await userService.create({ name, email, password, role });
  return res.status(201).json({ success: true, data: withLocalTime(user) });
});
