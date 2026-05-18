import nodemailer from "nodemailer";
import { LowStockAlertJobData } from "../lib/queue";

class NotificationService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  async sendLowStockAlert(product: LowStockAlertJobData) {
    const recipient = process.env.ALERT_EMAIL_TO;

    if (!recipient) {
      console.warn("Low stock alert skipped: ALERT_EMAIL_TO is not configured");
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "inventory-alerts@example.com",
      to: recipient,
      subject: `Low stock alert: ${product.productName}`,
      text: [
        `Product ${product.productName} (${product.sku}) is low on stock.`,
        `Current stock: ${product.currentStock}`,
        `Minimum stock: ${product.minStock}`,
        `Product ID: ${product.productId}`,
      ].join("\n"),
    });
  }
}

export const notificationService = new NotificationService();
