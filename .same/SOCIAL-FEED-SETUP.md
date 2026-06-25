# Social Media Feed — Setup & Going Live

The "Stay Social" section appears on the **Home** page and the **Upcoming** page.

## Status

- **Facebook** — LIVE. Uses Facebook's free Page Plugin (no key/signup). If a
  browser/ad-blocker blocks it, visitors see a tidy "Open Facebook Page" card
  instead, so it never looks broken.
- **Instagram** — LIVE via LightWidget (@themerryfiddlers). The widget URL is set
  as the built-in default in `src/components/SocialFeed.tsx`
  (`DEFAULT_INSTAGRAM_EMBED`), so it works on production once the code is deployed —
  no Netlify variable or cache-clear needed. Goes live the moment this code is
  pushed to GitHub → Netlify.

### To change the Instagram feed later
- Easiest: ask me to swap in a new LightWidget URL, or edit `DEFAULT_INSTAGRAM_EMBED`
  in `src/components/SocialFeed.tsx`.
- Or override without a code change: set `NEXT_PUBLIC_INSTAGRAM_EMBED_URL` in
  Netlify → Environment variables, then **Clear cache and deploy site**.

---

## Reference: how the LightWidget URL was created (free, ~10–15 min)

> Why a widget? Since 2020 Instagram has had no free public feed — every live
> embed (LightWidget, SnapWidget, Behold) needs you to connect your account once.
> This is the only part that needs your Instagram login, so it has to be done by you.

### Before you start — Instagram must be a Business/Creator account
LightWidget requires a **Business** or **Creator** Instagram (free to switch):
1. In the Instagram app: **Profile → ☰ menu → Settings and privacy**.
2. **Account type and tools → Switch to professional account** → choose
   **Business** (or Creator). Link it to your Facebook page when prompted.
   (You already have the `@themerryfiddlerspub` Facebook page, so this is quick.)

### Create the widget
1. Go to **https://lightwidget.com** and click **Sign up** (free).
2. Click **Create new widget**.
3. Click **Connect with Instagram** and log in as **@themerryfiddlers**, then
   authorise LightWidget.
4. Pick a layout — recommended: **Grid**, **3 columns**, **3 rows** (looks best
   in our card). Set image spacing/rounded corners to taste.
5. Click **Save** (top right).
6. Click **Get code**. You'll see something like:
   ```html
   <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
   <iframe src="//lightwidget.com/widgets/abcd1234efgh5678.html"
           class="lightwidget-widget"></iframe>
   ```
7. Copy **only the URL inside `src="..."`**, e.g.
   `//lightwidget.com/widgets/abcd1234efgh5678.html`
   (the site auto-converts the `//` to `https://` — no need to edit it).

### Finish — two easy options
**Option A (recommended): let me wire it up first**
- Paste that URL to me in chat. I'll drop it into the preview, confirm your real
  feed renders nicely, and then it's a single Netlify variable to go live.

**Option B: go straight live**
1. Netlify → your site → **Site configuration → Environment variables → Add**.
2. **Key:** `NEXT_PUBLIC_INSTAGRAM_EMBED_URL`
   **Value:** the URL from step 7.
3. **Deploys → Trigger deploy → Clear cache and deploy site.**
   (Important: `NEXT_PUBLIC_*` is baked in at build time, so a plain redeploy
   won't pick it up — you must clear the cache.)

That's it — the curated wall is automatically replaced by your live Instagram.

> SnapWidget (snapwidget.com) and Behold (behold.so) work identically — just
> paste their iframe `src` URL into the same variable.

---

## Changing accounts / photos

- Facebook page: set `NEXT_PUBLIC_FACEBOOK_PAGE_URL` (default
  `https://www.facebook.com/themerryfiddlerspub/`).
- Instagram profile link + curated fallback photos: edit `INSTAGRAM_URL` and the
  `GALLERY` array in `src/components/SocialFeed.tsx`.

## Troubleshooting

- **Facebook box is empty in the Same preview** — expected; the preview sandbox
  blocks Facebook. It renders fine on the live domain.
- **Instagram still shows the photo wall after adding the Netlify var** — you did
  a plain redeploy. Use **Clear cache and deploy site**.
- **LightWidget shows "reconnect"** — the Instagram authorisation expired; open
  the widget on lightwidget.com and reconnect. No code change needed.
