import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../utils/errors/AppError";

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      throw new ForbiddenError("Insufficient permissions");
    }
    next();
  }
}