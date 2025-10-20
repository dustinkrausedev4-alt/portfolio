# Portfolio — Starter

This is a minimal static portfolio starter you can deploy on GitHub Pages or any static host.

## Files
- `index.html` — main page
- `styles.css` — styles
- `script.js` — small JS enhancements

## Quick start (local)
1. Clone or create a repo and copy files.
2. Serve locally:
```bash
# with Python 3
python -m http.server 8000
# or with a simple Node server
npx serve .
```
3. Open http://localhost:8000

## Deploy to GitHub Pages
1. Create a new repository on GitHub named e.g. `portfolio`.
2. Push the files to the `main` branch.
3. In the repository Settings → Pages, set the source to `main` (root) and save.
4. Wait a minute and your site will be available at `https://<username>.github.io/<repo>` (or `https://<username>.github.io` if using the `username.github.io` repo).

## Content suggestions
- Keep project descriptions short and link to live demos + source.
- Include 1–2 case studies with goals, your role, and outcomes (metrics help).
- Add a downloadable resume and LinkedIn/GitHub links.
- Make it accessible: semantic HTML, alt text, visible focus states, and sufficient contrast.

## Next steps & ideas
- Add meta/open graph tags for sharing.
- Use a static site generator (Astro/VitePress/Next) if you want CMS or blog support.
- Add analytics (Plaft or simple server logs) and a contact form backend (Formspree, Netlify forms, or server endpoint).
