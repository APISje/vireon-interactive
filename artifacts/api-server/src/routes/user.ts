import { Router, type IRouter } from "express";
import { db, premiumKeysTable, protectedScriptsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.post("/user/login", async (req, res) => {
  try {
    const { key, hwid } = req.body;
    if (!key) {
      res.status(400).json({ error: "key is required" });
      return;
    }

    const [record] = await db.select().from(premiumKeysTable).where(eq(premiumKeysTable.key, key));

    if (!record) {
      res.status(401).json({ error: "Invalid key" });
      return;
    }

    if (record.isBanned) {
      res.status(401).json({ error: "Your key has been banned. Contact admin." });
      return;
    }

    if (!record.isActive) {
      res.status(401).json({ error: "Key has been revoked" });
      return;
    }

    if (new Date() > record.expiresAt) {
      res.status(401).json({ error: "TOKEN ANDA HABIS SILAHKAN HUBUNGI DEVELOPMENT/STAFF DISCORD" });
      return;
    }

    if (hwid && record.hwid && record.hwid !== hwid) {
      res.status(401).json({ error: "HWID mismatch. This key is locked to another device." });
      return;
    }

    const updates: Partial<typeof record> = { lastLogin: new Date() };
    if (hwid && !record.hwid) {
      updates.hwid = hwid;
    }

    await db.update(premiumKeysTable).set(updates).where(eq(premiumKeysTable.id, record.id));

    res.json({
      success: true,
      userId: record.id,
      key: record.key,
      expiresAt: record.expiresAt.toISOString(),
      username: record.username,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/scripts", async (req, res) => {
  try {
    const userKey = req.headers["x-user-key"] as string;
    if (!userKey) {
      res.status(401).json({ error: "Missing x-user-key header" });
      return;
    }

    const [keyRecord] = await db.select().from(premiumKeysTable).where(eq(premiumKeysTable.key, userKey));
    if (!keyRecord || keyRecord.isBanned || !keyRecord.isActive || new Date() > keyRecord.expiresAt) {
      res.status(401).json({ error: "Invalid or expired key" });
      return;
    }

    const scripts = await db.select().from(protectedScriptsTable).where(eq(protectedScriptsTable.userId, keyRecord.id));

    res.json({
      scripts: scripts.map((s) => ({
        id: s.id,
        name: s.name,
        scriptUrl: `/api/get?key=${userKey}&script_id=${s.id}`,
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

router.post("/user/scripts", async (req, res) => {
  try {
    const userKey = req.headers["x-user-key"] as string;
    if (!userKey) {
      res.status(401).json({ error: "Missing x-user-key header" });
      return;
    }

    const [keyRecord] = await db.select().from(premiumKeysTable).where(eq(premiumKeysTable.key, userKey));
    if (!keyRecord || keyRecord.isBanned || !keyRecord.isActive || new Date() > keyRecord.expiresAt) {
      res.status(401).json({ error: "Invalid or expired key" });
      return;
    }

    const { name, content } = req.body;
    if (!name || !content) {
      res.status(400).json({ error: "name and content are required" });
      return;
    }

    const id = randomUUID();
    const [created] = await db.insert(protectedScriptsTable).values({
      id,
      name,
      content,
      userId: keyRecord.id,
      username: keyRecord.username,
    }).returning();

    const host = req.headers.host || "localhost";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${proto}://${host}`;
    const scriptUrl = `${baseUrl}/api/get?key=${userKey}&script_id=${created.id}`;
    const loadstringCode = `script_key="${userKey}"; loadstring(game:HttpGet("${scriptUrl}"))()`;

    res.status(201).json({
      id: created.id,
      name: created.name,
      scriptUrl,
      loadstringCode,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/scripts/:scriptId", async (req, res) => {
  try {
    const userKey = req.headers["x-user-key"] as string;
    if (!userKey) {
      res.status(401).json({ error: "Missing x-user-key header" });
      return;
    }

    const [keyRecord] = await db.select().from(premiumKeysTable).where(eq(premiumKeysTable.key, userKey));
    if (!keyRecord || keyRecord.isBanned || !keyRecord.isActive || new Date() > keyRecord.expiresAt) {
      res.status(401).json({ error: "Invalid or expired key" });
      return;
    }

    const { scriptId } = req.params;
    await db.delete(protectedScriptsTable).where(
      and(
        eq(protectedScriptsTable.id, scriptId),
        eq(protectedScriptsTable.userId, keyRecord.id)
      )
    );

    res.json({ success: true, message: "Script deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
