import { Prisma, PrismaClient } from '@prisma/client';

// Neon closes idle connections (and suspends the database when idle), so the
// first query after a quiet spell can land on a dead pooled connection.
// Prisma drops that connection when it fails, so retrying once picks up a
// fresh one.
const RETRYABLE_CODES = new Set([
  'P1001', // Can't reach database server (cold start)
  'P1017', // Server has closed the connection
]);

function isRetryable(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(error.code);
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return error.errorCode === undefined || RETRYABLE_CODES.has(error.errorCode);
  }
  return false;
}

function createPrismaClient() {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
      },
    },
  }).$extends({
    query: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (error) {
          if (!isRetryable(error)) throw error;
          return query(args);
        }
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
