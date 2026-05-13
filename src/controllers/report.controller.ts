import { asyncHandler } from "../utils/async-handler"
import { reportService } from "../services/report.service"
import { Request, Response } from "express";

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await reportService.getDashboard();

  res.json({ success: true, data: dashboard })
})

export const lowStock = asyncHandler(async (req: Request, res: Response) => {
  const lowStock = await reportService.getLowStock(req);
  res.json({ success: true, data: lowStock })
})

export const exportStock = asyncHandler(async (_req: Request, res: Response) => {
  await reportService.exportStockExcel(res)
})

export const exportTransactions = asyncHandler(async (_req: Request, res: Response) => {
  await reportService.exportTransactionExcel(res)
})
