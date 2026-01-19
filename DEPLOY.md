# Deployment guide — Firebase Hosting (client) + Cloud Run (server)

This document describes the recommended deployment approach used by the GitHub Actions workflow in `.github/workflows/deploy.yml`.

Summary
- Client: Firebase Hosting (serves the React `build/` directory)
- Server: Cloud Run (container built from `server/Dockerfile`)
- Secrets required in GitHub repository: see list below

Required GCP / Firebase setup
1. Create a Google Cloud project and enable Billing.
2. Enable the following APIs: Cloud Run, Cloud Build, Container Registry or Artifact Registry, IAM & Admin.
3. Create a service account with the `roles/run.admin`, `roles/storage.admin` (if using Container Registry) and `roles/iam.serviceAccountUser` roles and download its JSON key.
4. Create a Firebase project (can be same GCP project) and enable Hosting for it. Create a Firebase service account JSON or use `firebase login:ci` token as documented below.

GitHub secrets used by workflow
- `GCP_PROJECT` — your GCP project id
- `GCP_REGION` — Cloud Run region (e.g. `us-central1`)
- `GCP_SA_KEY` — base64-encoded service account JSON (used by gcloud in CI)
- `FIREBASE_SERVICE_ACCOUNT` — Firebase service account JSON content (or use the Firebase action alternative)
- `FIREBASE_PROJECT_ID` — Firebase project id

Notes and next steps
- For persistent data you should migrate `db.json` into a managed datastore (recommended: Firestore). Cloud Run instances don't have persistent disk.
- The workflow builds the client and deploys to Firebase Hosting and builds and pushes a server image to GCR and deploys it to Cloud Run.

How to add secrets locally (example)
- Base64 encode your service account JSON before adding to GitHub secrets: `base64 key.json | clip` (on Windows) and paste into `GCP_SA_KEY`.

If you'd like, I can:
- Add a Firestore adapter and migrate read/write code to it (recommended for production).
- Complete the Firestore migration and add Firestore rules.
- Create the minimal `gcloud` and `firebase` setup script to run locally.

Firestore adapter notes
- I added a Firestore adapter that is activated when `USE_FIRESTORE=true` and expects either `FIREBASE_SERVICE_ACCOUNT_JSON` or `FIREBASE_SERVICE_ACCOUNT_BASE64` to be set in the environment.
- To install the new runtime dependency, run `npm install` inside `server/` (it includes `firebase-admin`).
- After you set the env vars and service account, a startup Firestore write test will run to confirm credentials and permissions.

Next step: confirm you want the Firestore migration included now, or prefer to handle it later. If confirmed, I'll add a Firestore adapter and update the server to use it behind a feature flag (env var `USE_FIRESTORE=true`).
