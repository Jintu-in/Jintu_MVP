# @jintu/db

Generated Supabase types. **`src/types.ts` is not committed yet** — it cannot
be, because generating it requires a linked Supabase project:

```bash
pnpm supabase link --project-ref <ref>   # ap-south-1 project
pnpm db:types                            # writes src/types.ts
```

Nothing imports this package until those types exist. The skeleton is here so
that `pnpm db:types` has somewhere to write on the first run.

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
