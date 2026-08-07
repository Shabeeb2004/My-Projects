const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// ═══════════════════════════════════════════════════
//  GMAIL TRANSPORTER
// ═══════════════════════════════════════════════════
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "helloshabeeb@gmail.com",
    pass: "lrph rumh nbnj rzzn",
  },
  // These settings help with deliverability
  pool: true,
  maxConnections: 5,
  rateDelta: 1000,
  rateLimit: 5,
});

// ═══════════════════════════════════════════════════
//  PSL 2026 — FULL MATCH SCHEDULE (PKT = UTC+5)
// ═══════════════════════════════════════════════════
const TEAMS = {
  LQ: "Lahore Qalandars",
  KK: "Karachi Kings",
  PZ: "Peshawar Zalmi",
  QG: "Quetta Gladiators",
  RP: "Rawalpindi",
  IU: "Islamabad United",
  MS: "Multan Sultans",
  HK: "Hyderabad Kingsmen",
};

const MATCHES = [
  // ── Week 1 ──
  {id: 1,  date: "March 26 2026",  time: "19:00", t1: "LQ", t2: "HK", venue: "Lahore"},
  {id: 2,  date: "March 27 2026",  time: "19:00", t1: "QG", t2: "KK", venue: "Lahore"},
  {id: 3,  date: "March 28 2026",  time: "14:30", t1: "MS", t2: "IU", venue: "Lahore"},
  {id: 4,  date: "March 28 2026",  time: "19:00", t1: "PZ", t2: "RP", venue: "Lahore"},
  {id: 5,  date: "March 29 2026",  time: "14:30", t1: "QG", t2: "HK", venue: "Lahore"},
  {id: 6,  date: "March 29 2026",  time: "19:00", t1: "LQ", t2: "KK", venue: "Lahore"},
  // ── Week 2 ──
  {id: 7,  date: "March 31 2026",  time: "19:00", t1: "IU", t2: "PZ", venue: "Lahore"},
  {id: 8,  date: "April 1 2026",   time: "19:00", t1: "MS", t2: "HK", venue: "Lahore"},
  {id: 9,  date: "April 2 2026",   time: "14:30", t1: "QG", t2: "IU", venue: "Lahore"},
  {id: 10, date: "April 2 2026",   time: "19:00", t1: "RP", t2: "KK", venue: "Lahore"},
  {id: 11, date: "April 3 2026",   time: "19:00", t1: "LQ", t2: "MS", venue: "Lahore"},
  {id: 12, date: "April 4 2026",   time: "19:00", t1: "RP", t2: "IU", venue: "Lahore"},
  {id: 13, date: "April 5 2026",   time: "19:00", t1: "QG", t2: "MS", venue: "Lahore"},
  {id: 14, date: "April 6 2026",   time: "19:00", t1: "MS", t2: "RP", venue: "Lahore"},
  // ── Week 3 — Karachi ──
  {id: 15, date: "April 8 2026",   time: "19:00", t1: "HK", t2: "PZ", venue: "Karachi"},
  {id: 16, date: "April 9 2026",   time: "14:30", t1: "LQ", t2: "IU", venue: "Karachi"},
  {id: 17, date: "April 9 2026",   time: "19:00", t1: "KK", t2: "PZ", venue: "Karachi"},
  {id: 18, date: "April 10 2026",  time: "19:00", t1: "QG", t2: "RP", venue: "Karachi"},
  {id: 19, date: "April 11 2026",  time: "14:30", t1: "PZ", t2: "LQ", venue: "Karachi"},
  {id: 20, date: "April 11 2026",  time: "19:00", t1: "KK", t2: "HK", venue: "Karachi"},
  {id: 21, date: "April 12 2026",  time: "19:00", t1: "HK", t2: "IU", venue: "Karachi"},
  {id: 22, date: "April 13 2026",  time: "19:00", t1: "PZ", t2: "MS", venue: "Karachi"},
  // ── Week 4 ──
  {id: 23, date: "April 15 2026",  time: "19:00", t1: "PZ", t2: "QG", venue: "Karachi"},
  {id: 24, date: "April 16 2026",  time: "14:30", t1: "HK", t2: "RP", venue: "Karachi"},
  {id: 25, date: "April 16 2026",  time: "19:00", t1: "KK", t2: "IU", venue: "Karachi"},
  {id: 26, date: "April 17 2026",  time: "19:00", t1: "LQ", t2: "QG", venue: "Karachi"},
  {id: 27, date: "April 18 2026",  time: "19:00", t1: "LQ", t2: "RP", venue: "Karachi"},
  {id: 28, date: "April 19 2026",  time: "14:30", t1: "KK", t2: "MS", venue: "Karachi"},
  {id: 29, date: "April 19 2026",  time: "19:00", t1: "PZ", t2: "QG", venue: "Karachi"},
  // ── Week 5 ──
  {id: 30, date: "April 21 2026",  time: "14:30", t1: "LQ", t2: "QG", venue: "Lahore"},
  {id: 31, date: "April 21 2026",  time: "19:00", t1: "RP", t2: "MS", venue: "Karachi"},
  {id: 32, date: "April 22 2026",  time: "14:30", t1: "KK", t2: "PZ", venue: "Lahore"},
  {id: 33, date: "April 22 2026",  time: "19:00", t1: "HK", t2: "MS", venue: "Karachi"},
  {id: 34, date: "April 23 2026",  time: "14:30", t1: "RP", t2: "IU", venue: "Karachi"},
  {id: 35, date: "April 23 2026",  time: "19:00", t1: "LQ", t2: "KK", venue: "Lahore"},
  {id: 36, date: "April 24 2026",  time: "19:00", t1: "HK", t2: "IU", venue: "Karachi"},
  {id: 37, date: "April 25 2026",  time: "14:30", t1: "QG", t2: "KK", venue: "Lahore"},
  {id: 38, date: "April 25 2026",  time: "19:00", t1: "LQ", t2: "PZ", venue: "Lahore"},
  {id: 39, date: "April 26 2026",  time: "14:30", t1: "HK", t2: "RP", venue: "Karachi"},
  {id: 40, date: "April 26 2026",  time: "19:00", t1: "IU", t2: "MS", venue: "Karachi"},
  // ── Playoffs ──
  {id: 41, date: "April 28 2026",  time: "19:00", t1: "TBD", t2: "TBD", venue: "Karachi", label: "QUALIFIER"},
  {id: 42, date: "April 29 2026",  time: "19:00", t1: "TBD", t2: "TBD", venue: "Lahore",  label: "ELIMINATOR 1"},
  {id: 43, date: "May 1 2026",     time: "19:00", t1: "TBD", t2: "TBD", venue: "Lahore",  label: "ELIMINATOR 2"},
  {id: 44, date: "May 3 2026",     time: "19:00", t1: "TBD", t2: "TBD", venue: "Lahore",  label: "FINAL"},
];

