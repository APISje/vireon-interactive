import { Router, type IRouter } from "express";
import { db, premiumKeysTable, protectedScriptsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const BROWSER_PROTECTION_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Vireon Interactive Protected</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      background: #020209;
      color: #00f0ff;
      font-family: 'Courier New', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    canvas#particles {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 2rem;
    }

    .logo {
      font-size: clamp(2rem, 6vw, 4rem);
      font-weight: 900;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      animation: glitch 2.5s infinite;
      text-shadow:
        0 0 10px #00f0ff,
        0 0 30px #00f0ff,
        0 0 60px #0088ff;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      font-size: clamp(0.8rem, 2.5vw, 1.1rem);
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: #0080ff;
      text-shadow: 0 0 8px #0080ff;
      margin-bottom: 2.5rem;
      opacity: 0.85;
    }

    .shield-icon {
      font-size: clamp(4rem, 12vw, 8rem);
      filter: drop-shadow(0 0 20px #00f0ff) drop-shadow(0 0 40px #0060ff);
      animation: pulse-glow 2s ease-in-out infinite;
      margin-bottom: 1.5rem;
      display: block;
    }

    .message {
      font-size: clamp(1rem, 3vw, 1.4rem);
      color: #00f0ff;
      text-shadow: 0 0 10px #00f0ff;
      margin-bottom: 0.75rem;
      letter-spacing: 0.1em;
    }

    .sub-message {
      font-size: clamp(0.7rem, 2vw, 0.9rem);
      color: #0060aa;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .divider {
      width: 300px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #00f0ff, transparent);
      margin: 1.5rem auto;
      box-shadow: 0 0 8px #00f0ff;
    }

    .warning-box {
      border: 1px solid rgba(0,240,255,0.3);
      border-radius: 4px;
      padding: 1rem 2rem;
      margin-top: 2rem;
      background: rgba(0,240,255,0.03);
      box-shadow: 0 0 20px rgba(0,240,255,0.1), inset 0 0 20px rgba(0,240,255,0.03);
      max-width: 500px;
    }

    .warning-title {
      color: #ff4444;
      text-shadow: 0 0 8px #ff2222;
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .warning-text {
      color: #888;
      font-size: 0.75rem;
      line-height: 1.6;
    }

    @keyframes glitch {
      0%, 92%, 100% {
        text-shadow: 0 0 10px #00f0ff, 0 0 30px #00f0ff, 0 0 60px #0088ff;
        transform: translate(0);
      }
      93% {
        text-shadow: -2px 0 #ff0066, 2px 2px #00f0ff;
        transform: translate(-2px, 1px);
      }
      94% {
        text-shadow: 2px -1px #00f0ff, -2px 0 #ff0066;
        transform: translate(2px, -1px);
      }
      95% {
        text-shadow: 0 0 10px #00f0ff, 0 0 30px #00f0ff;
        transform: translate(0);
      }
      96% {
        text-shadow: 1px 0 #ff0066, -1px 0 #00f0ff;
        transform: translate(1px, 0);
      }
    }

    @keyframes pulse-glow {
      0%, 100% { filter: drop-shadow(0 0 20px #00f0ff) drop-shadow(0 0 40px #0060ff); opacity: 1; }
      50% { filter: drop-shadow(0 0 35px #00f0ff) drop-shadow(0 0 70px #0088ff); opacity: 0.85; }
    }

    .scan-line {
      position: fixed;
      top: -100%;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00f0ff44, #00f0ff, #00f0ff44, transparent);
      animation: scan 4s linear infinite;
      z-index: 5;
    }

    @keyframes scan {
      0% { top: -2px; }
      100% { top: 100%; }
    }
  </style>
</head>
<body>
  <canvas id="particles"></canvas>
  <div class="scan-line"></div>

  <div class="container">
    <span class="shield-icon">🛡️</span>
    <div class="logo">VIREON INTERACTIVE</div>
    <div class="subtitle">Script Protection System</div>
    <div class="divider"></div>
    <div class="message">⚡ This script is protected ⚡</div>
    <div class="sub-message">Access restricted to authorized executors only</div>
    <div class="warning-box">
      <div class="warning-title">⛔ Unauthorized Access Detected</div>
      <div class="warning-text">
        This protected script can only be loaded through a Roblox executor.<br/>
        Browser access is not permitted and has been logged.
      </div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 200, 255, ' + p.alpha + ')';
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 150, 255, ' + (0.12 * (1 - dist/100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  </script>
</body>
</html>`;

function isBrowserRequest(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  const browserSignals = [
    "mozilla", "chrome", "safari", "firefox", "edge", "opera",
    "webkit", "gecko", "trident", "msie"
  ];
  const executorSignals = [
    "roblox", "synapse", "krnl", "fluxus", "electron-executor",
    "exploit", "executor", "script-engine", "lua"
  ];

  const hasExecutorSignal = executorSignals.some(s => ua.includes(s));
  if (hasExecutorSignal) return false;

  const hasBrowserSignal = browserSignals.some(s => ua.includes(s));
  return hasBrowserSignal;
}

router.get("/get", async (req, res) => {
  try {
    const userAgent = (req.headers["user-agent"] || "").toString();

    if (isBrowserRequest(userAgent)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(BROWSER_PROTECTION_HTML);
      return;
    }

    const { key, script_id, hwid } = req.query as { key?: string; script_id?: string; hwid?: string };

    if (!key || !script_id) {
      res.setHeader("Content-Type", "text/plain");
      res.status(400).send('error("Missing parameters")');
      return;
    }

    const [keyRecord] = await db.select().from(premiumKeysTable).where(eq(premiumKeysTable.key, key));

    if (!keyRecord) {
      res.setHeader("Content-Type", "text/plain");
      res.status(401).send(`
game:GetService("StarterGui"):SetCore("SendNotification", {
  Title = "VIREON INTERACTIVE";
  Text = "Invalid key. Contact admin.";
  Duration = 5;
})
`);
      return;
    }

    if (keyRecord.isBanned) {
      res.setHeader("Content-Type", "text/plain");
      res.send(`
game:GetService("StarterGui"):SetCore("SendNotification", {
  Title = "VIREON INTERACTIVE";
  Text = "Akun anda di-banned. Hubungi admin.";
  Duration = 5;
})
`);
      return;
    }

    if (!keyRecord.isActive) {
      res.setHeader("Content-Type", "text/plain");
      res.send(`
game:GetService("StarterGui"):SetCore("SendNotification", {
  Title = "VIREON INTERACTIVE";
  Text = "Key anda telah dicabut.";
  Duration = 5;
})
`);
      return;
    }

    if (new Date() > keyRecord.expiresAt) {
      res.setHeader("Content-Type", "text/plain");
      res.send(`
game:GetService("StarterGui"):SetCore("SendNotification", {
  Title = "VIREON INTERACTIVE";
  Text = "TOKEN ANDA HABIS SILAHKAN HUBUNGI DEVELOPMENT/STAFF DISCORD";
  Duration = 8;
})
`);
      return;
    }

    if (hwid && keyRecord.hwid && keyRecord.hwid !== hwid) {
      res.setHeader("Content-Type", "text/plain");
      res.send(`
game:GetService("StarterGui"):SetCore("SendNotification", {
  Title = "VIREON INTERACTIVE";
  Text = "HWID tidak cocok. Key ini terkunci ke device lain.";
  Duration = 5;
})
`);
      return;
    }

    if (hwid && !keyRecord.hwid) {
      await db.update(premiumKeysTable).set({ hwid }).where(eq(premiumKeysTable.id, keyRecord.id));
    }

    const [script] = await db.select().from(protectedScriptsTable).where(
      and(
        eq(protectedScriptsTable.id, script_id),
        eq(protectedScriptsTable.userId, keyRecord.id)
      )
    );

    if (!script) {
      res.setHeader("Content-Type", "text/plain");
      res.send(`
game:GetService("StarterGui"):SetCore("SendNotification", {
  Title = "VIREON INTERACTIVE";
  Text = "Script tidak ditemukan.";
  Duration = 5;
})
`);
      return;
    }

    res.setHeader("Content-Type", "text/plain");
    res.send(script.content);
  } catch (e) {
    console.error(e);
    res.setHeader("Content-Type", "text/plain");
    res.status(500).send('error("Internal server error")');
  }
});

export default router;
