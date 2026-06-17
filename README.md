# playwright-bdd rest tuple arity repro

This repo reproduces a `playwright-bdd@9.1.0` generation failure for step
callbacks that destructure typed captured arguments from a rest tuple.

## Reproduction

```bash
pnpm install
pnpm generate
```

Expected with `playwright-bdd@9.1.0`:

```text
Found step definitions with incorrect arguments: 1
Step: Given the following widgets exist: # features/rest-tuple-step.feature:4:5
Pattern: the following (widget)s exist: # steps/restTuple.steps.ts
Function has 1 argument, but expected 3.
```

## Why This Is Unexpected

The step callback intentionally uses a rest tuple to preserve TypeScript
relationships between the regex capture and the data table:

```ts
type EntityArgs = [EntityType, DataTable];

Given(/the following (widget)s exist:/, ({}, ...[entityType, rows]: EntityArgs) => {
  // ...
});
```

At runtime, JavaScript reports this callback as arity `1` because rest
parameters do not contribute to `Function.length`. The step still accepts the
capture and data table correctly when invoked.

This pattern worked before the stricter arity validation in `playwright-bdd@9`.
Replacing the callback with explicit parameters avoids the generation error, but
for larger typed step libraries it can weaken or duplicate tuple-based type
relationships.
