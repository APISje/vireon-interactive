import { Router, type IRouter } from "express";
import { db, premiumKeysTable, protectedScriptsTable, devScriptsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ADMIN_CODE = "APIP";
const ADMIN_TOKEN = "APIP_ADMIN_SESSION";

function generatePremiumKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VIREON-${segment()}-${segment()}-${segment()}`;
}

router.post("/admin/login", (req, res) => {
  const { code } = req.body;
  if (code !== ADMIN_CODE) {
    res.status(401).json({ error: "Invalid admin code" });
    return;
  }
  res.json({ success: true, token: ADMIN_TOKEN });
});

router.get("/admin/users", async (_req, res) => {
  try {
    const keys = await db.select().from(premiumKeysTable);
    const scripts = await db.select().from(protectedScriptsTable);
    const scriptCounts = scripts.reduce<Record<string, number>>((acc, s) => {
      acc[s.userId] = (acc[s.userId] || 0) + 1;
      return acc;
    }, {});

    const users = keys.map((k) => ({
      id: k.id,
      username: k.username,
      key: k.key,
      expiresAt: k.expiresAt.toISOString(),
      lastLogin: k.lastLogin ? k.lastLogin.toISOString() : null,
      isActive: k.isActive && !k.isBanned && new Date() < k.expiresAt,
      isBanned: k.isBanned,
      scriptCount: scriptCounts[k.id] || 0,
      hwid: k.hwid ?? null,
    }));

    res.json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users/:userId/ban", async (req, res) => {
  try {
    const { userId } = req.params;
    await db.update(premiumKeysTable).set({ isBanned: true }).where(eq(premiumKeysTable.id, userId));
    res.json({ success: true, message: "User banned" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users/:userId/unban", async (req, res) => {
  try {
    const { userId } = req.params;
    await db.update(premiumKeysTable).set({ isBanned: false }).where(eq(premiumKeysTable.id, userId));
    res.json({ success: true, message: "User unbanned" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/keys", async (_req, res) => {
  try {
    const keys = await db.select().from(premiumKeysTable);
    res.json({
      keys: keys.map((k) => ({
        id: k.id,
        key: k.key,
        username: k.username,
        expiresAt: k.expiresAt.toISOString(),
        createdAt: k.createdAt.toISOString(),
        isActive: k.isActive,
        isBanned: k.isBanned,
        hwid: k.hwid ?? null,
        notes: k.notes ?? null,
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/keys", async (req, res) => {
  try {
    const { username, durationDays, notes } = req.body;
    if (!username || !durationDays) {
      res.status(400).json({ error: "username and durationDays are required" });
      return;
    }
    const days = Math.min(Math.max(parseInt(durationDays), 1), 1095);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const id = randomUUID();
    const key = generatePremiumKey();

    const [created] = await db.insert(premiumKeysTable).values({
      id,
      key,
      username,
      expiresAt,
      isActive: true,
      isBanned: false,
      durationDays: days,
      notes: notes || null,
    }).returning();

    res.status(201).json({
      id: created.id,
      key: created.key,
      username: created.username,
      expiresAt: created.expiresAt.toISOString(),
      createdAt: created.createdAt.toISOString(),
      isActive: created.isActive,
      isBanned: created.isBanned,
      hwid: created.hwid ?? null,
      notes: created.notes ?? null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/keys/:keyId/revoke", async (req, res) => {
  try {
    const { keyId } = req.params;
    await db.update(premiumKeysTable).set({ isActive: false }).where(eq(premiumKeysTable.id, keyId));
    res.json({ success: true, message: "Key revoked" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/scripts", async (_req, res) => {
  try {
    const scripts = await db.select().from(protectedScriptsTable);
    res.json({
      scripts: scripts.map((s) => ({
        id: s.id,
        name: s.name,
        scriptUrl: `/api/get?key=USER_KEY&script_id=${s.id}`,
        createdAt: s.createdAt.toISOString(),
        userId: s.userId,
        username: s.username,
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/dev-scripts", async (_req, res) => {
  try {
    const scripts = await db.select().from(devScriptsTable);
    res.json({
      scripts: scripts.map((s) => ({
        id: s.id,
        name: s.name,
        content: s.content,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/dev-scripts", async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      res.status(400).json({ error: "name and content are required" });
      return;
    }
    const id = randomUUID();
    const [created] = await db.insert(devScriptsTable).values({ id, name, content }).returning();
    res.status(201).json({
      id: created.id,
      name: created.name,
      content: created.content,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
