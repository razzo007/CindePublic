# Netlify deploy

This project is ready to deploy as a static site.

## Recommended publish root

Deploy the `Cinde/` directory itself, not only `Cinde/landing/`.

That keeps these paths working:

- `/landing/index.html`
- `/landing/all-episodes.html`
- `/assets/albertsons-logo-placeholder.svg`
- `/email/latest-episode-email-sample.html`

## What is already configured

- `netlify.toml` publishes the current directory.
- `/` redirects to `/landing/index.html`
- `/latest` redirects to `/landing/index.html`
- `/episodes` redirects to `/landing/all-episodes.html`

## CLI deploy

If Netlify CLI is installed and authenticated:

```bash
cd Cinde
netlify deploy --prod
```

## What I still need to deploy from this machine

One of these:

- a Netlify auth token
- Netlify CLI already installed and logged in
- permission to install Netlify CLI and complete a browser/device login flow

