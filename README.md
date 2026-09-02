# Notes from the Bench

Single-author microbiology blog. The public can read published posts; only one admin account can create, edit, or delete them.

The stack is intentionally cheap to run: **Vite + React** on Vercel’s Hobby plan, **Firebase Spark** (Firestore + Authentication), and **Cloudinary** (free tier) for images. There are no Cloud Functions.

## Stack

- Frontend: React 18, Vite, React Router v6, Tailwind CSS
- Data + auth: Firebase (Firestore, Auth) via the client SDK
- Images: Cloudinary unsigned uploads (covers and in-post figures)
- Editor: TipTap (headings, bold/italic, blockquotes, lists, tables, figures with captions, links, sub/superscript)
- SEO: `react-helmet-async`
- Hosting: Vercel (not Firebase Hosting)

## Project structure

```
src/
  components/     layout, editor, post cards, SEO, UI
  pages/          public + /admin routes
  firebase/       Auth + Firestore helpers
  cloudinary/     unsigned image uploads
  hooks/          useAuth, usePosts, usePost
  utils/          slug, reading time, dates
  config/         site copy + About page profile
```

Edit `src/config/author.js` and `src/config/site.js` for the About page and site title. Those live in source, not Firestore, because they rarely change.

## 1. Create the Firebase project (Spark)

1. Open [Firebase Console](https://console.firebase.google.com/) and create a project. Stay on the **Spark** (free) plan.
2. Add a **Web** app. Copy the config values (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
3. **Do not enable Firebase Hosting.** This frontend deploys to Vercel.
4. You do **not** need Firebase Storage. Images go to Cloudinary.

### Authentication

1. Build → Authentication → Get started.
2. Enable the **Email/Password** provider.
3. Add **one** user (the site owner). There is no public sign-up screen.

### Firestore

1. Build → Firestore Database → Create database.
2. Start in **production** mode.
3. Paste the rules from `firestore.rules`.
4. Optional: deploy indexes from `firestore.indexes.json`, or click the index link Firebase prints in the browser console the first time a slug query needs it.

## 2. Create a Cloudinary account and unsigned preset

1. Sign up for a free [Cloudinary](https://cloudinary.com/) account.
2. From the dashboard, copy **Cloud name**.
3. Settings → **Upload** → **Upload presets** → **Add upload preset**.
4. Set **Signing mode** to **Unsigned**. Do not put the API secret in this app.
5. Recommended preset options:
   - Folder: `blo
   - Allowed formats: `jpgg` (or leave blank)
   - Unique filename: on, png, webp, gif`
   - Max file size: 5 MB
6. Save the preset and copy its **Preset name**.

Uploads send an optional `folder` of `covers` or `inline`. In the preset, either allow additional folder fields or leave the preset folder unlocked. If Cloudinary rejects the folder, turn that restriction off.

The cloud name and unsigned preset appear in the client bundle. That is expected for unsigned uploads. Keep the API secret in the Cloudinary console only.

## 3. Local setup

```bash
git clone <your-repo>
cd zaheer-blog
npm install
cp .env.example .env
```

Fill `.env` (never hardcode these in source):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

VITE_SITE_URL=http://localhost:5173
```

Vite only exposes variables prefixed with `VITE_`. Never commit `.env`.

```bash
npm run dev
```

Open http://localhost:5173. Sign in at `/admin/login` with the Firebase user you created.

If login fails with an unauthorized-domain error, add `localhost` under Authentication → Settings → Authorized domains (it is present by default).

## 4. Writing posts

The editor is built for lab notes, not marketing copy:

- **Italic** for binomial names (*Escherichia coli*)
- **Sub/superscript** for formulas and titres (H₂O₂, 10⁶ CFU/mL)
- **Figure** inserts an image plus a caption field (microscopy, gels, charts)
- **Tables** for susceptibility panels and similar data
- **Blockquotes** for key findings
- **References** are a structured list (citation text + DOI/PubMed/journal URL), rendered at the bottom of the post

Cover images and in-post figures upload to Cloudinary and store the returned HTTPS URL on the Firestore document.

Reading time is computed on save (~200 words/minute). The slug is generated from the title and can be edited until the first publish, then it is locked. The dashboard shows **Draft** vs **Published** badges. Deleting a post asks for confirmation first.

## 5. Deploy to Vercel (Hobby)

1. Push this project to GitHub.
2. In Vercel, **Import** the repo. Vite is detected automatically (`npm run build`, output `dist`).
3. Add the same `VITE_FIREBASE_*`, `VITE_CLOUDINARY_*`, and `VITE_SITE_URL` values as **Environment Variables**. Vercel does not read your local `.env`.
4. Deploy. You will get a `*.vercel.app` URL.
5. **Required:** Firebase Console → Authentication → Settings → **Authorized domains** → add the `*.vercel.app` domain. Without this, `/admin/login` fails with “unauthorized domain”.

`vercel.json` already rewrites all routes to `index.html` so React Router works on refresh.

## 6. Custom domain

1. In Vercel → Project → Settings → Domains, add the domain and follow the DNS instructions (A record or CNAME at the registrar).
2. Set `VITE_SITE_URL` to `https://your-domain` and redeploy so Open Graph URLs are correct.
3. Add the custom domain to Firebase **Authorized domains** as well.

The only ongoing paid cost should be the domain name itself, as long as you stay within Spark, Cloudinary free-tier, and Vercel Hobby quotas.

## Security model

- Public visitors can read documents with `status == "published"` only.
- Create/update/delete require a signed-in Firebase user.
- Image uploads use a Cloudinary **unsigned** preset from the admin editor. Restrict the preset (formats, max size, folder) in the Cloudinary console.
- Create the admin user by hand in the Firebase console. Do not add a registration flow.

## Scripts

| Command           | Purpose               |
| ----------------- | --------------------- |
| `npm run dev`     | Local Vite dev server |
| `npm run build`   | Production build      |
| `npm run preview` | Preview the build     |
