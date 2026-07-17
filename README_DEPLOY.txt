ZABIAN LANGUAGE ARCHIVE — GLOBAL VISITOR COUNTER
=================================================

WHAT THIS VERSION COUNTS
- Total visits: one visit from the same browser per UTC calendar day.
- Today: the number of counted visits during the current UTC day.
- Unique devices: browsers that have ever opened the site.

A browser receives a random ID saved in localStorage. No name, email, precise
location, or account information is collected. Clearing browser data, using
private browsing, switching browsers, or switching devices can create a new ID.

DEPLOYMENT
1. Keep this complete folder structure together.
2. Put the folder in a GitHub repository.
3. In Netlify, choose "Add new project" and import that repository.
4. Netlify will install @netlify/blobs and deploy the function automatically.
5. Open the live site. The counter starts at 1 on its first successful visit.

IMPORTANT
- Uploading only index.html will not activate the global counter.
- Local file previews show "deploy full project to activate."
- No API key or database password is required.
- Netlify Blobs persists the count across future site deployments.

FILES
index.html
package.json
netlify.toml
netlify/functions/visit.mjs
