# Changelog

All notable changes to the SOUL.md specification are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-01-01

Initial release of the SOUL.md specification.

### Added

- YAML frontmatter format with 4 required fields: `name`, `version`, `description`, `personality`
- 10 optional fields: `tone`, `values`, `constraints`, `knowledge_domains`, `communication_style`, `memory_mode`, `goals`, `relationships`, `language`, `platform_hints`
- `memory_mode` enum: `stateless` | `session` | `persistent`
- `relationships` as a typed array of `{ name, role, notes? }` objects
- `language` field as BCP 47 tag
- `platform_hints` as an open object for platform-specific config
- `x-` prefix extensibility for custom fields
- JSON Schema (draft-07) at `schema/soul.schema.json`
- 8 reference example soul files in `examples/`
- `scripts/validate.js` — standalone Node.js validator (deps: ajv, js-yaml only)
- GitHub Actions CI workflow for PR validation

### Design decisions

- YAML frontmatter chosen over pure JSON for human readability and inline comment support
- `personality` field capped at 2000 chars to enforce discipline — soul files should be concise
- `additionalProperties: false` on the schema root with `x-` prefix escape hatch prevents schema drift while allowing extensions
- `platform_hints` is deliberately untyped — each platform defines its own sub-schema, this spec does not constrain them
- `constraints` separated from `values` to distinguish what an agent cares about from what it won't do

---

*Spec created by [Anton Agafonov](https://agenturo.app). Contributions welcome.*
