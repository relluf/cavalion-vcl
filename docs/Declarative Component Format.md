* `inherits` can refer to a component-class or a component(-prototype)
* `inherits` can refer to a "inherited"-component
	* `#button-calculate` - specific calculation example
* `inherits` can be implicit ("")
* `inherits` can be specialized automatically by <>

### Concepts

* Factory: source, uri, root component, specializer, 
* Component: properties, children, parent, owner, name
* Component.query: qs(), qsa(), ud(), udr(), ...


# Declarative Component Format

Cavalion allows defining UI trees using **JavaScript arrays** that are parsed into live components by `Factory.parse`. This format supports **shorthand syntax**, **nesting**, and **metadata injection**, and is parsed at runtime into full component objects.

### Core Syntax

The declarative syntax supports several variations, all eventually parsed into this full form:

> ```js
{
	inherits: ["vcl/ui/Panel"],  // or: className: "vcl/ui/Panel"
	name: "mainPanel",
	properties: { align: "client", css: "background: red;" },
	children: [ /* ... nested components ... */ ]
}


#### Common shorthand

> ```js
["vcl/ui/Panel", "mainPanel", { align: "client" }, [
	["vcl/ui/Button", "myButton", { content: "Click me!" }]
]]

Is parsed into:

> ```js
{
	inherits: ["vcl/ui/Panel"],
	name: "mainPanel",
	properties: { align: "client" },
	children: [
		{
			inherits: ["vcl/ui/Button"],
			name: "myButton",
			properties: { content: "Click me!" },
			children: []
		}
	]
}

### How parsing works

#### In `vcl/Factory.parse.js` and `blocks/Factory.parse.js`:

* Both define a recursive parser function `$()` that:

  * Normalizes input like `["Class", "name", { props }, [ children ]]`
  * Defaults missing fields (`name`, `properties`, `children`)
  * Converts short strings like `"vcl-panel"` into full `"vcl/ui/Panel"`
  * Converts `"vcl/ui/Panel#main"` → `className = "vcl/ui/Panel", name = "main"`
  * Supports `"@uri"` syntax (via `PropertyValue`) for lazy-loading properties

#### Blocks factory:

* Adds additional logic for `inherits`, replacing `<>` with real prototype URIs.
* Also supports resolving blocks as base templates.

## Describing VCL Components with Arrays

Cavalion-VCL uses a flexible **array-based declarative syntax** to define components. These arrays are parsed by `vcl/Factory.parse` into a component tree. The parser normalizes various syntaxes into a unified structure.

### Supported Formats

#### 1. Full object structure (normalized form)

```js
{
	inherits: ["vcl/ui/Button"],
	name: "button-save",
	properties: { content: "Save", align: "left" },
	children: []
}
```

This is the canonical form resulting from parsing.

#### 2. Shorthand array form

```js
["vcl/ui/Button", "button-save", { content: "Save" }]
```

This gets expanded to the full object above. Fields can be omitted:

```js
["vcl/ui/Panel"]                // Only inherits
["vcl/ui/Panel", "main"]        // Inherits and name
["vcl/ui/Panel", { align: "top" }]  // Inherits and properties
```

#### 3. Children as fourth parameter

```js
["vcl/ui/Panel", "main", { align: "client" }, [
	["vcl/ui/Label", "label-status", { content: "Status" }]
]]
```

This represents a nested component tree.

#### 4. Only children (used for inheritance cases)

```js
[["vcl/ui/Label", "label1"], ["vcl/ui/Label", "label2"]]
```

This is interpreted as children of a root panel when no explicit root is defined. The parser wraps this in a root component.

#### 5. Special string-based syntax (less common)

```js
["vcl/ui/Panel#main"]
```

Is split into:

* `className`: `"vcl/ui/Panel"`
* `name`: `"main"`

Also supported:

* `"@some/uri"` → a `PropertyValue` (lazy-resolved)
* `"vcl-panel"` → shorthand expanded to `vcl/ui/Panel`

## The Root Component

In `Factory.parse.js`, the **root-component** is the **top-level component** of the resulting UI tree. It is the entry point that wraps or defines the rest of the hierarchy.

### Responsibilities of the root component:

* Owns the component tree (via `.children`)
* Defines the context for inherited prototypes or classes
* Provides `uri`, `inherits`, and optionally a `className`

### Automatic root wrapping

If the source is a list of children (i.e., an array of arrays), the factory will automatically wrap them in a root component of class `vcl/Component` or another default.

Example:

```js
// This is not a complete component
[
	["vcl/ui/Button", "btn-1"],
	["vcl/ui/Button", "btn-2"]
]
```

→ Is wrapped as:

```js
{
	inherits: ["vcl/Component"],
	children: [
		{ inherits: ["vcl/ui/Button"], name: "btn-1", properties: {} },
		{ inherits: ["vcl/ui/Button"], name: "btn-2", properties: {} }
	]
}
```

This wrapper becomes the **root**.

## Summary

| Form                              | Description                     |
| --------------------------------- | ------------------------------- |
| `["Class"]`                       | Class only                      |
| `["Class", "name"]`               | Class and name                  |
| `["Class", { props }]`            | Class with properties           |
| `["Class", "name", { props }]`    | Full definition                 |
| `["Class", ..., ..., [children]]` | With nested children            |
| `[ [child1], [child2] ]`          | Implicit root wrapping          |
| `@uri` or `#name`                 | Special PropertyValue reference |

The root component ensures the component tree is properly anchored, parsed, and linked to a source URI and inheritance chain.


## Best Practices (Initial Draft)

Here are best practices based on how the parser and component model work:

### Naming

* Use **camelCase** for component `name` fields: `mainPanel`, `submitBtn`.
* Use **meaningful names** for `id`s and `actions` to support `qs`/`ud` querying.

### Structure

* Prefer **flat, readable hierarchies** over deeply nested ones. If logic grows complex, extract nested arrays into separate `.js` files and `require` them.
* Use folders to group component categories (`ui`, `actions`, `forms`, etc.)

### Styling

* Use `css: "..."` for inline styles that override existing class styles.
* Avoid `style: {}` unless dynamically updated in JS.
* For layout, standardize usage: `align: "client"`, `width: 200`, etc.

### Localization

* Wrap visible text using `locale("key")`, e.g., `{ content: locale("save_button") }`
* Store localized strings in a separate dictionary module (e.g., `locale/nl.js`)

### Customization

* Use `vars: {}` to inject configuration into subcomponents
* Use `onLoad`, `onRender`, `onDispatchChildEvent` for lifecycle hooks
* Define `overrides` when extending functionality with existing base components

### Reuse

* Define shared UI fragments (e.g., button toolbars, sidebars) as standalone `.js` blocks and `require()` or `["./SubComponent"]` them into parents.
