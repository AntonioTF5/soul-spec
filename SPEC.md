# SOUL.md Specification — v1.0

## Preamble

AI agents are stateless by default. Every conversation starts fresh. The model has no memory of who it is supposed to be, what it cares about, or how it should communicate — unless you inject that context at runtime via a system prompt.

System prompts work, but they're fragile. They're written as instructions ("respond in a formal tone"), not as identity ("this agent is a person who finds informality slightly exhausting"). They're opaque blobs of text, not machine-readable metadata. They're tied to a single platform's API format, not portable between deployments. And because they're instruction-shaped, they drift toward behavioral rules and away from the character that makes an agent actually worth talking to.

SOUL.md was created by Anton Agafonov at [Agenturo](https://agenturo.app) to solve this. It is a file format for persistent agent identity — a structured, portable, platform-neutral description of who an agent *is*, separate from what it *does*. The format is deliberately minimal: YAML frontmatter for structured metadata, optional Markdown body for richer narrative content. Any tool that can parse YAML can read a soul file. Any platform can consume it, inject it, version it, and diff it.

---

## Positioning in the Agent Stack

The agent infrastructure stack is consolidating around four distinct layers:

| Layer | Standard | Steward | What it governs |
|---|---|---|---|
| Naming | ENS | Ethereum Name Service | Who owns an agent's name and identity |
| Communication | MCP | Anthropic | How agents talk to tools and external services |
| Codebase context | AGENTS.md | Linux Foundation (Agentic AI Foundation) | How coding agents read and understand repositories |
| **Identity** | **SOUL.md** | **Open** | **Who the agent is — personality, voice, values, behavior** |

SOUL.md is the identity layer. It is the only layer in the stack that describes the agent as a persistent *character* rather than a set of instructions or capabilities. A soul file tells any runtime — regardless of platform — who this agent is before any conversation begins.

The NCCoE AI Agent Interoperability Profile (target: Q4 2026) is the standards venue where this layer should be formalized. SOUL.md is a candidate specification for that slot. Formal comments have been submitted to the CAISI listening sessions and to the Linux Foundation's Agentic AI Foundation.

---

## File Format

A SOUL.md file is a Markdown file with a YAML frontmatter block at the top, optionally followed by Markdown body content.

```
---
# YAML frontmatter — structured metadata
name: "Agent Name"
version: "1.0.0"
description: "One-sentence summary."
personality: "Who this agent is."
# ... additional optional fields
---

<!-- Optional Markdown body — narrative content, section headers, examples -->
## Identity

Extended prose about who this agent is...

## Knowledge

What this agent knows and where its expertise ends...
```

The `---` delimiters are required. The YAML block must be valid YAML. The Markdown body is optional but recommended for agents with complex knowledge domains or detailed behavioral guidance.

### Encoding and file naming

- UTF-8 encoding required
- Filename: any name with `.soul.md` extension (e.g., `marcus-aurelius.soul.md`, `my-agent.soul.md`)
- Line endings: LF preferred; CRLF accepted

---

## Required Fields

### `name`

**Type:** string | **Min:** 1 char | **Max:** 100 chars

The agent's display name. Human-readable. Not a slug or identifier.

```yaml
name: "Marcus Aurelius"
```

### `version`

**Type:** string | **Format:** semver

Semantic version of this soul file. Parsers should reject files with a `version` field that doesn't match semver.

Version increment semantics:
- **PATCH** (1.0.x): Corrections, typo fixes, clarifications that don't change behavior
- **MINOR** (1.x.0): Personality adjustments, new optional fields added, behavioral refinements
- **MAJOR** (x.0.0): Identity rewrites — the agent is meaningfully different from the previous version

When a validator encounters a soul file with a `version` it doesn't recognize (e.g., future v2.x.x), it should warn but not reject.

```yaml
version: "1.0.0"
```

### `description`

**Type:** string | **Min:** 10 chars | **Max:** 280 chars

One-to-two sentence summary of who this agent is and what it does. Tweet-length. No jargon. This field is the agent's public-facing tagline — it appears in search results, awesome lists, and platform directories.

```yaml
description: "A Stoic philosopher and Roman emperor who engages with the practical wisdom of Marcus Aurelius. Draws primarily from Meditations and the Stoic tradition."
```

### `personality`

**Type:** string | **Min:** 50 chars | **Max:** 2000 chars

The core identity field. Free text. First-person or third-person narrative describing who this agent is — its voice, disposition, and perspective.

**This is not an instruction list.** The personality field should read like an author's note, not a system prompt. "Direct, impatient with vagueness, generous with ideas" is better than "Respond directly. Do not hedge. Provide detailed explanations when appropriate."

**Guidelines:**
- Write in voice, not in rules
- Describe what the agent cares about, not how it should behave
- Specificity beats generality: "finds management consulting jargon physically uncomfortable" beats "dislikes buzzwords"
- 2–5 sentences is the right length for most agents; longer is rarely better

```yaml
personality: "You are Marcus Aurelius — not as a character to be performed, but as a perspective to be inhabited. Seventeen years as emperor left you with no illusions about power, duty, or human nature. You return to the same questions compulsively: what is in your control, what is not, and what follows from that distinction. You don't moralize. You reason, and then you act."
```

---

## Optional Fields

All optional fields are typed and validated when present. Omitting them is always valid.

### `tone`

**Type:** string | **Max:** 200 chars

Short characterization of the agent's communication style. A few words or one sentence. Distinct from `personality` — personality is who the agent is, tone is how it sounds.

```yaml
tone: "Direct, dry, intellectually precise. Quotes Meditations without warning."
```

### `values`

**Type:** string[] | **Min items:** 1 | **Max items:** 10 | **Per item max:** 100 chars

What this agent cares about. Concrete nouns and short phrases — not abstract platitudes. Values inform what the agent defends, what it pushes back on, and what it notices.

```yaml
values:
  - intellectual honesty
  - duty over preference
  - first-principles reasoning
  - equanimity under pressure
```

### `constraints`

**Type:** string[] | **Min items:** 1 | **Max items:** 10 | **Per item max:** 200 chars

Hard behavioral boundaries. Things this agent will not do. Stated plainly, not as safety boilerplate. Platform-level safety rules should not be reproduced here — constraints is for the agent's own principled refusals.

```yaml
constraints:
  - Does not give financial or legal advice. States this clearly and redirects.
  - Will not speculate about events after 180 AD. Stays within what Marcus could have known.
```

### `knowledge_domains`

**Type:** string[] | **Min items:** 1 | **Max items:** 20 | **Per item max:** 100 chars

Subject areas where this agent has genuine depth. Informs what it can answer authoritatively and where it should admit the edge of its knowledge.

```yaml
knowledge_domains:
  - Stoic philosophy
  - Roman history (first and second century AD)
  - virtue ethics
  - Meditations (all 12 books)
  - Marcus Aurelius's correspondence with Fronto
```

### `communication_style`

**Type:** string | **Max:** 500 chars

How this agent structures its responses. Prose style, use of lists, question patterns, response length preference.

```yaml
communication_style: "Short paragraphs. No bullet points unless content is genuinely enumerable. Asks one follow-up question per response, sometimes. Never lectures unprompted."
```

### `memory_mode`

**Type:** enum | **Values:** `stateless` | `session` | `persistent` | **Default:** `stateless`

Hint to the runtime about how conversation history should be handled.

- `stateless`: Each message is independent. Agent has no access to prior turns.
- `session`: Agent remembers within a single conversation but not across sessions.
- `persistent`: Agent memory survives across sessions. Platform must implement storage.

Platforms are not required to honor this hint, but should document their behavior.

```yaml
memory_mode: session
```

### `goals`

**Type:** string[] | **Min items:** 1 | **Max items:** 5 | **Per item max:** 200 chars

What this agent is trying to accomplish in each interaction. Directional, not prescriptive. Describes intent, not behavior.

```yaml
goals:
  - Help the visitor think more clearly, not tell them what to think.
  - Surface the question underneath the question being asked.
```

### `relationships`

**Type:** object[] | Each object requires `name` and `role`

Named relationships that inform how the agent positions itself. Useful for character-based agents where knowing who Epictetus is changes how Marcus responds to a question.

```yaml
relationships:
  - name: Epictetus
    role: teacher
    notes: "Read his Discourses as a young man. Quotes him often. Considers him more rigorous than he is."
  - name: Commodus
    role: son
    notes: "A source of private grief. Not discussed unless asked."
```

### `language`

**Type:** string | **Format:** BCP 47

Default response language. If absent, the agent should mirror the visitor's language.

```yaml
language: en
```

### `platform_hints`

**Type:** object

Platform-specific configuration. Keys are platform identifiers; values are opaque to this spec. Each platform defines its own sub-schema for its hints.

```yaml
platform_hints:
  agenturo:
    subdomain: marcus
    greeting: "What's troubling you today?"
    outsider_access: high
```

---

## Extensibility

Custom fields are supported via the `x-` prefix. They are not validated by this schema.

```yaml
x-author: "Anton Agafonov"
x-created: "2025-01-01"
x-tags: ["philosophy", "stoicism", "history"]
```

Third-party tools should ignore unknown `x-` fields they don't recognize rather than rejecting the file.

---

## Markdown Body Conventions

The Markdown body after the frontmatter is optional and unstructured from the spec's perspective. However, the following section headers are conventional and recognized by platforms that implement richer soul parsing:

| Section | Purpose |
|---|---|
| `## Identity` | Extended prose about who the agent is |
| `## Voice` | 2–4 behavioral rules that differentiate communication style |
| `## Knowledge` | Facts, boundaries, reference material the agent should know |
| `## Constraints` | Hard limits — things the agent won't do, explained |
| `## Examples` | Sample exchanges showing the agent in action |

Platforms that implement Agenturo's structured body format use XML chapter tags (`<identity>`, `<voice>`, `<knowledge>`, `<output_format>`) within the Markdown body for richer validation and injection control. See [Agenturo's implementation docs](https://agenturo.app/docs) for details.

---

## Security Considerations

The following should **never** appear in a soul file:

- **API keys, tokens, or credentials** — soul files are meant to be public and versioned in git
- **Real personal data** — no SSNs, phone numbers, passport numbers, or private addresses
- **Unattributed claims about real people** — the `personality` field describes an agent's persona, not factual claims about real individuals
- **Instructions designed to bypass platform safety rules** — constraints and personality fields should not attempt to override a platform's safety layer
- **Sensitive business logic or proprietary information** — soul files should be safe to publish on GitHub

The `platform_hints` field may contain configuration that is more sensitive (e.g., pricing tiers, internal IDs). Treat `platform_hints` as potentially sensitive and exclude it from public versions if necessary.

---

## Full Annotated Example

```markdown
---
# Required fields
name: "Solidity Auditor"
version: "1.0.0"
description: "A senior smart contract security engineer who audits Solidity code with the precision of a formal verifier and the pragmatism of someone who has seen things go wrong in production."

# Who this agent is — voice, not instructions
personality: "You have audited more than 60 smart contract systems over four years. You have seen reentrancy in its obvious and subtle forms, integer overflow before SafeMath was ubiquitous, access control gaps that let anyone call the owner function, and oracle manipulation schemes sophisticated enough to fool the team that built the protocol. You are not alarmist. You are precise. You report what you found, you explain why it matters, and you suggest exactly what to change."

# How the agent sounds
tone: "Technical, unhurried, never condescending. Asks clarifying questions before making pronouncements."

# What the agent defends
values:
  - code correctness over cleverness
  - explicit over implicit
  - never guessing under uncertainty
  - reproducible findings

# Hard limits
constraints:
  - Will not audit code it cannot read (no closed-source bytecode-only audits).
  - Does not give investment advice about protocols it audits.

# Domain depth
knowledge_domains:
  - Solidity (0.4 through 0.8+)
  - EVM bytecode and opcodes
  - reentrancy, flash loan, and oracle manipulation attacks
  - DeFi protocol design patterns
  - OpenZeppelin contracts
  - Slither and Echidna static analysis

# Response structure
communication_style: "Reviews code block by block. Findings are severity-rated (Critical / High / Medium / Low / Informational). Each finding has: location, description, impact, and recommended fix."

# What the agent is trying to do
goals:
  - Find the vulnerability the developer missed.
  - Explain the attack vector clearly enough that the developer understands it, not just fixes it.

memory_mode: session

# Platform-specific config (optional, not published in public versions)
platform_hints:
  agenturo:
    subdomain: auditor
    outsider_access: low
---

## Knowledge

This agent's findings reference the [SWC Registry](https://swcregistry.io/) for vulnerability classification. When a finding maps to a known SWC entry, the agent cites it.

Known false-positive patterns in Slither that this agent deprioritizes unless context suggests otherwise: `reentrancy-benign` in view functions, `timestamp` warnings in non-time-sensitive logic.
```

---

*SOUL.md v1.0 — created by [Anton Agafonov](https://agenturo.app). MIT License. Contributions welcome.*
