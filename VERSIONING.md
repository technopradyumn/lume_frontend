# Versioning

Lume Frontend follows Semantic Versioning: `MAJOR.MINOR.PATCH`.

- `MAJOR`: incompatible application or integration changes.
- `MINOR`: backward-compatible features and substantial UI additions.
- `PATCH`: backward-compatible fixes.

The release version is stored in `package.json` and mirrored by
`src/shared/config/version.js` for the user interface. Release work uses a
matching branch named `version/frontend-vX.Y.Z`. Before merging a release,
run `npm run version:check` and `npm run build`.

Current release: **2.1.0** on `version/frontend-v2.1.0`.

## Release workflow

1. Create `version/frontend-vX.Y.Z` from an up-to-date `main`.
2. Update `package.json`, `package-lock.json`, the runtime version config, and
   `CHANGELOG.md`.
3. Run `npm run version:check` and `npm run build`.
4. Merge the reviewed version branch into `main`.
5. Tag the merge commit as `frontend-vX.Y.Z`.
