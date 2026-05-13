## Naming Conventions

* **Use kebab-case**: lowercase words separated by dashes.
* **Prefix with component type**: e.g. `button-close`, `input-username`, `tab-editor`.
* **Be specific and semantic**: avoid `button1`, prefer `button-generate`.
* **Avoid underscores and camelCase**: stick to `input-sample-id`, not `input_sampleId`.
* **Consistent structure**: `[type]-[purpose]-[modifier]` (modifier optional).
* **Names should be easily queryable**: via `qs()` or `ud()` in code.

Standardized names improve clarity, maintainability, and tooling support in Cavalion’s declarative UI framework.


### General Pattern

Component names follow the pattern:

```
[type]-[specific-purpose]-[optional-modifier]
```

This structure provides clarity, supports query-based access via `qs()` or `ud()`, and ensures semantic meaning.

### Examples

| Type     | Name               | Meaning                                   |
| -------- | ------------------ | ----------------------------------------- |
| `button` | `button-close`     | A button intended to close something      |
| `input`  | `input-username`   | Input field for username                  |
| `group`  | `group-failure`    | A logical group of related UI elements    |
| `tab`    | `tab-measurements` | A tab control labeled “Measurements”      |
| `select` | `select-sample-1`  | A dropdown for selecting the first sample |

---

### Guidelines

#### 1. Casing and separators

* Use **kebab-case** (lowercase with dashes)
* Avoid underscores (`_`) or camelCase
* Keep naming consistent across modules

#### 2. Type-prefixing

Prefix names with the **component type** (e.g., `button-`, `group-`, `input-`) to:

* Improve readability
* Support filtering and pattern matching
* Prevent naming collisions

#### 3. Specificity

* Use clear, purpose-based identifiers (`button-generate`, `input-stage-index`)
* Avoid ambiguous or generic names (`button1`, `tab1`, etc.)

#### 4. Modifiers

* Append modifiers if needed to indicate context or variation
* Examples: `input-weight-readonly`, `tab-config-alt`

