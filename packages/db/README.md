# @jintu/db

Generated Supabase types. `src/types.ts` is committed and is generated from
the linked project, not hand-written:

```bash
pnpm supabase link --project-ref <ref>   # ap-south-1 project
pnpm db:types                            # rewrites src/types.ts
```

It is committed rather than generated at install time so that a clone, and
CI, can typecheck without a Supabase project or a database. The consequence is
that it goes stale silently — regenerate it in the same commit as any
migration, per the steps below.

Note `pnpm db:types` writes to `packages/db/src/`, which must exist first; the
redirect creates the file but not its directory.

The SQL migrations in [`supabase/migrations/`](../../supabase/migrations) are
the schema source of truth — not this package, and not an ORM. Per
ARCHITECTURE.md §1, Prisma and Drizzle are explicitly rejected: they fight RLS,
and RLS is the entire access-control model.

## Regenerating after a schema change

```bash
pnpm db:new add_something   # new migration file
# ...edit the SQL...
pnpm db:reset               # apply locally
pnpm db:verify              # assert the schema guarantees still hold
pnpm schema:rules           # static §7 checks
pnpm db:types               # refresh types
```
