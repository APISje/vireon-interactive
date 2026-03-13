import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const premiumKeysTable = pgTable("premium_keys", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  username: text("username").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  hwid: text("hwid"),
  lastLogin: timestamp("last_login"),
  notes: text("notes"),
  durationDays: integer("duration_days").notNull(),
});

export const insertPremiumKeySchema = createInsertSchema(premiumKeysTable).omit({ createdAt: true, lastLogin: true });
export type InsertPremiumKey = z.infer<typeof insertPremiumKeySchema>;
export type PremiumKey = typeof premiumKeysTable.$inferSelect;
