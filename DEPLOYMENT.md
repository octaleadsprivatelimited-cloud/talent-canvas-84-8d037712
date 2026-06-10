# Deployment Guide

This project is a **TanStack Start (React 19 + Vite 7)** app with **Firebase
(Firestore + Storage)** as the backend. You can host the frontend on
**Vercel** and the security rules on **Firebase**.

---

## 1. Firebase (Firestore + Storage rules)

Files in repo:

- `firestore.rules` — full role-based rules for: `siteConfig`, `pages`, `jobs`,
  `companies`, `users`, `applications`, `blog`, `plans`, `emails`,
  `notifications`, `auditLogs`, `featureFlags`, `subscribers`, `reports`,
  `flags`.
- `storage.rules` — public read for `/public/*` and `/site/*`, owner/admin
  for `/users/{uid}/*`.
- `firestore.indexes.json` — empty starter; add composite indexes here as
  Firestore prompts you in the console.
- `firebase.json` — wires the rules/indexes to the CLI.
- `.firebaserc` — **replace `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID`** with
  your real Firebase project ID.

### Deploy steps

```bash
# one-time
npm i -g firebase-tools
firebase login

# pick project (or edit .firebaserc)
firebase use <your-firebase-project-id>

# deploy security rules
firebase deploy --only firestore:rules,storage,firestore:indexes
```

### Required setup in Firebase console

1. **Authentication → Sign-in method**: enable Email/Password (and Google if
   you use it). Sign-in must be enabled or all writes will be rejected by the
   `isSignedIn()` rule guard.
2. **Firestore → Create database** in production mode if not already created.
3. **Storage → Get started** to provision the default bucket.
4. **Admin bootstrap**: the rules grant admin via a `role: "admin"` field on
   `users/{uid}`. After your first signup, manually set that field in the
   Firestore console for your account, otherwise no one can write to admin
   collections.

---

## 2. Vercel (frontend)

Files in repo:

- `vercel.json` — sets build command, output dir, and SPA-style rewrite.

### Environment variables

In **Vercel → Project Settings → Environment Variables**, add every variable
the app reads from `import.meta.env`. At minimum the Firebase web config:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Copy the values from **Firebase console → Project settings → Your apps →
Web app → SDK setup and configuration**. Set them for **Production**,
**Preview**, and **Development** scopes.

### Deploy steps

```bash
npm i -g vercel
vercel link        # link this folder to a Vercel project
vercel --prod      # production deploy
```

Or push to a Git branch connected to the Vercel project — Vercel will
auto-build using `vercel.json`.

### Authorized domains (important)

In **Firebase console → Authentication → Settings → Authorized domains**,
add:

- `your-project.vercel.app`
- any custom domain you connect on Vercel

Without this, Google/Email sign-in popups will be rejected on the deployed
URL.

---

## 3. Post-deploy smoke test

1. Visit the Vercel URL.
2. Sign up a test user, then in Firestore console set
   `users/<uid>.role = "admin"`.
3. Open `/dock/*` routes and confirm CRUD against Firestore works (writes
   should succeed only after the role flip).
4. Open DevTools → Network: Firestore requests should be `200`. A `403
PERMISSION_DENIED` means a rule or the missing admin role.

---

## Troubleshooting

- **`Missing or insufficient permissions`** on a public page → the
  collection's document is missing `published: true` (rules require it for
  `pages`, `jobs`, `blog`).
- **`auth/unauthorized-domain`** → add the Vercel domain to Firebase
  Authorized domains.
- **Vercel build fails on `bun`** → `vercel.json` is set to use `npm
install --legacy-peer-deps`; do not change this unless you also configure
  Bun on Vercel.
- **Blank page on refresh of a deep link** → the SPA rewrite in
  `vercel.json` handles this; if you removed it, restore the `/(.*) → /`
  rule.
