#!/usr/bin/env node
/**
 * validate.js — SOUL.md file validator
 *
 * Usage:
 *   node validate.js <file.soul.md>
 *   node validate.js <file.soul.md> --json
 *
 * Exit codes:
 *   0 — validation passed
 *   1 — validation failed or file not found
 *
 * Dependencies: ajv, js-yaml (install with: npm install ajv js-yaml)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Inline schema (copy of schema/soul.schema.json) ─────────────────────────
const SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version", "description", "personality"],
  "additionalProperties": false,
  "properties": {
    "name": { "type": "string", "minLength": 1, "maxLength": 100 },
    "version": {
      "type": "string",
      "pattern": "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"
    },
    "description": { "type": "string", "minLength": 10, "maxLength": 280 },
    "personality": { "type": "string", "minLength": 50, "maxLength": 2000 },
    "tone": { "type": "string", "maxLength": 200 },
    "values": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 100 },
      "minItems": 1, "maxItems": 10
    },
    "constraints": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 200 },
      "minItems": 1, "maxItems": 10
    },
    "knowledge_domains": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 100 },
      "minItems": 1, "maxItems": 20
    },
    "communication_style": { "type": "string", "maxLength": 500 },
    "memory_mode": { "type": "string", "enum": ["stateless", "session", "persistent"] },
    "goals": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 200 },
      "minItems": 1, "maxItems": 5
    },
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "role"],
        "additionalProperties": false,
        "properties": {
          "name": { "type": "string" },
          "role": { "type": "string" },
          "notes": { "type": "string" }
        }
      }
    },
    "language": {
      "type": "string",
      "pattern": "^[a-z]{2}(-[A-Z]{2})?$"
    },
    "platform_hints": { "type": "object", "additionalProperties": true }
  },
  "patternProperties": {
    "^x-": {}
  }
};

const OPTIONAL_FIELDS = [
  'tone', 'values', 'constraints', 'knowledge_domains',
  'communication_style', 'memory_mode', 'goals', 'relationships',
  'language', 'platform_hints'
];

// ─── ANSI colors (no external dep) ───────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};

function color(str, ...codes) {
  if (process.env.NO_COLOR || !process.stdout.isTTY) return str;
  return codes.join('') + str + c.reset;
}

// ─── YAML frontmatter parser ──────────────────────────────────────────────────
function parseFrontmatter(content) {
  // Strip leading HTML comments (e.g., <!-- ... -->) before looking for ---
  const stripped = content.replace(/^<!--[\s\S]*?-->\s*/m, '').trimStart();
  const match = stripped.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error('No YAML frontmatter found. File must start with --- delimiters (optionally preceded by an HTML comment).');
  }
  return match[1];
}

// ─── Completeness score ───────────────────────────────────────────────────────
function computeScore(data) {
  const filled = OPTIONAL_FIELDS.filter(f => data[f] !== undefined && data[f] !== null);
  const score = Math.round((filled.length / OPTIONAL_FIELDS.length) * 100);
  const missing = OPTIONAL_FIELDS.filter(f => data[f] === undefined || data[f] === null);
  return { score, filled, missing };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const filePath = args.find(a => !a.startsWith('--'));

  if (!filePath) {
    const msg = 'Usage: node validate.js <file.soul.md> [--json]';
    if (jsonMode) {
      process.stdout.write(JSON.stringify({ error: msg }) + '\n');
    } else {
      console.error(color(msg, c.yellow));
    }
    process.exit(1);
  }

  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    const msg = `File not found: ${absPath}`;
    if (jsonMode) {
      process.stdout.write(JSON.stringify({ error: msg, pass: false }) + '\n');
    } else {
      console.error(color('✗ ' + msg, c.red, c.bold));
    }
    process.exit(1);
  }

  const content = fs.readFileSync(absPath, 'utf8');

  // Parse YAML frontmatter
  let yaml;
  try {
    yaml = require('js-yaml');
  } catch (_) {
    console.error(color('Missing dependency: npm install js-yaml', c.red));
    process.exit(1);
  }

  let data;
  let frontmatterRaw;
  try {
    frontmatterRaw = parseFrontmatter(content);
    data = yaml.load(frontmatterRaw);
  } catch (err) {
    const result = { pass: false, file: filePath, errors: [{ message: err.message }], score: 0 };
    if (jsonMode) {
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    } else {
      console.error(color('✗ Parse error: ', c.red, c.bold) + err.message);
    }
    process.exit(1);
  }

  if (!data || typeof data !== 'object') {
    const result = { pass: false, file: filePath, errors: [{ message: 'Frontmatter parsed as empty or non-object.' }], score: 0 };
    if (jsonMode) {
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    } else {
      console.error(color('✗ Frontmatter is empty or not a YAML object.', c.red, c.bold));
    }
    process.exit(1);
  }

  // Schema validation
  let Ajv;
  try {
    Ajv = require('ajv');
  } catch (_) {
    console.error(color('Missing dependency: npm install ajv', c.red));
    process.exit(1);
  }

  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
  const validate = ajv.compile(SCHEMA);
  const valid = validate(data);

  const { score, filled, missing } = computeScore(data);

  const errors = valid ? [] : (validate.errors || []).map(e => ({
    field: e.instancePath ? e.instancePath.replace(/^\//, '') : (e.params && e.params.missingProperty) || 'root',
    message: e.message,
    value: e.data
  }));

  const result = {
    pass: valid,
    file: filePath,
    name: data.name,
    version: data.version,
    errors,
    score,
    score_detail: {
      filled_optional: filled,
      missing_optional: missing,
      total_optional: OPTIONAL_FIELDS.length
    }
  };

  if (jsonMode) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(valid ? 0 : 1);
  }

  // Human-readable output
  const filename = path.basename(filePath);

  if (valid) {
    console.log(color(`\n✓ PASS  ${filename}`, c.green, c.bold));
  } else {
    console.log(color(`\n✗ FAIL  ${filename}`, c.red, c.bold));
  }

  console.log(color('  Agent:   ', c.gray) + (data.name || color('(missing)', c.red)));
  console.log(color('  Version: ', c.gray) + (data.version || color('(missing)', c.red)));

  if (errors.length > 0) {
    console.log(color('\n  Errors:', c.red, c.bold));
    errors.forEach(e => {
      const field = e.field ? color(`[${e.field}]`, c.cyan) : '';
      console.log(`    ${field} ${e.message}`);
    });
  }

  // Completeness score
  const bar = '█'.repeat(Math.round(score / 10)) + '░'.repeat(10 - Math.round(score / 10));
  const scoreColor = score >= 80 ? c.green : score >= 50 ? c.yellow : c.red;
  console.log(color('\n  Completeness:', c.gray) + ' ' + color(`${score}%  ${bar}`, scoreColor));

  if (missing.length > 0) {
    console.log(color('  Missing optional fields: ', c.gray) + missing.join(', '));
  }

  console.log('');
  process.exit(valid ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
