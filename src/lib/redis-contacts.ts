import { Redis } from "@upstash/redis";
import type { ContactRow } from "@/lib/contact-types";

const LIST_KEY = "contacts:v1";

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function getRedis(): Redis | null {
  if (!isRedisConfigured()) {
    return null;
  }
  return Redis.fromEnv();
}

export async function insertContactRedis(
  name: string,
  phone: string,
): Promise<string> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis is not configured");
  }
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const row: ContactRow = { id, name, phone, created_at };
  await redis.lpush(LIST_KEY, JSON.stringify(row));
  return id;
}

export async function listContactsRedis(): Promise<ContactRow[]> {
  const redis = getRedis();
  if (!redis) {
    return [];
  }
  const raw = await redis.lrange(LIST_KEY, 0, -1);
  const items: ContactRow[] = [];
  for (const item of raw) {
    if (typeof item !== "string") {
      continue;
    }
    try {
      items.push(JSON.parse(item) as ContactRow);
    } catch {
      /* skip corrupt entries */
    }
  }
  return items;
}
