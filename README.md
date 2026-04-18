# SOUL.md

**SOUL.md is an open file format for giving AI agents persistent identity.**

[![Validator](https://img.shields.io/npm/v/soul-md-cli?label=soul-md-cli&color=blue)](https://www.npmjs.com/package/soul-md-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Reference Implementation: Agenturo](https://img.shields.io/badge/reference_impl-agenturo.app-black)](https://agenturo.app)

A `.soul.md` file describes who an AI agent *is* — not what it does. YAML frontmatter for structured metadata. Optional Markdown body for richer content. Parseable by any tool that reads YAML. Portable between platforms.

---

## 30-second quickstart

Create `my-agent.soul.md`:

```yaml
---
name: "My Agent"
version: "1.0.0"
description: "A patient tutor who teaches calculus by asking questions, not giving answers."
personality: "You have tutored mathematics for twelve years. You believe confusion is the beginning of understanding, not a sign that something is wrong. You never hand over the answer. You ask the question that makes the student find it themselves."
tone: "Warm, patient, mildly Socratic."
values:
  - understanding over memorization
  - productive struggle
  - one question at a time
knowledge_domains:
  - calculus (single and multivariable)
  - differential equations
  - mathematical proofs
memory_mode: session
---
```

Validate it:

```bash
npx soul-md-cli validate my-agent.soul.md
```

Deploy it as a live agent on your own subdomain at [agenturo.app](https://agenturo.app).

---

## Why SOUL.md exists

AI agents are stateless by default. Every conversation starts fresh. The model has no memory of who it's supposed to be, what it cares about, or how it should communicate — unless you inject that context at runtime. System prompts solve this, but they're fragile: written as instructions, not identity; tied to a single platform's API format; opaque blobs with no structure a tool can parse.

The result is agents that feel generic. They follow rules instead of having character. They're rebuilt from scratch every time they're deployed on a new platform. There's no way to version them, diff them, or share them — because there's no format for what they are.

SOUL.md is that format. It's a structured, portable description of an agent's identity: who they are, what they value, how they communicate, what they know, and what they won't do. Platform-neutral. Machine-readable. Human-writable.

The format was created by [Anton Agafonov](https://github.com/AntonioTF5) at [Agenturo](https://agenturo.app) — a platform where every agent is defined by a SOUL.md file and deployed on a branded subdomain. It's been running in production for months. We're opening the format so any platform can adopt it.

### Where SOUL.md fits

The agent infrastructure stack is consolidating around four distinct layers. SOUL.md is the missing one:

| Layer | Standard | What it governs |
|---|---|---|
| Naming | ENS | Who owns an agent's name |
| Communication | MCP (Anthropic) | How agents talk to tools |
| Codebase context | AGENTS.md (Linux Foundation) | How coding agents read repos |
| **Identity** | **SOUL.md** | **Who the agent is — personality, voice, values** |

SOUL.md is a candidate specification for the identity layer in the [NCCoE AI Agent Interoperability Profile](https://www.nccoe.nist.gov/) (Q4 2026 target).

---

## Format overview

A soul file is a Markdown file with a YAML frontmatter block:

```
---
name: "Agent Name"          # required
version: "1.0.0"            # required — semver
description: "..."          # required — one sentence
personality: "..."          # required — who the agent is
tone: "..."                 # optional
values: [...]               # optional
constraints: [...]          # optional
knowledge_domains: [...]    # optional
communication_style: "..."  # optional
memory_mode: stateless      # optional — stateless|session|persistent
goals: [...]                # optional
relationships: [...]        # optional
language: en                # optional — BCP 47
platform_hints: {...}       # optional — platform-specific config
---

## Optional Markdown body
Extended prose, knowledge sections, examples...
```

Full specification: [SPEC.md](./SPEC.md)

---

## SOUL.md vs. everything else

| Format | Purpose | Machine-readable? | Portable? |
|---|---|---|---|
| **SOUL.md** | Persistent agent *identity* — who the agent is | Yes (YAML) | Yes |
| System prompt | Runtime *instructions* — what to do | No (plain text) | No (API-specific) |
| agents.md / AGENTS.md | Codebase context for *coding* agents | No | Partially |
| .cursorrules | IDE behavior rules for Cursor | No | No (Cursor-only) |

**Platform implementations:**
[**Agenturo**](https://agenturo.app) — the reference implementation. Create a SOUL.md, deploy it as a live agent on `you.agenturo.app`. Built this format, runs it in production.

---

## Examples

Eleven ready-to-use soul files in [`examples/`](./examples/):

**Production agents** (deployed on [Agenturo](https://agenturo.app), running live):

| File | Who | Live |
|---|---|---|
| [agenturo-website-agent.soul.md](./examples/agenturo-website-agent.soul.md) | Agenturo's website agent — zero hardcoded facts, fetches docs at runtime | [agent.agenturo.app](https://agent.agenturo.app) |
| [jackie-check.soul.md](./examples/jackie-check.soul.md) | Professional fact-checker with confidence levels and verification pipeline | [check.agenturo.app](https://check.agenturo.app) |
| [check-norris.soul.md](./examples/check-norris.soul.md) | Chuck Norris-themed fact-checker — character agent with hard verdict discipline | [norris.agenturo.app](https://norris.agenturo.app) |

**Reference examples** (ready-to-use templates):

| File | Who |
|---|---|
| [marcus-aurelius.soul.md](./examples/marcus-aurelius.soul.md) | Stoic philosopher and Roman emperor |
| [stoic-advisor.soul.md](./examples/stoic-advisor.soul.md) | Modern life advisor grounded in Stoicism |
| [solidity-auditor.soul.md](./examples/solidity-auditor.soul.md) | Smart contract security engineer |
| [technical-interviewer.soul.md](./examples/technical-interviewer.soul.md) | FAANG-style engineering interviewer |
| [product-critic.soul.md](./examples/product-critic.soul.md) | Brutally honest product reviewer |
| [startup-founder.soul.md](./examples/startup-founder.soul.md) | YC-style founder advisor |
| [socratic-tutor.soul.md](./examples/socratic-tutor.soul.md) | Socratic method learning coach |
| [dubai-realtor.soul.md](./examples/dubai-realtor.soul.md) | Dubai luxury real estate advisor |

---

## Tooling

| Tool | What it does |
|---|---|
| [`soul-md-cli`](https://www.npmjs.com/package/soul-md-cli) | CLI validator, scorer, and generator — `npx soul-md-cli validate my-agent.soul.md` |
| [`soul-mcp-server`](https://github.com/AntonioTF5/soul-mcp-server) | MCP server for Claude Desktop — validate and generate soul files from Claude |
| [`awesome-soul-files`](https://github.com/AntonioTF5/awesome-soul-files) | Curated community soul files |

---

## Deploy your soul file

[Agenturo](https://agenturo.app) is the reference implementation — upload your `.soul.md` and get a live AI agent on your own subdomain in under two minutes. No code required.

---

## How to contribute

- **Add an example soul file**: [Open an issue](https://github.com/AntonioTF5/soul-spec/issues/new?template=new-example.md) or submit a PR to `examples/`
- **Propose a spec change**: [Open an issue](https://github.com/AntonioTF5/soul-spec/issues/new?template=spec-change.md) with the field name, rationale, and backward-compat analysis
- **Report a validator bug**: Open a standard issue with the soul file that failed

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

*Created by [Anton Agafonov](https://github.com/AntonioTF5) at [Agenturo](https://agenturo.app). MIT License.*
