---
name: Add example soul file
about: Submit a new example to the examples/ directory
title: "examples: add [agent name]"
labels: example
---

## Agent name

<!-- e.g., "Climate Scientist", "Debate Coach", "Immigration Lawyer" -->

## Use case

<!-- Who would deploy this agent, and where? What problem does it solve? -->

## Category

<!-- Which awesome-soul-files category does this best fit?
- Philosophy & mentors
- Technical experts
- Business & finance
- Creative & writing
- Domain-specific
-->

## Link to soul file

<!-- PR link, Gist, or paste the file inline -->

## Checklist

- [ ] Validates against `soul.schema.json` (run `node scripts/validate.js your-file.soul.md`)
- [ ] Personality field is 3+ sentences and specific to this agent (not generic)
- [ ] At least `tone`, `values`, and `knowledge_domains` are filled in
- [ ] Comment block at top of file explains the use case
- [ ] No real personal data, API keys, or sensitive information in the file
