import { lowStockQueue } from "../lib/queue";
import { notificationService } from "../services/notification.service";

lowStockQueue.process(async (job) => {
  await notificationService.sendLowStockAlert(job.data);
});

lowStockQueue.on("failed", (job, error) => {
  console.error(`Low stock alert job ${job?.id ?? "unknown"} failed:`, error);
});
