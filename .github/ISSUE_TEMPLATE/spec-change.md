---
name: Spec change proposal
about: Propose adding, modifying, or removing a field in the SOUL.md specification
title: "spec: [field name] — [brief description]"
labels: spec
---

## Field name

<!-- The field being added, changed, or removed -->

## Type of change

- [ ] New optional field
- [ ] New required field (breaking — requires major version bump)
- [ ] Modify existing field type or constraints
- [ ] Remove field (breaking — requires major version bump)
- [ ] Behavior change (no field change)

## Problem this solves

<!-- Describe the real use case. What can't you do today because this field doesn't exist? -->

## Proposed specification

<!-- Show the field definition as it would appear in SPEC.md.
Include type, max length, allowed values, and a usage example. -->

```yaml
# Example:
field_name:
  type: string
  maxLength: 200
  description: "..."
  example: "..."
```

## JSON Schema change

<!-- Show the addition to soul.schema.json: -->

```json
"field_name": {
  "type": "string",
  "maxLength": 200,
  "description": "..."
}
```

## Backward compatibility

<!-- Is this backward-compatible with existing v1.x soul files?
- New optional field: yes, compatible (no version bump required)
- New required field: no, breaking change (major version bump)
- Changed constraint (e.g., stricter maxLength): no, breaking
- Changed constraint (e.g., looser maxLength): yes, compatible
-->

## Alternatives considered

<!-- What else could solve this? Why is this the right approach? -->
