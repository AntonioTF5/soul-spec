# Contributing to SOUL.md

Thank you for contributing. This document covers how to add examples, propose spec changes, and report bugs.

## Ways to contribute

### 1. Add an example soul file

The bar for examples:
- Useful for a real deployment, not a toy placeholder
- Personality field is specific to an individual or role (not "a helpful assistant")
- At least `tone`, `values`, and `knowledge_domains` filled in
- Validates cleanly against the schema

Steps:
1. Fork this repo
2. Create `examples/your-agent.soul.md`
3. Run `node scripts/validate.js examples/your-agent.soul.md` — must pass
4. Add a comment block at the top explaining the use case (see existing examples)
5. Open a PR — title format: `examples: add [agent name]`

### 2. Propose a spec change

Before opening a PR for a spec change, open an issue using the [spec-change template](https://github.com/AntonioTF5/soul-spec/issues/new?template=spec-change.md). Include:
- The field name or behavior being changed
- Why it's needed (real use case, not hypothetical)
- Whether it's backward-compatible with v1.x
- What the JSON schema change looks like

Breaking changes (removing required fields, changing field types) require a major version bump and a migration guide.

### 3. Report a validator bug

Open a standard issue. Include:
- The soul file content that produced the unexpected result (or a minimal repro)
- The actual output
- The expected output

## Code of conduct

Be direct and technical. Disagree with arguments, not people. Respond to issues within reason. If a discussion isn't going anywhere, a maintainer will close it.

## Developer Certificate of Origin

By submitting a PR, you confirm that your contribution is your own work and you have the right to submit it under the MIT license. No CLA required — just a clean commit history.

## Running the validator locally

```bash
npm install ajv js-yaml
node scripts/validate.js examples/marcus-aurelius.soul.md
```

Or install the CLI globally:

```bash
npm install -g soul-cli
soul-cli validate examples/marcus-aurelius.soul.md
```
