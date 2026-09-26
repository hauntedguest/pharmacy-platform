import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0
  );
}

export function getPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    if (!global.prismaGlobal) {
      global.prismaGlobal = new PrismaClient({
        log: ["error", "warn"],
      });
    }
    return global.prismaGlobal;
  }

  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  return global.prismaGlobal;
}

// Proxied export so `prisma` is always resolved dynamically
export const prisma = new Proxy({} as unknown as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    if (!client) {
      return undefined;
    }
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

export default prisma;
