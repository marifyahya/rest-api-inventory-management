import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { withLocalTime } from "../utils/date.util";
import { NotFoundError } from "../utils/errors/AppError";
import { asyncHandler } from "../utils/async-handler";

export const index = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await productService.getAll(req);
  res.json({ success: true, data: withLocalTime(data), meta });
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getById(Number(req.params.id));
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  res.json({ success: true, data: withLocalTime(product) });
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.create(req.body);
  res.status(201).json({ success: true, data: withLocalTime(product) });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.update(Number(req.params.id), req.body);
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  res.status(200).json({ success: true, data: withLocalTime(product) });
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getById(Number(req.params.id));
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  await productService.delete(Number(req.params.id));
  res.status(200).json({ success: true, message: "Product deleted successfully" });
});
