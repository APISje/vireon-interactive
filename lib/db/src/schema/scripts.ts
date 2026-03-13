import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const protectedScriptsTable = pgTable("protected_scripts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const devScriptsTable = pgTable("dev_scripts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProtectedScriptSchema = createInsertSchema(protectedScriptsTable).omit({ createdAt: true });
export type InsertProtectedScript = z.infer<typeof insertProtectedScriptSchema>;
export type ProtectedScript = typeof protectedScriptsTable.$inferSelect;

export const insertDevScriptSchema = createInsertSchema(devScriptsTable).omit({ createdAt: true });
export type InsertDevScript = z.infer<typeof insertDevScriptSchema>;
export type DevScript = typeof devScriptsTable.$inferSelect;
