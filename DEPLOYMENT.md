# Deployment (admin)

Canonical guide: **[crowd-cult-infra/docs/repo-crowd-cult-admin.md](../crowd-cult-infra/docs/repo-crowd-cult-admin.md)**

Same rule as the main frontend: **`NEXT_PUBLIC_API_URL` is baked in at build time.**

## Quick: Cloud Build

```bash
cd crowd-cult-admin
gcloud builds submit \
  --tag asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/crowd-cult-admin/crowd-cult-admin:latest \
  .
```

## Quick: rollout

```bash
kubectl rollout restart deployment/crowd-cult-admin -n YOUR_NAMESPACE
```
