import ExcelJS from 'exceljs';
import { Response } from 'express';

/**
 * Excel Utility helper for generating Excel files
 */
export class ExcelUtil {
  /**
   * Generates an Excel file and sends it to the response
   * 
   * @param {Response} res - Express response object
   * @param {string} fileName - Name of the file to be downloaded
   * @param {string} sheetName - Name of the worksheet
   * @param {any[]} columns - Column headers definition
   * @param {any[]} data - Rows of data to be added
   */
  static async exportToExcel(
    res: Response,
    fileName: string,
    sheetName: string,
    columns: Partial<ExcelJS.Column>[],
    data: any[]
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;
    worksheet.addRows(data);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
