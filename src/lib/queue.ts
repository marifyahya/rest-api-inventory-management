import Queue from "bull";

export type LowStockAlertJobData = {
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
};

type QueueLike = {
  add(data: LowStockAlertJobData): Promise<unknown>;
  process(handler: (job: Queue.Job<LowStockAlertJobData>) => Promise<void>): void;
  on(event: "failed", handler: (job: Queue.Job<LowStockAlertJobData> | undefined, error: Error) => void): QueueLike;
};

const isTest = process.env.NODE_ENV === "test";

const testQueue: QueueLike = {
  add: async () => ({ id: "test-low-stock-alert" }),
  process: () => undefined,
  on: () => testQueue,
};

export const lowStockQueue: QueueLike = isTest
  ? testQueue
  : new Queue<LowStockAlertJobData>("low-stock-alert", {
      redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
