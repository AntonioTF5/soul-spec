# SOUL.md Governance

This document describes how the SOUL.md specification project is governed: who makes decisions, how changes to the spec are proposed and accepted, and how the project evolves over time.

SOUL.md is proposed for hosting under the [Agentic AI Foundation (AAIF)](https://aaif.io). Upon acceptance, this governance will be updated to reflect LF Minimum Viable Governance with a Technical Steering Committee.

---

## Roles

### Contributors

Anyone who opens an issue, submits a pull request, participates in spec discussions, or adds a soul file to the community list. No formal process to become a contributor — just show up and contribute.

### Maintainers

Maintainers have write access to the repository. They review and merge pull requests, triage issues, and enforce the contribution process documented in [CONTRIBUTING.md](CONTRIBUTING.md).

Responsibilities:
- Review PRs within a reasonable time (target: 7 days for examples, 14 days for spec changes)
- Enforce the spec-change issue-before-PR requirement
- Uphold the schema validation standard — no PR that breaks existing `.soul.md` files is merged without a migration guide
- Participate in decisions about spec direction

Current maintainers:

| Name | GitHub | Affiliation |
|---|---|---|
| Anton Agafonov | [@AntonioTF5](https://github.com/AntonioTF5) | Agenturo |

### Project Lead

The Project Lead holds final decision authority when maintainer consensus cannot be reached. They are responsible for the project's overall direction and for stewarding SOUL.md in the interest of the open community — not any single organization.

Current Project Lead: Anton Agafonov ([@AntonioTF5](https://github.com/AntonioTF5))

The Project Lead role transfers to a Technical Steering Committee upon AAIF onboarding.

---

## Spec Change Process

The SOUL.md specification uses a lightweight RFC process. All spec changes — new fields, field modifications, behavioral changes, or schema updates — follow this path:

1. **Open an issue** using the [spec-change template](https://github.com/AntonioTF5/soul-spec/issues/new?template=spec-change.md). Include:
   - The field name or behavior being changed
   - A real use case (not hypothetical)
   - Whether the change is backward-compatible with v1.x
   - What the JSON schema change looks like

2. **Discussion period** — at least 7 days for backward-compatible changes, 14 days for breaking changes. Community members and maintainers comment on the issue.

3. **Pull request** — after the discussion period, open a PR referencing the issue. The PR must include updates to `SPEC.md`, `schema/soul.schema.json`, and at least one updated or new example file.

4. **Review and merge** — requires approval from at least one maintainer. Breaking changes require Project Lead approval.

### What counts as a breaking change

A breaking change is any modification that causes a previously valid `.soul.md` file to fail schema validation, or that changes the semantics of an existing required field. Breaking changes require:
- A major version bump (`x.0.0`)
- A migration guide in `CHANGELOG.md`
- A 14-day discussion period

---

## Version Policy

SOUL.md follows [Semantic Versioning](https://semver.org/):

| Increment | When to use |
|---|---|
| **PATCH** (1.0.x) | Corrections, typo fixes, clarifications that do not change behavior |
| **MINOR** (1.x.0) | New optional fields, backward-compatible behavioral refinements |
| **MAJOR** (x.0.0) | Removing or renaming required fields, changing field types, breaking schema changes |

Version bumps are decided by maintainers as part of the merge process. The changelog entry is required before a release is tagged.

---

## Decision-Making

**Day-to-day decisions** (example PRs, validator bug fixes, documentation) are made by any maintainer via approval and merge.

**Spec changes** follow the RFC process above. Maintainers aim for consensus in the issue thread. If consensus is not reached after the discussion period, the Project Lead makes the final call.

**Major directional decisions** (field deprecation, new required fields, format-level changes) require:
1. A GitHub issue open for at least 14 days
2. Explicit approval from the Project Lead
3. Public announcement in the issue and CHANGELOG.md

---

## Becoming a Maintainer

Maintainers are nominated based on sustained, high-quality contributions — not employer affiliation. There is no minimum contribution count; the criterion is demonstrated judgment and alignment with the project's values.

**Nomination process:**
1. Any existing maintainer nominates a contributor by opening a GitHub issue titled `Maintainer nomination: [GitHub handle]`
2. Existing maintainers discuss for 7 days
3. No objections from any maintainer + Project Lead approval = merged into this file
4. New maintainer is granted write access to the repository

**Removing a maintainer:** Maintainers inactive for 6+ months or who act contrary to the project's interests may be moved to emeritus status. The Project Lead makes this decision after a good-faith attempt to re-engage the maintainer.

---

## AAIF Relationship

SOUL.md is proposed for hosting under the Agentic AI Foundation (AAIF / Linux Foundation). Upon acceptance:

- Project trademarks and assets transfer to the Linux Foundation
- This governance document will be updated to adopt LF Minimum Viable Governance
- The Project Lead role will transition to a Technical Steering Committee with representation from at least two independent organizations
- A formal committer acceptance process (OWNERS.md) will be added

Until that transfer is complete, this document governs the project.

---

## Amendments

Changes to this document follow the same spec-change process: open an issue, 14-day discussion, maintainer consensus, Project Lead approval.

---

*Governance established April 2026. Maintained by the SOUL.md maintainers.*
