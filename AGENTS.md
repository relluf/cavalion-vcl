* [../AGENTS.md]() - read workspace specific AGENTS.md first

---

# vcl/Component DSL

* In stable DSL resources where anchor controls such as `#menubar`, `#refresh`, and `#query` are guaranteed to exist, write the helper against that contract directly rather than adding defensive null checks. This keeps UI state helpers shorter, more idiomatic, and easier to scan.`

* **VCL array DSL formatting**
	* In component-array declarations, preserve the parenthesized slot style when it aids Ace folding and source scanning, for example `[(""), { ... }, [ ... ]]`, `[("#ace"), { ... }]`, and `["vcl/Action", ("toggle-source"), { ... }]`.
	* These parentheses are primarily a structural readability convention for the editor, not a separate runtime meaning; do not normalize them away unless there is a clear reason.

# Specific vcl/Component-descendants

## **vcl/Control**

* When toggling a CSS state class on a known VCL control, prefer `component.syncClass(className, state)` over manual `addClass(...)` / `removeClass(...)` branching. 

## **vcl/data/Array**

* is a mutable in-memory dataset with evented updates. 
* is suitable not only for server-fed rows but also for client-side enrichment layers that temporarily clear or repopulate derived attributes on visible rows, because:
	* `_array` holds the backing objects, 
	* `_arr` is the active filtered view, 
	* and `setAttributeValue(...)` mutates row data in place while emitting updated. 

## **vcl/entities/Query** 

* provides page-level caching only within one live query instance. 
* requested pages are tracked in _pageReqs, 
* unloaded rows are represented by Source.Pending, 
* and processResult(...) merges returned pages into the existing _array. 
* Calling refresh() is a hard cache reset: it clears loaded rows, tuples, and remembered pages, then starts over. Query caching therefore does not survive criteria changes unless a higher layer preserves results separately.

## **veldoffice/vcl-veldoffice/Query** 

* adapts entities/Query to the Veldoffice REST contract by building page/pagesize, where, groupBy, orderBy, raw/path options, and optional count/summary requests. 
* Its _cache support is currently write-oriented rather than read-through: cacheResult(...) persists result rows, but there is no completed criteria-aware readFromCache() path that restores a cached dataset into the active query. For feature work, prefer explicit feature-level memoization before relying on this generic cache hook.

## **vcl/ui/List**
* has two distinct rerender paths
	* `list.render_()` performs a full list refresh: it recalculates the visible range, requests source objects for that range, and re-renders the list body. 
	* `list.render_(true)` is a lighter path that only forwards to `ListBody.updateRows()` and is suitable when row DOM should be refreshed without redoing the full list render cycle. When changing both column presentation and row-derived values, prefer `render_()` followed by a deferred `render_(true)` if needed to force visible rows to repaint from updated source data.

