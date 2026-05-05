import prisma from "../lib/prisma";

class UserService {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  create(payload: { email: string; password: string; name: string }) {
    return prisma.user.create({
      data: payload,
    });
  }
}

export const userService = new UserService();
