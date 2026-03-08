# Cinde

Static starter for the Cinde executive brief experience.

This project is split into two delivery surfaces because email clients and browsers have very different capabilities:

- `email/latest-episode-email.html`: email-safe HTML template for the outbound email.
- `landing/`: hosted pages that match the design direction and handle MP3 playback in a browser.

## Important constraint

Reliable inline audio playback inside email clients is not a realistic target. Gmail, Outlook, Apple Mail, and other clients either strip JavaScript, block audio controls, or render them inconsistently.

The safe pattern is:

1. Send a styled email with CTA buttons.
2. Link those buttons to a hosted landing page.
3. Play the MP3 on that hosted page.

## Files

- `landing/index.html`: latest episode landing page.
- `landing/all-episodes.html`: episode archive page.
- `landing/styles.css`: shared styles for hosted pages.
- `landing/app.js`: rendering and audio playback logic.
- `landing/config.js`: the only file you should need to edit for content updates.
- `assets/albertsons-logo-placeholder.svg`: local placeholder logo.
- `email/latest-episode-email.html`: email template with replacement tokens.

## How to use this

1. Edit `landing/config.js`:
   - replace copy, dates, and links as needed
   - `logoUrl` currently points to `https://cdn.jsdelivr.net/gh/razzo007/CindePublic@main/albertsons.png`
   - `audioUrl` currently points to `https://cdn.jsdelivr.net/gh/razzo007/CindePublic@main/hello.mp3`
2. Host the entire `landing/` folder somewhere public.
3. Replace the tokens in `email/latest-episode-email.html` with real absolute URLs from your CDN/site:
   - `{{LOGO_URL}}`
   - `{{LANDING_PAGE_URL}}`
   - `{{ALL_EPISODES_URL}}`
   - episode title and summary fields
4. Paste the final email HTML into your ESP or marketing automation tool.
5. Send tests to Gmail, Outlook, and Apple Mail before sending broadly.

## Current asset URLs

- Logo: `https://cdn.jsdelivr.net/gh/razzo007/CindePublic@main/albertsons.png`
- MP3: `https://cdn.jsdelivr.net/gh/razzo007/CindePublic@main/hello.mp3`

These are fine for prototype testing. For production sending, use your own CDN or asset host if you want stronger cache control and delivery guarantees.

## Recommended send flow

1. Email subject and preview text live in your ESP.
2. Email CTA goes to `landing/index.html?episode=<id>&autoplay=1`.
3. The hosted page loads the correct episode and attempts playback.
4. If autoplay is blocked by the browser, the user still sees a visible play button.

## Content update checklist

- Keep logo and images on absolute HTTPS URLs.
- Keep MP3 files on absolute HTTPS URLs.
- Keep email width at 600-680px for safer rendering.
- Avoid JavaScript, forms, and custom audio controls inside the email itself.
