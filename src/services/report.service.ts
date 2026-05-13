import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { paginate, paginationMeta } from "../utils/pagination.util";
import { ExcelUtil } from "../utils/excel.util";
import ExcelJS from 'exceljs';

class ReportService {
  async getDashboard() {
    const [
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalStockValue,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.supplier.count(),
      prisma.$queryRaw`SELECT SUM(stock * price) as total FROM products`,
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        include: {
          category: true,
          supplier: true,
        },
        take: 5
      })
    ]);

    const totalValueResult = totalStockValue as { total: number }[];
    const totalValue = totalValueResult[0]?.total || 0;

    return {
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalStockValue: totalValue,
      lowStockProducts,
    }
  }

  async getLowStock(req: Request) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { skip, take } = paginate(page, limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          stock: { lte: 10 },
        },
        skip,
        take,
        include: {
          category: true,
          supplier: true,
        },
      }),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
    ]);

    const meta = paginationMeta(total, page, limit);

    return {
      data: products,
      meta,
    };
  }

  async getStockByCategory() {
    const products = await prisma.product.groupBy({
      by: ['categoryId'],
      _sum: { stock: true, price: true },
    });

    return products;
  }

  async exportStockExcel(res: Response) {
    const columns = [
      { header: "No", key: "no", width: 10 },
      { header: "SKU", key: "sku", width: 10 },
      { header: "Name", key: "name", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "Supplier", key: "supplier", width: 15 },
      { header: "Stock", key: "stock", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Stock Value", key: "stockValue", width: 15 },
    ];

    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });

    const data = products.map((product, index) => ({
      no: index + 1,
      sku: product.sku,
      name: product.name,
      category: product.category.name,
      supplier: product.supplier?.name || "-",
      stock: product.stock,
      price: product.price,
      stockValue: product.stock * product.price,
    }));

    return await ExcelUtil.exportToExcel(res, "stock-report", "Stock Report", columns, data);
  }

  async exportTransactionExcel(res: Response) {
    const columns = [
      { header: "No", key: "no", width: 10 },
      { header: "Date", key: "date", width: 25 },
      { header: "SKU", key: "sku", width: 15 },
      { header: "Product", key: "name", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "Supplier", key: "supplier", width: 15 },
      { header: "Type", key: "type", width: 10 },
      { header: "Quantity", key: "stock", width: 10 },
      { header: "Price", key: "price", width: 12 },
      { header: "Stock Value", key: "stockValue", width: 15 },
      { header: "Note", key: "note", width: 30 },
    ];

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=transaction-report.xlsx'
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res
    });

    const worksheet = workbook.addWorksheet('Transactions');
    worksheet.columns = columns;

    const transactions = await prisma.stockTransaction.findMany({
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          }
        },
        user: true,
      },
    });

    transactions.forEach((transaction, index) => {
      worksheet.addRow({
        no: index + 1,
        date: transaction.createdAt.toLocaleString(),
        sku: transaction.product.sku,
        name: transaction.product.name,
        category: transaction.product.category.name,
        supplier: transaction.product.supplier?.name || "-",
        stock: transaction.quantity,
        price: transaction.product.price,
        stockValue: transaction.quantity * transaction.product.price,
        note: transaction.note || "-",
      }).commit();
    });

    await worksheet.commit();
    await workbook.commit();
  }
}

export const reportService = new ReportService();