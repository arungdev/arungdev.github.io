# Real app screenshots with fictional data

These scripts generate statements, seed a fresh demo instance, and capture the
real application in Chrome at 2400 × 1500.

Use a separate portable installation in `_build/.demo-runtime/app`. Copy only
the executable, `wwwroot`, PostgreSQL binaries and logging configuration from a
trusted app build. Never copy `Data`, `Uploads`, backups, logs, or user profiles.
Configure it to bind only to `http://127.0.0.1:5097` with embedded PostgreSQL.
Verify its writable data directory is inside `.demo-runtime/app` before seeding.

1. Run `node generate_statements.mjs` in this folder.
2. Start the separate app instance.
3. Run `node seed_database.mjs`, then `node complete-seed.mjs`.
4. Run `node capture_assets.mjs` with Chrome installed.
5. Inspect the captures and run `node ../build.js`.

Account holders are Demo User. Identifiers are made-up zero-prefixed values
ending 1001, 2002, and 3003. Transactions and participants are fictional examples.
The demo password is public test data; do not reuse it. Runtime data, generated
statements and PNG captures stay ignored.
