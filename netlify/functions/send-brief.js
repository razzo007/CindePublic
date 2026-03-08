const nodemailer = require("nodemailer");

const CONFIG = {
  briefTitle: "CINDE Executive Brief",
  companyName: "Albertsons",
  sectionPill: "Executive",
  sectionName: "Business Performance",
  updatedLabel: "Updated weekly",
  heroDescription:
    "Built to keep leaders ahead of change. CINDE delivers the most important trends, risks, and opportunities shaping Albertsons' performance. It highlights what's changing, why it matters, and where executives can act for the greatest impact.",
  latestEpisodeId: "2026-02-02",
  landingUrl: "https://cindepublic.netlify.app/landing/index.html",
  allEpisodesUrl: "https://cindepublic.netlify.app/landing/all-episodes.html",
  logoUrl: "https://cdn.jsdelivr.net/gh/razzo007/CindePublic@main/albertsons.png",
  mp3Url: "https://cdn.jsdelivr.net/gh/razzo007/CindePublic@main/hello.mp3",
  episode: {
    tag: "EXECUTIVE UPDATE",
    duration: "~8 min",
    date: "Feb 2, 2026",
    cadence: "WEEKLY",
    status: "LATEST",
    title: "Albertsons Business Update: Feb 2, 2026",
    eyebrow: "WEEKLY · EXECUTIVE UPDATE",
    summary:
      "Performance softened modestly, with pressure concentrated in a few regions and categories, even as digital and convenience-driven shoppers continued to grow. Loyalty engagement and high-value customers are beginning to weaken, while competitive price gaps and recent assortment changes are amplifying traffic and sales declines. Most of the recoverable upside sits in sharper promotions, restoring key delistings, and tightening pricing on highly visible items to stabilize trips and protect core customers.",
    plays: "4,820 plays"
  }
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function buildEmailHtml() {
  const episodeUrl = `${CONFIG.landingUrl}?episode=${encodeURIComponent(CONFIG.latestEpisodeId)}&autoplay=1`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(CONFIG.briefTitle)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#eef2f7;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
      Albertsons weekly executive brief. Open the latest audio update.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#eef2f7;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;">
            <tr>
              <td style="padding:0 0 16px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; border:1px solid #dbe3ec; border-radius:6px;">
                  <tr>
                    <td style="padding:24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td valign="top" style="width:88px; padding:0 20px 0 0;">
                            <img src="${escapeHtml(CONFIG.logoUrl)}" alt="${escapeHtml(CONFIG.companyName)} logo" width="88" style="display:block; width:88px; height:auto; border:0;" />
                          </td>
                          <td valign="top" style="font-family:Arial, Helvetica, sans-serif; color:#2c3340;">
                            <div style="font-size:26px; line-height:32px; font-weight:700;">${escapeHtml(CONFIG.briefTitle)}</div>
                            <div style="font-size:16px; line-height:22px; color:#0f62d6; font-weight:700; padding-top:6px;">${escapeHtml(CONFIG.companyName)}</div>
                            <div style="padding-top:14px; font-size:13px; line-height:18px; color:#667085;">
                              <span style="display:inline-block; padding:6px 12px; border-radius:999px; background-color:#0f62d6; color:#ffffff; font-weight:700;">${escapeHtml(CONFIG.sectionPill)}</span>
                              <span style="padding:0 6px;">&middot;</span>
                              <span>${escapeHtml(CONFIG.sectionName)}</span>
                              <span style="padding:0 6px;">&middot;</span>
                              <span>${escapeHtml(CONFIG.updatedLabel)}</span>
                            </div>
                            <div style="padding-top:14px; font-size:15px; line-height:24px; color:#667085;">
                              ${escapeHtml(CONFIG.heroDescription)}
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" style="padding-top:18px;">
                        <tr>
                          <td style="padding-left:12px;">
                            <a href="${escapeHtml(CONFIG.allEpisodesUrl)}" style="display:inline-block; padding:12px 18px; border:1px solid #c7d1dc; border-radius:3px; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:16px; font-weight:700; color:#667085; text-decoration:none;">All Episodes</a>
                          </td>
                          <td style="padding-left:12px;">
                            <a href="${escapeHtml(episodeUrl)}" style="display:inline-block; padding:12px 18px; border:1px solid #1677e6; border-radius:3px; background-color:#1677e6; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:16px; font-weight:700; color:#ffffff; text-decoration:none;">&#9654; Play Latest Episode</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial, Helvetica, sans-serif; font-size:18px; line-height:24px; font-weight:700; color:#2c3340; padding:8px 0 14px 0;">
                Latest Episode
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; border:1px solid #dbe3ec; border-radius:6px;">
                  <tr>
                    <td style="padding:24px; font-family:Arial, Helvetica, sans-serif;">
                      <div style="font-size:13px; line-height:18px; color:#667085;">
                        <span style="display:inline-block; padding:4px 8px; border-radius:4px; background-color:#e8f1ff; color:#0f62d6; font-size:12px; line-height:14px; font-weight:700;">${escapeHtml(CONFIG.episode.tag)}</span>
                        <span style="padding-left:10px;">${escapeHtml(CONFIG.episode.duration)} &middot; ${escapeHtml(CONFIG.episode.date)}</span>
                        <span style="padding-left:10px; font-size:11px; color:#8a94a6; letter-spacing:0.04em;">${escapeHtml(CONFIG.episode.cadence)}</span>
                        <span style="display:inline-block; margin-left:10px; padding:4px 8px; border-radius:999px; background-color:#eef2f7; color:#667085; font-size:12px; line-height:14px; font-weight:700;">${escapeHtml(CONFIG.episode.status)}</span>
                      </div>
                      <div style="padding-top:18px; font-size:20px; line-height:28px; font-weight:700; color:#2c3340;">
                        ${escapeHtml(CONFIG.episode.title)}
                      </div>
                      <div style="padding-top:12px; font-size:14px; line-height:20px; color:#0f62d6; text-transform:uppercase;">
                        ${escapeHtml(CONFIG.episode.eyebrow)}
                      </div>
                      <div style="padding-top:14px; font-size:15px; line-height:24px; color:#667085;">
                        ${escapeHtml(CONFIG.episode.summary)}
                      </div>
                      <div style="padding-top:18px;">
                        <div style="height:4px; background-color:#dde4ec; border-radius:999px;">
                          <div style="width:64%; height:4px; background-color:#1677e6; border-radius:999px;"></div>
                        </div>
                        <div style="padding-top:10px; font-size:14px; line-height:18px; color:#8a94a6;">${escapeHtml(CONFIG.episode.plays)}</div>
                      </div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="padding-top:18px;">
                        <tr>
                          <td>
                            <a href="${escapeHtml(episodeUrl)}" style="display:inline-block; padding:12px 18px; border:1px solid #1677e6; border-radius:3px; background-color:#1677e6; font-size:14px; line-height:16px; font-weight:700; color:#ffffff; text-decoration:none;">&#9654; Play Episode</a>
                          </td>
                          <td style="padding-left:12px;">
                            <a href="${escapeHtml(CONFIG.mp3Url)}" style="display:inline-block; padding:12px 18px; border:1px solid #c7d1dc; border-radius:3px; font-size:14px; line-height:16px; font-weight:700; color:#667085; text-decoration:none;">Download MP3</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const email = String(payload.email || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "A valid email address is required." })
      };
    }

    const transporter = nodemailer.createTransport({
      host: requiredEnv("SMTP_HOST"),
      port: Number(requiredEnv("SMTP_PORT")),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: requiredEnv("SMTP_USERNAME"),
        pass: requiredEnv("SMTP_PASSWORD")
      }
    });

    await transporter.sendMail({
      from: requiredEnv("FROM_EMAIL"),
      to: email,
      subject: "CINDE Executive Brief",
      html: buildEmailHtml(),
      text: [
        CONFIG.briefTitle,
        `${CONFIG.companyName} - ${CONFIG.sectionName}`,
        CONFIG.heroDescription,
        `Play latest episode: ${CONFIG.landingUrl}?episode=${encodeURIComponent(CONFIG.latestEpisodeId)}&autoplay=1`,
        `All episodes: ${CONFIG.allEpisodesUrl}`,
        `Download MP3: ${CONFIG.mp3Url}`
      ].join("\n\n")
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Failed to send email." })
    };
  }
};