// ═══════════════════════════════════════════════════
//  HELPER — Convert match date+time (PKT) to UTC ms
// ═══════════════════════════════════════════════════
function matchKickoffUTC(match) {
  const pkt = new Date(`${match.date} ${match.time}:00 UTC`);
  return pkt.getTime() - (5 * 60 * 60 * 1000);
}

// ═══════════════════════════════════════════════════
//  HELPER — Build HTML email body (anti-spam optimised)
// ═══════════════════════════════════════════════════
function buildEmailHtml(username, match, hasPredicted, predictUrl) {
  const t1Name = TEAMS[match.t1] || match.t1;
  const t2Name = TEAMS[match.t2] || match.t2;
  const matchLabel = match.label || `${t1Name} vs ${t2Name}`;

  const statusBlock = hasPredicted
    ? `<div class="status status-ok">
        &#x2705; You have a prediction for this match &mdash; but you can still change it before it locks!<br/>
        <span style="font-size:12px;opacity:.8;">Predictions lock the moment the match starts. Update your pick now if needed.</span>
       </div>
       <a class="cta" style="background:#1e3326;color:#00e676;border:1px solid #00e676;" href="${predictUrl}">REVIEW &amp; CHANGE YOUR PICK &#x2192;</a>`
    : `<div class="status status-warn">
        &#x26A0;&#xFE0F; You have NOT predicted this match &mdash; only 30 minutes left!<br/>
        <span style="font-size:12px;opacity:.8;">Predict now before the match starts and predictions lock.</span>
       </div>
       <a class="cta" href="${predictUrl}">PREDICT NOW &#x2192;</a>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>PSL 2026 Match Reminder</title>
  <style>
    body { margin:0;padding:0;background:#04090a;font-family:Arial,sans-serif;color:#dff0e5; }
    .wrap { max-width:560px;margin:0 auto;padding:32px 20px; }
    .card { background:#111f16;border:1px solid #1e3326;border-radius:12px;overflow:hidden; }
    .head { background:#182c1e;padding:28px 28px 20px;text-align:center;border-bottom:1px solid #1e3326; }
    .badge { display:inline-block;background:#00e676;color:#000;font-size:13px;font-weight:700;
             letter-spacing:2px;padding:4px 14px;border-radius:4px;margin-bottom:14px; }
    .head h1 { margin:0;font-size:26px;letter-spacing:2px;color:#dff0e5; }
    .head .sub { color:#6b917a;font-size:13px;margin-top:6px; }
    .body { padding:28px; }
    .match-box { background:#0b1610;border:1px solid #2a4535;border-radius:8px;padding:18px 20px;
                 margin:18px 0;text-align:center; }
    .match-vs { font-size:12px;color:#6b917a;letter-spacing:2px;margin-bottom:8px;text-transform:uppercase; }
    .match-title { font-size:22px;font-weight:700;color:#dff0e5;margin-bottom:10px; }
    .match-meta { font-size:13px;color:#6b917a;margin:4px 0; }
    .toss-badge { display:inline-block;background:rgba(255,196,0,.15);border:1px solid rgba(255,196,0,.4);
                  color:#ffc400;font-size:12px;font-weight:700;padding:4px 12px;
                  border-radius:20px;margin-bottom:8px;letter-spacing:1px; }
    .status { margin:20px 0;padding:14px 18px;border-radius:8px;font-size:14px;font-weight:600;line-height:1.5; }
    .status-ok   { background:rgba(0,230,118,.08);border:1px solid rgba(0,230,118,.25);color:#00e676; }
    .status-warn { background:rgba(255,196,0,.1);border:1px solid rgba(255,196,0,.3);color:#ffc400; }
    .cta { display:block;text-align:center;background:#00e676;color:#000;font-weight:700;
           font-size:15px;letter-spacing:1px;padding:14px 28px;border-radius:8px;
           text-decoration:none;margin:16px 0; }
    .lock-note { font-size:12px;color:#3d5a46;text-align:center;margin-top:4px; }
    .foot { text-align:center;color:#3d5a46;font-size:11px;padding:16px 28px;border-top:1px solid #1e3326; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="badge">PSL 2026</div>
        <h1>&#x1f3cf; Match Starts in 30 Mins!</h1>
        <div class="sub">Lock in your prediction now before it&apos;s too late</div>
      </div>
      <div class="body">
        <p style="color:#6b917a;font-size:14px;margin-top:0;">Hey <strong style="color:#dff0e5;">${username}</strong>,</p>

        <div class="match-box">
          <div class="toss-badge">&#x1f3af; 30 Minutes to Go</div>
          <div class="match-vs">Match Day</div>
          <div class="match-title">${matchLabel}</div>
          <div class="match-meta">&#x1F4C5; ${match.date} &nbsp;&#x2022;&nbsp; ${match.time} PKT</div>
          <div class="match-meta">&#x1F4CD; ${match.venue}</div>
        </div>

        ${statusBlock}

        <p class="lock-note">&#x1F512; Predictions lock the moment the match begins.</p>

        <p style="font-size:13px;color:#6b917a;margin-top:20px;">
          Every correct pick earns you points on the leaderboard. Make it count!
        </p>
      </div>
      <div class="foot">
        PSL 2026 Predictor &bull; Automated match reminder<br/>
        <a href="${predictUrl}" style="color:#3d5a46;">Visit PSL 2026 Predictor</a> &bull;
        You received this because you registered for PSL 2026 Predictor.
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════
//  CLOUD FUNCTION — runs every 5 minutes
//  Checks if any match is 25–35 min away (PKT).
//  Sends emails, marks sent in DB to prevent duplicates.
// ═══════════════════════════════════════════════════
exports.sendMatchReminders = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "Asia/Karachi",
    timeoutSeconds: 300,   // 5 min max runtime
    memory: "256MiB",      // minimal footprint
    maxInstances: 1,       // CRITICAL: prevents multiple revisions competing
    region: "us-central1",
  },
  async (event) => {
    const db = admin.database();
    const nowMs = Date.now();

    // Window: 25 to 35 minutes before match starts (30-min reminder)
    const WINDOW_MIN = 25 * 60 * 1000;
    const WINDOW_MAX = 35 * 60 * 1000;

    for (const match of MATCHES) {
      const kickoffMs = matchKickoffUTC(match);
      const diff = kickoffMs - nowMs;

      // Skip if not in reminder window
      if (diff < WINDOW_MIN || diff > WINDOW_MAX) continue;

      const matchKey = `match_${match.id}`;

      // Check if reminder already sent for this match
      const sentSnap = await db.ref(`remindersSent/${matchKey}`).once("value");
      if (sentSnap.exists()) {
        console.log(`Reminder already sent for match ${match.id} — skipping.`);
        continue;
      }

      // Load all users
      const usersSnap = await db.ref("users").once("value");
      const users = usersSnap.val() || {};

      const t1Name = TEAMS[match.t1] || match.t1;
      const t2Name = TEAMS[match.t2] || match.t2;
      const matchLabel = match.label || `${t1Name} vs ${t2Name}`;
      const predictUrl = "https://psl-rose.vercel.app/predict.html";

      let sent = 0;
      let failed = 0;

      console.log(`Sending reminders for Match ${match.id}: ${matchLabel}`);

      for (const uid of Object.keys(users)) {
        const u = users[uid];
        if (!u.email) continue;

        const hasPredicted = !!(u.predictions && u.predictions[String(match.id)]);

        const mailOptions = {
          from: {
            name: "PSL 2026 Predictor",
            address: "helloshabeeb@gmail.com",
          },
          to: u.email,
          replyTo: "helloshabeeb@gmail.com",  // same as sender — improves deliverability
          subject: `\ud83c\udfd1 Match in 30 mins: ${matchLabel} \u2014 ${hasPredicted ? "Review your pick!" : "Last chance to predict!"}`,
          html: buildEmailHtml(u.username || uid, match, hasPredicted, predictUrl),
          // Anti-spam headers
          headers: {
            "X-Mailer": "PSL2026-Predictor/1.0",
            "X-Priority": "3",
            "Precedence": "bulk",
            "List-Unsubscribe": `<mailto:helloshabeeb@gmail.com?subject=Unsubscribe>`,
          },
          // Plain-text version helps deliverability
          text: `PSL 2026 Predictor - Match Reminder\n\nHey ${u.username || uid},\n\nMatch starting in 30 minutes: ${matchLabel}\nDate: ${match.date} at ${match.time} PKT\nVenue: ${match.venue}\n\n${hasPredicted ? "You have a prediction for this match. You can still update it before the match starts." : "You have NOT predicted this match yet! Hurry and predict before the match starts."}\n\nPredict now: ${predictUrl}\n\nPredictions lock the moment the match begins.\n`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`  \u2713 Sent to ${u.email}`);
          sent++;
        } catch (err) {
          console.error(`  \u2717 Failed for ${u.email}:`, err.message);
          failed++;
        }

        // Small delay between emails to avoid Gmail rate limits
        await new Promise((r) => setTimeout(r, 300));
      }

      // Mark this match reminder as sent so it won't fire again
      await db.ref(`remindersSent/${matchKey}`).set({
        sentAt: new Date().toISOString(),
        matchId: match.id,
        matchLabel,
        sent,
        failed,
      });

      console.log(`Match ${match.id} done — ${sent} sent, ${failed} failed.`);
    }
  });

// ═══════════════════════════════════════════════════
//  PLAYOFF EMAIL BUILDER
//  Used for both the 24h and 30-min playoff reminders.
//  Makes clear that ALL 4 picks lock at Qualifier time.
// ═══════════════════════════════════════════════════
function buildPlayoffEmailHtml(username, triggerType, hasSubmitted, playoffUrl) {
  // triggerType: '24h' or '30min'
  const lockStr   = "April 28, 2026 at 7:00 PM PKT";
  const urgency   = triggerType === '30min'
    ? '⚠️ <strong>30 MINUTES LEFT</strong> — Playoff predictions lock very soon!'
    : '📅 <strong>Reminder:</strong> Playoff predictions lock in 24 hours.';

  const statusBlock = hasSubmitted
    ? `<div class="status status-ok">
        ✅ You have already submitted your playoff predictions — you're all set!<br/>
        <span style="font-size:12px;opacity:.8;">You can still review and update your picks until the Qualifier starts.</span>
       </div>
       <a class="cta" style="background:#1e3326;color:#00e676;border:1px solid #00e676;" href="${playoffUrl}">REVIEW YOUR PLAYOFF PICKS →</a>`
    : `<div class="status status-warn">
        ⚠️ You have NOT submitted your playoff predictions yet!<br/>
        <span style="font-size:12px;opacity:.8;">All 4 picks lock the moment the Qualifier starts. Don't miss out!</span>
       </div>
       <a class="cta" href="${playoffUrl}">SUBMIT PLAYOFF PREDICTIONS →</a>`;

  return \`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
  body{margin:0;padding:0;background:#0a0e0a;font-family:'Segoe UI',Arial,sans-serif;color:#e0e0e0;}
  .wrap{max-width:560px;margin:0 auto;background:#111;border:1px solid #1e1e1e;border-radius:10px;overflow:hidden;}
  .head{background:#111;padding:28px 28px 20px;border-bottom:2px solid #ffc400;text-align:center;}
  .badge{display:inline-block;background:#ffc400;color:#000;font-weight:700;font-size:11px;letter-spacing:2px;padding:3px 12px;border-radius:3px;text-transform:uppercase;margin-bottom:12px;}
  h1{margin:0;font-size:26px;color:#ffc400;letter-spacing:2px;line-height:1.2;}
  .sub{color:#888;font-size:13px;margin-top:6px;}
  .body{padding:24px 28px;}
  .urgency{background:rgba(255,196,0,.08);border:1px solid rgba(255,196,0,.3);border-radius:6px;padding:12px 16px;font-size:14px;color:#ffc400;margin-bottom:18px;line-height:1.5;}
  .lock-box{background:#0d1a0d;border:1px solid #1a3a1a;border-radius:8px;padding:18px 20px;margin-bottom:20px;}
  .lock-box h3{font-size:14px;color:#00e676;margin:0 0 12px;letter-spacing:1px;text-transform:uppercase;}
  .playoff-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #1a2a1a;}
  .playoff-row:last-child{border-bottom:none;}
  .playoff-num{width:24px;height:24px;background:#ffc400;color:#000;border-radius:50%;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .playoff-label{font-size:13px;color:#e0e0e0;font-weight:600;}
  .playoff-pts{margin-left:auto;font-size:12px;color:#00e676;font-weight:700;}
  .lock-warning{background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.3);border-radius:6px;padding:12px 16px;margin-bottom:18px;font-size:13px;color:#ff6b6b;line-height:1.6;}
  .status{border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px;line-height:1.6;}
  .status-ok{background:rgba(0,230,118,.08);border:1px solid rgba(0,230,118,.25);color:#00e676;}
  .status-warn{background:rgba(255,196,0,.08);border:1px solid rgba(255,196,0,.3);color:#ffc400;}
  .cta{display:block;background:#ffc400;color:#000;text-align:center;padding:14px;border-radius:6px;font-weight:700;font-size:15px;letter-spacing:1px;text-decoration:none;margin-bottom:18px;}
  .foot{padding:16px 28px;border-top:1px solid #1e1e1e;font-size:11px;color:#444;text-align:center;}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div class="badge">HBL PSL 2026</div>
    <h1>🏆 PLAYOFF PREDICTIONS</h1>
    <p class="sub">All 4 playoff predictions — one deadline</p>
  </div>
  <div class="body">
    <div class="urgency">\${urgency}</div>

    <div class="lock-warning">
      🔒 <strong>Important:</strong> Unlike group stage matches (where each match locks individually),
      <strong>all 4 playoff predictions lock together</strong> at the start of the first playoff match.<br/><br/>
      <strong>Lock time: \${lockStr}</strong><br/>
      After this time, no playoff predictions can be made or changed.
    </div>

    <div class="lock-box">
      <h3>All 4 Predictions lock at \${lockStr}</h3>
      <div class="playoff-row">
        <div class="playoff-num">1</div>
        <div class="playoff-label">Qualifier — 1st vs 2nd (April 28)</div>
        <div class="playoff-pts">+15 pts</div>
      </div>
      <div class="playoff-row">
        <div class="playoff-num">2</div>
        <div class="playoff-label">Eliminator 1 — 3rd vs 4th (April 29)</div>
        <div class="playoff-pts">+15 pts</div>
      </div>
      <div class="playoff-row">
        <div class="playoff-num">3</div>
        <div class="playoff-label">Eliminator 2 — Winner advances (May 1)</div>
        <div class="playoff-pts">+15 pts</div>
      </div>
      <div class="playoff-row">
        <div class="playoff-num">4</div>
        <div class="playoff-label">🏆 FINAL — PSL 2026 Champion (May 3)</div>
        <div class="playoff-pts" style="color:#ffc400;">+25 pts</div>
      </div>
    </div>

    \${statusBlock}

    <p style="color:#666;font-size:12px;text-align:center;">
      Hey \${username} — don't forget to predict all rounds before the Qualifier!<br/>
      Max playoff points: <strong style="color:#ffc400;">70 pts</strong>
    </p>
  </div>
  <div class="foot">
    PSL 2026 Predictor &bull; You're receiving this because you registered an email.
    <a href="mailto:helloshabeeb@gmail.com?subject=Unsubscribe" style="color:#555;">Unsubscribe</a>
  </div>
</div>
</body>
</html>\`;
}

// ═══════════════════════════════════════════════════
//  CLOUD FUNCTION — 30-MIN PLAYOFF REMINDER
//  Fires 25–35 min before the Qualifier (M41)
//  April 28 2026 7:00 PM PKT = 14:00 UTC
// ═══════════════════════════════════════════════════
exports.sendPlayoffReminder30min = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "Asia/Karachi",
    timeoutSeconds: 300,
    memory: "256MiB",
    maxInstances: 1,
    region: "us-central1",
  },
  async (event) => {
    const db    = admin.database();
    const nowMs = Date.now();

    // Qualifier M41: April 28 2026 14:00 UTC
    const QUALIFIER_UTC = Date.UTC(2026, 3, 28, 14, 0, 0);

    const WINDOW_MIN = 25 * 60 * 1000; // 25 min
    const WINDOW_MAX = 35 * 60 * 1000; // 35 min
    const diff = QUALIFIER_UTC - nowMs;

    if (diff < WINDOW_MIN || diff > WINDOW_MAX) return; // not in window

    const sentKey = "playoff_reminder_30min";
    const sentSnap = await db.ref(\`remindersSent/\${sentKey}\`).once("value");
    if (sentSnap.exists()) {
      console.log("30-min playoff reminder already sent — skipping.");
      return;
    }

    const usersSnap = await db.ref("users").once("value");
    const users = usersSnap.val() || {};
    const playoffUrl = "https://psl-rose.vercel.app/playoffs.html";

    let sent = 0, failed = 0;
    console.log("Sending 30-min playoff reminders…");

    for (const uid of Object.keys(users)) {
      const u = users[uid];
      if (!u.email) continue;

      const hasSubmitted = !!(u.playoffsComplete);
      const html = buildPlayoffEmailHtml(u.username || uid, "30min", hasSubmitted, playoffUrl);

      const mailOptions = {
        from:    { name: "PSL 2026 Predictor", address: "helloshabeeb@gmail.com" },
        to:      u.email,
        replyTo: "helloshabeeb@gmail.com",
        subject: \`🔒 30 MINS LEFT — All 4 playoff predictions lock at 7:00 PM PKT tonight!\`,
        html,
        text: \`PSL 2026 Predictor — Playoff Predictions Locking Soon!\n\nHey \${u.username || uid},\n\nThis is your 30-minute warning — ALL 4 playoff predictions lock when the Qualifier begins at 7:00 PM PKT tonight (April 28, 2026).\n\nUnlike group matches (where each locks at its own time), ALL FOUR playoff predictions lock together at the Qualifier start:\n• Qualifier (April 28) — +15 pts\n• Eliminator 1 (April 29) — +15 pts\n• Eliminator 2 (May 1) — +15 pts\n• Final (May 3) — +25 pts\n\n\${hasSubmitted ? "✅ You have submitted your predictions. You can still update them before 7 PM." : "⚠️ You have NOT submitted playoff predictions yet! Hurry — you have 30 minutes."}\n\nPredict now: \${playoffUrl}\n\`,
        headers: {
          "X-Mailer": "PSL2026-Predictor/1.0",
          "X-Priority": "1",
          "Precedence": "bulk",
          "List-Unsubscribe": "<mailto:helloshabeeb@gmail.com?subject=Unsubscribe>",
        },
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(\`  ✓ 30min sent to \${u.email}\`);
        sent++;
      } catch(err) {
        console.error(\`  ✗ 30min failed for \${u.email}:\`, err.message);
        failed++;
      }
      await new Promise(r => setTimeout(r, 300));
    }

    await db.ref(\`remindersSent/\${sentKey}\`).set({
      sentAt: new Date().toISOString(), sent, failed,
      note: "30-min playoff reminder — all 4 picks lock at Qualifier time"
    });
    console.log(\`30-min playoff reminder done — \${sent} sent, \${failed} failed.\`);
  }
);

// ═══════════════════════════════════════════════════
//  CLOUD FUNCTION — 24-HOUR PLAYOFF REMINDER
//  Fires 23h50m – 24h10m before the Qualifier (M41)
//  i.e. around April 27 7:00 PM PKT
// ═══════════════════════════════════════════════════
exports.sendPlayoffReminder24h = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "Asia/Karachi",
    timeoutSeconds: 300,
    memory: "256MiB",
    maxInstances: 1,
    region: "us-central1",
  },
  async (event) => {
    const db    = admin.database();
    const nowMs = Date.now();

    // Qualifier M41: April 28 2026 14:00 UTC
    const QUALIFIER_UTC = Date.UTC(2026, 3, 28, 14, 0, 0);

    const WINDOW_MIN = (24 * 60 - 10) * 60 * 1000; // 23h50m
    const WINDOW_MAX = (24 * 60 + 10) * 60 * 1000; // 24h10m
    const diff = QUALIFIER_UTC - nowMs;

    if (diff < WINDOW_MIN || diff > WINDOW_MAX) return; // not in window

    const sentKey = "playoff_reminder_24h";
    const sentSnap = await db.ref(\`remindersSent/\${sentKey}\`).once("value");
    if (sentSnap.exists()) {
      console.log("24h playoff reminder already sent — skipping.");
      return;
    }

    const usersSnap = await db.ref("users").once("value");
    const users = usersSnap.val() || {};
    const playoffUrl = "https://psl-rose.vercel.app/playoffs.html";

    let sent = 0, failed = 0;
    console.log("Sending 24h playoff reminders…");

    for (const uid of Object.keys(users)) {
      const u = users[uid];
      if (!u.email) continue;

      const hasSubmitted = !!(u.playoffsComplete);
      const html = buildPlayoffEmailHtml(u.username || uid, "24h", hasSubmitted, playoffUrl);

      const mailOptions = {
        from:    { name: "PSL 2026 Predictor", address: "helloshabeeb@gmail.com" },
        to:      u.email,
        replyTo: "helloshabeeb@gmail.com",
        subject: \`🏆 24 hours left — Make your PSL 2026 playoff predictions before they lock!\`,
        html,
        text: \`PSL 2026 Predictor — Playoff Predictions Reminder\n\nHey \${u.username || uid},\n\nOne day to go! ALL 4 playoff predictions lock when the Qualifier begins:\nApril 28, 2026 at 7:00 PM PKT\n\nUnlike group matches (where each locks at its own time), ALL FOUR playoff predictions lock together at the Qualifier start:\n• Qualifier (April 28) — +15 pts\n• Eliminator 1 (April 29) — +15 pts\n• Eliminator 2 (May 1) — +15 pts\n• Final (May 3) — +25 pts\n\nMax playoff points: 70 pts\n\n\${hasSubmitted ? "✅ You have submitted your predictions. You can still update them before the deadline." : "⚠️ You have NOT submitted playoff predictions yet. You have 24 hours!"}\n\nPredict now: \${playoffUrl}\n\`,
        headers: {
          "X-Mailer": "PSL2026-Predictor/1.0",
          "X-Priority": "3",
          "Precedence": "bulk",
          "List-Unsubscribe": "<mailto:helloshabeeb@gmail.com?subject=Unsubscribe>",
        },
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(\`  ✓ 24h sent to \${u.email}\`);
        sent++;
      } catch(err) {
        console.error(\`  ✗ 24h failed for \${u.email}:\`, err.message);
        failed++;
      }
      await new Promise(r => setTimeout(r, 300));
    }

    await db.ref(\`remindersSent/\${sentKey}\`).set({
      sentAt: new Date().toISOString(), sent, failed,
      note: "24h playoff reminder — all 4 picks lock at Qualifier time"
    });
    console.log(\`24h playoff reminder done — \${sent} sent, \${failed} failed.\`);
  }
);
