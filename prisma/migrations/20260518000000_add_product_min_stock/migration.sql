-- Add min stock threshold used by low stock notifications.
ALTER TABLE "products" ADD COLUMN "minStock" INTEGER NOT NULL DEFAULT 10;
