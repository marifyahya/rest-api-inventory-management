import { Request, Response } from "express";
import { productService } from "../services/product.service";

export const index = async (_req: Request, res: Response) => {
  const products = await productService.getAll();
  res.json({ success: true, data: products });
};

export const show = async (req: Request, res: Response) => {
  const product = await productService.getById(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: product });
};

export const store = async (req: Request, res: Response) => {
  const product = await productService.create(req.body);
  res.status(201).json({ success: true, data: product });
};
