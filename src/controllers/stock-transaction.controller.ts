import { Request, Response } from "express";
import { stockTransactionService } from "../services/stock-transaction.service";
import { asyncHandler } from "../utils/async-handler";

export const index = asyncHandler(async (req: Request, res: Response) => {
  const result = await stockTransactionService.getAll(req);

  return res.status(200).json({
    success: true,
    ...result,
  });
});

export const stockIn = asyncHandler(async (req: Request, res: Response) => {
  const result = await stockTransactionService.stockIn(req.body, req.user!.id);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const stockOut = asyncHandler(async (req: Request, res: Response) => {
  const result = await stockTransactionService.stockOut(req.body, req.user!.id);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const result = await stockTransactionService.getById(Number(req.params.id));

  return res.status(200).json({
    success: true,
    data: result,
  });
});
