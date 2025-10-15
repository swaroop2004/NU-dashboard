import { PrismaClient } from "../../generated/prisma"; // adjust relative path
// or if inside /app or /src, it may be: "../../../generated/prisma"

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
