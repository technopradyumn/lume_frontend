# Versioning

Lume Frontend follows Semantic Versioning: `MAJOR.MINOR.PATCH`.

- `MAJOR`: incompatible application or integration changes.
- `MINOR`: backward-compatible features and substantial UI additions.
- `PATCH`: backward-compatible fixes.

The release version is stored in `package.json` and mirrored by
`src/shared/config/version.js` for the user interface. This repository uses
the GitFlow model described in David Mosyan's
[Version Control Branching Strategies](https://medium.com/@dmosyan/version-control-branching-strategies-e68e8d5ef1e0).

Current release: **2.1.0**.

## Branches

- `main`: permanent, production-ready code only. Every release is tagged.
- `develop`: permanent integration branch for the next release.
- `feature/<description>`: short-lived, created from and merged into `develop`.
- `release/<X.Y.Z>`: short-lived stabilization branch created from `develop`;
  only version changes, documentation, and release fixes belong here.
- `hotfix/<X.Y.Z>`: urgent production fix created from `main`, then merged into
  both `main` and `develop`.

Branch names never include `frontend` because this repository already contains
only the frontend.

## Release workflow

1. Merge completed `feature/*` branches into `develop`.
2. Create `release/X.Y.Z` from `develop`.
3. Update `package.json`, `package-lock.json`, the runtime version config, and
   `CHANGELOG.md`; then run `npm run version:check` and `npm run build`.
4. Merge the release into both `main` and `develop`.
5. Tag the `main` merge commit as `vX.Y.Z`, then delete the release branch.
