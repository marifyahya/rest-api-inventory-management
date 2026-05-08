import { Request, Response } from "express";
import { supplierService } from "../services/supplier.service";
import { asyncHandler } from "../utils/async-handler";
import { withLocalTime } from "../utils/date.util";

export const index = asyncHandler(async (_req: Request, res: Response) => {
  const suppliers = await supplierService.getAll();
  res.json({ success: true, data: withLocalTime(suppliers) });
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await supplierService.findById(Number(req.params.id));
  res.json({ success: true, data: withLocalTime(supplier) });
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await supplierService.create(req.body);
  res.status(201).json({ success: true, data: withLocalTime(supplier) });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await supplierService.update(Number(req.params.id), req.body);
  res.status(200).json({ success: true, data: withLocalTime(supplier) });
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await supplierService.delete(Number(req.params.id));
  res.status(200).json({ success: true, message: "Supplier deleted successfully" });
});
