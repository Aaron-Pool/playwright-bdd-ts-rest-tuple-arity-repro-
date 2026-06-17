# playwright-bdd rest tuple arity repro

This repo reproduces a `playwright-bdd@9.1.0` generation failure for step
callbacks that destructure typed captured arguments from a rest tuple.

## Reproduction

```bash
pnpm install
pnpm test
```

Expected with `playwright-bdd@9.1.0`:

```text
Error: Found step definitions with incorrect arguments: 1
Step: And the following animals exist: # features/rest-tuple-step.feature:7:5
Pattern: the following (person|animal)s exist: # steps/restTuple.steps.ts:24
Function has 1 argument, but expected 3.
```

## Why This Is Unexpected

The step callback intentionally uses a rest tuple to preserve TypeScript
relationships between the regex capture and the data table:

```ts
type Entities = {
  person: {
    //...
  },
  animal: {
    //...
  }
};

type EntityArgs<T extends keyof Entities> ={[key in keyof Entities]: [key, DataHash<key>] }[T];

Given(/the following (person|animal)s exist:/, ({}, ...args: EntityArgs<keyof Entities>) => {
  const [type, list] = args;
  switch(type) {
    case 'person':
      // list narrowed to Entities['person'] model
    case 'animal'
      // list is narrowed to Entities['animal'] model
    default:
      throw Error('unrecognized type')
  }
});
```

At runtime, JavaScript reports this callback as arity `1` because rest
parameters do not contribute to `Function.length`. The step still accepts the
capture and data table correctly when invoked.

This pattern worked before the stricter arity validation added in `playwright-bdd@9`.
Replacing the callback with explicit parameters avoids the generation error, but
for larger typed step libraries it can weaken or duplicate tuple-based type
relationships.
