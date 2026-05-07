import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { NotFoundError } from "../utils/errors/AppError";

class UserService {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(payload: { email: string; password: string; name: string; role: string }) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    return prisma.user.create({
      data: { ...payload, password: hashedPassword },
    });
  }

  findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}

export const userService = new UserService();
