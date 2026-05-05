import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { withLocalTime } from "../utils/date.util";

export const index = async (_req: Request, res: Response) => {
  const products = await productService.getAll();
  res.json({ success: true, data: withLocalTime(products) });
};

export const show = async (req: Request, res: Response) => {
  const product = await productService.getById(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: withLocalTime(product) });
};

export const store = async (req: Request, res: Response) => {
  const product = await productService.create(req.body);
  res.status(201).json({ success: true, data: withLocalTime(product) });
};

export const update = async (req: Request, res: Response) => {
  const product = await productService.update(Number(req.params.id), req.body);
  res.status(200).json({ success: true, data: withLocalTime(product) });
};

export const destroy = async (req: Request, res: Response) => {
  const product = await productService.getById(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  await productService.delete(Number(req.params.id));
  res.status(200).json({ success: true, message: "Product deleted successfully" });
};
