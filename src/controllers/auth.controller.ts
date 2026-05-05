import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { generateToken } from "../utils/jwt.util";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  return res.json({ success: true, data: { token: generateToken({ id: user.id, email: user.email }), user: user } });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const findUser = await userService.findByEmail(email);
  if (findUser) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  const user = await userService.create({ email, password, name });
  return res
    .status(201)
    .json({ success: true, data: { token: generateToken({ id: user.id, email: user.email }), user: user } });
};
