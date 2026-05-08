import { Request, Response } from "express"
import { asyncHandler } from "../utils/async-handler";
import { categoryService } from "../services/category.service";
import { withLocalTime } from "../utils/date.util";
import { NotFoundError } from "../utils/errors/AppError";

export const index = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAll();
  res.json({ success: true, data: withLocalTime(categories) });
})

export const show = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getById(Number(req.params.id));

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  res.json({ success: true, data: withLocalTime(category) });
})

export const store = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body);

  res.status(201).json({ success: true, data: withLocalTime(category) });
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.update(Number(req.params.id), req.body);

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  res.status(200).json({ success: true, data: withLocalTime(category) });
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.delete(Number(req.params.id));

  res.status(200).json({ success: true, message: "Delete success" })
})

