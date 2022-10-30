### 2022/10/30 - 1.1.69

`#VA-20221028-1`, `-2` & `-3`

* ebae088 - lowers SELECT\_TIMEMOUT\_MS for [vcl/ui/Tab(s)](src/ui/Tabs.js)
* 4bd2244 - simplifies ids used in [Component.protoype.nextTick]()()

### 2022/07/28 - 1.1.68

* 768156d - fixes an issue where the vertical scrollbar was not accesible on macOS
* cd60d4b - introduces new methods for vcl/Control: 
	* reflectStates, 
	* makeVisible and 
	* selectVisible 
* cd60d4b - changing some css/rendering details for Tree and Node 

### 2022/07/04 - 1.1.67

* 7dc04fb - adds Component.prototype.getTimeout
* 52bebc9 - introducing Query.prototype.error
* 18cd481 - destroying element upon remove (seems decent)

### 2022/06/27 - 1.1.66

* 07c6e83 - introducing onError event-property

### 2022/06/27 - 1.1.65

* 52c79ea - fixes bug where applyClasses was called without a _node being allocated/available
* 90bba04 - foolproofing rendering (vcl/ui/List) while reseting array during usage - needs performance boost with splice
* 89db212 - tweaking vertical-align

### 2022/06/23 - 1.1.64

* ed814eb - updating
* ca79dd6 - preventDefault when clicked A
* 0e3c6e0 - rendering pending values as -
* d1aeeae - fixes executesAction enum item No -> no
* 2239c5b - cosmetic 

### 2022/05/31 - 1.1.63

* 837510b - fixes document.title bug 
	* [prototypes/ui/forms/Portal](src/:.js)

### 2022/05/02 - 1.1.62

* 4de4125 - Clogging
* 5df5d74 - vcl/data/Array: Fixes filtering huge datasets
* 382d44e - vcl/ui/Tab(s): Rounded corners and darkened background when selected

### 2022/04/25 - 1.1.61

* √ CVLN-20220429-2
* 3a78624 - ui/List: onNodeCreated was triggered while visible=false
* c7288af - prototypes/App<>: further implementing/refactoring App.glassy
* 849fc6c - vcl/Application: Making sure app is #0

### 2022/04/25 - 1.1.60

* Introducing [prototypes/App.glassy](src/:.js)
* Refactoring App-classes

### 2022/04/24 - 1.1.59

* Cosmetic changes, cleaning up dead code

### 2022/04/20 - 1.1.58

* Fix in Control.prototype.dispatchChildEvent - _hoe is het mogelijk na zoveel tijd?!_

### 2022/04/17

* Adding prototypes description to [.md]()

### 2022/04/15 - 1.1.57

* Minor fixes in vcl/Control-style methodes (causing big updates)

### 2022/04/06 - 1.1.54

- **ui/List**: Adding support for UTC to `formatDate()`

### 2022/04/03 - 1.1.53

- **Control**: Introducing `swapClass`

### 2022/03/28 - 1.1.52

* Refactoring animation classes for `glassy-overlay` containers

### 2022/03/22

* **Tabs**: Fixed selectNext() and selectPrevious() **f'n finally!!!**
* **Tabs**: Fixed/finetuned select-timeout-feature

### 2022/02/07 - 1.1.51

* **prototypes/build/Make**: Code generation adjusted to recent refactoring of `blocks/Factory.implicit_sources`
* Adjusted Component.prototype.hook

### 2022/01/30 - 1.1.50

- Extending the methods that can be called on a `Component.prototype.query`-result

### 2022/01/28 

* Fix for `vcl/Component.prototype.set` when called with a single string parameter (parsed by `js.str2obj`)

### 2022/01/22 - 1.1.48

* Removed obsolete files (./vcl-comps/*)
* Adding extra onLoad-event to cavalion-blocks
* Working on prototypes/ui/forms/Home.tree

### 2022/01/18 - 1.1.47

`#CVLN-20220118-1`

* Workaround for weird rendering bug in ui/List

### 2022/01/18 - 1.1.46

* **ui/List**: Adding "ignore-busy" class behaviour
* **ui/List**: Refactoring `groupByColumn(...)` -> `groupBy(column, ...)`
* **ui/List**: Refactoring `render` => `render_` (vcl/Control.prototype.render was not being overridden/nameclashing)


### 2022/01/07 - 1.1.45

* **data/Array**: Fix for `context` parameter in `onFilterObject`-event

### 2022/01/04

- Adding sort-features to ui/List, -Column and -Header

### 2022/01/03 - 1.1.44

* Adding `context` parameter to Array:onFilterObject-event, which can be used as a cache for a specific filter context (updateFilter-call)
* Introducing List.prototype.**valueByColumnAndRow** - used to obtain the value that will be rendered (useful for inline filtering)

### 2021/12/29 - 1.1.43

- Styling glassy-overlays with text-shadow
- **ui/Tabs**: Fixing styling bug
- **ui/List**: Introducing `groupByColumn()`
- **data/Query**: `requestPage()` now returns a Promise

### 2021/12/28 - 1.1.42

- Fix alignment bug `#CVLN-20211228-1` 

### 2021/12/17 - 1.1.41

* Working around autoWidth bug (ListColumn)

### 2021/12/07 - 1.1.40

* Updating

### 2021/10/23 - 1.1.37

* Updating

### 2021/10/12 - 1.1.36

* Adds support for .`root-invisible`-class for [vcl/ui/Node]()
* Advances build features (make/Build)
* Fixes issues with the "delayed selecting of Tab-linked controls"-feature
* Fixes alignment of checkboxes in [vcl/ui/Tree]() and/or [-Node]() in Safari

### 2021/09/24

* Adding support for calling [vcl/data/Array]().prototype.sort() with as single string as attribute, indicating which attributes, seperated by a comma, to sort upon

### 2021/08/21

* Introducing vcl/Component.getFactories

### 2021/06/08 - 1.1.35

* Developing [`#VA-20201218-3`]()
* Workaround for use of font-awesome in location
* Improving handling `prototypes/ui/forms/util/Console` via mouse and keyboard
* Still developing `origin`-property for [vcl/ui/Popup]()

### 2021/05/16 - 1.1.34

* Introducing new properties `vcl/ui/Tree:onNodeRender` and `vcl/ui/Node:icon`
* The event `dblclick` now only expands tree nodes when Shift is not held down

### 2021/05/16 - 1.1.33

* Working on reflecting app state in url and vice versa

### 2021/05/05 - 1.1.32

* **List**: Fix for rendering array without objects

### 2021/04/03 - 1.1.31

* **Select**: Fix for using string values
* **Checkbox**: Pixeltuning

### 2021/03/10 - 1.1.30

* Published for veldoffice-rapportage-vcl@v147

### 2021/02/16 - 1.1.29

- vcl/ui/Tabs: Fixing `selectNext()` - in case nothing selected, select 0th child
- vcl/Control: Dispatching `enabled` and `disabled`

### 2021/02/16 - 1.1.28
- Fixes a bug where previously invalidated controls would not render upon show
- Adds the `hotkeyPreventsDefault` property ([Action](src/:))
- Fixes a bug where the `value` property would not always reflect the correct value ([ui/Select](src/:))

### 2021/02/12 - 1.1.27
- ...

### 2021/02/07 - 1.1.26
* Popup: Fixing `_events` being null in document hook

### 2021/01/25 - 1.1.25
* List: Auto-formatting date-like strings (ej. yyyy-mm-ddThh:nn:ss:lllZ)"

### 2021/01/24 - 1.1.24
- Bugfix in vcl/entities/Query - now requesting last page

### 2021/01/23 - 1.1.23
- Hmmmz, wat een toeval?
- Working on Graph<FilterMeting.waterstand>

### 2021/01/02 - 1.1.22
- Resize handle for _`("#left-sidebar")`_ now nested within _`("#editor-tabs")`_ and also, when it's clicked, the _`("#left-sidebar")`_ will be toggled
- Fixes some code involving drag events [`#CVLN-20210102-1`](issue:)
- Improves App.toast features

### 2020-12-08 - 1.1.21
- Refactoring App

### 2020-12-04 - 1.1.20

- Now firing onMouseEnter- and -Leave-events
- **/prototypes/ui/dygraphs/Timeline**: Persisting `dateWindow` and `valueRange` during render, defaulting to 1Y on first render
    
### 2020-11-30 - 1.1.19

* **vcl/ui/Control**: introducing mouseenter, mouseleave clear/setClass

### 2020-11-27 - 1.1.18

* **vcl/Control.prototype** additions:
	* setClass: function(classes) {
	* clearClass: function(classes) {

### 2020-11-22 - 1.1.17
- **vcl/Component.prototype.udown**: Fix for crash when component has no owner
- **prototypes/App**: Improving defaults

### 2020-11-20 - 1.1.16
- **vcl/ui/Ace**: Using another API to set text (hopefully no side-effects ;-))

### 2020-11-10 - 1.1.15
- **vcl/Factory.parse**: Bugfix in new syntax (was: once inherited, always inherited)

### 2020-11-03
- **vcl/ui/Ace**: Claiming/fixing Cmd+Alt+0 again...

### 2020-10-19
- **vcl/Component.query**: Added 'tools/' to be implicit while matching uris

### 2020-10-10 - 1.1.14
- **vcl/ui/List**: Trying to avoid passing on undefined/null-values to onGetValue-handlers

### 2020-10-08 - 1.1.13
- vcl/Factory: Several fixes for Blocks-syntax in VCL-comps and for locally fetching resources while still inheriting the correct implicit base component/block (**current workaround: add .skip-fetch** `#CVLN-20201008-1`)
- vcl/ui/List: changing default display of Array-values, limiting autoColumns to 50 columns
- App.console: Using block-syntax, introducing `.skip-print` class for vcl/ui/Console#console-instances that needs the be "skipped" (`#todo:open`)

### 2020-10-02 - 1.1.12
- Adding `prototypes/cavalion-blocks<>`
- Improving filtering
- "force autowidth when true is passed as second param"
- `["", [], {}]`

### 2020-09-20
- Comgitted some cosmetic changes
- Disabled overflow-feature of `vcl/ui/Bar`, for now (_funny how some things just lay around for ages_)


### 2020-09-18 - 1.1.11
- Fixes a bug where referencing inherited components would lead to a crash while using the (new) blocks-like-syntax of vcl/Component-resources
- Tweaking Tabs-appearances

### 2020-09-08 - 1.1.10
* Fix: `Array.prototype.getObject()` returns correct value while filtering - fixed a bug where getObject() could fail while filtering"

### 2020-09-06 - 1.1.8
* Fix: `vcl/Component.prototype.toggle()` now returns the new value
* Finetuning `vcl/Component.prototype.print`
* Working around `#CVLN-20200906-2`

### 2020-09-04
`#CVLN-20200904-4` √

* Enhancing Alt+Clicky while clicking with Alt+Cmd held down
* Added Shift+Escape hotkey to cancel Alt+Clicky immediately (instead of pressing Escape 20 times to reach null)
* Fixing **vcl/ui/List** Safari rendering bug again, but this time better, in CSS, `vertical-align: middle;` did the trick :-)

### 2020-08-26 - 1.1.7
* When Ctrl+F11 is pressed rapidly in succession, the current `#editors-tabs` is kept visible or hidden, (depending on the state before the first keypress).
* Introducing Component.prototype.udr()

### 2020-08-24
`#CVLN-20200824-5` √

* Fixed long standing (though not reported) bug where the console would not popup/showup when the hotkey was pressed while a `vcl/ui/Node`-instance was focused

### 2020-08-22 - 1.1.6
- **vcl/ui/ListColumn**: Developing sort properties
- **prototypes**: Tweaking console usage and the Alt+Clicky-stuff

### 2020-08-19 - 1.1.5
- Introducing `vcl/Component.prototype.ud` (and loving the contrast/similarity with `up` ;-))

### 2020-08-15 - 1.1.4
- **vcl/ui/List**: Bugfix for Safari where incorrect rendering of null-values would cause a displacement of 6 pixels (or so) vertically
 
>> ![image](https://user-images.githubusercontent.com/686773/90589946-f0428980-e1a4-11ea-9b8a-1784245095da.png)

### 2020-08-15 - 1.1.3
- Introducing property `vcl/Action:on`

### 2020-08-08 - 1.1.2
- Bugfixing several rendering errors for ListColumn where columns would be rendered incorrectly in case of all empty values
- Adding `rendering`-property for ListColumn to control whether to render to `textContent` or `innerHTML`

### 2020-08-03
- Some improvements made to `vcl/ui/Console`
	- delete selected values
	- clear now leaves selected values selected

### 2020-07-28
- **vcl/Action** - improved _hotkey validness detection_ by defaulting to the enabled state, that is to say that when the action in question is disabled, its hotkey is as well
- **vcl/ui/Checkbox** - Finetuning vertical aligning of label and check (again)

### 2020-07-08
- **vcl/Component.prototype.up** - now supports multiple selectors (might throw 'Root {EXPECTED_ROOT} not found')
- **entities/Query** - Fixed a paging-related bug in 
- Changed the behaviour of Al[+Cmd]+Click: click doesn't toggle visibility of console anymore

### 2020-06-06 - 1.0.77
- Adding `seperator` class for `vcl\ui\Node`
- Updating `prototypes/ui/forms/util/Console` (better Alt+Click)

### 2020-06-02 - 1.0.76
- App.js - Button ???

### 2020-05-11 - 1.0.75
- Updating

### 2020-04-14 - 1.0.74
- Tab selection timeout is now configurable --_well, at least via vcl/ui/Tab-prototype for now_ ;-)

### 2020-04-13 - 1.0.73
- 'vcl/Control.prototype.toggleClass()` was buggy, introduced workaround. Needs more investigation to fix.

### 2020-04-06 - 1.0.72
- Implemented relative require (hard work was already done in cavalion-blocks)
- 'Cosmetic' changes for readibilty when code is in 'collapsed' state
- Introducing `Component.prototype.hook()`
- Tabs- developing focys by keuboad
- Checkbox - fix for setting checked -> value

### 2020-04-02 - 1.0.71
- vcl/ui/Tabs: Implemented focus movements

### 2020-01-22 - 1.0.70
- Introducing 'onDblClick' -executesAction-

### 2020-01-18 - 1.0.69
- Introducing vcl/Component.prototype.off() alias for un()

### 2020-01-07 - 1.0.68
- Finetuning vcl/ui/Tab(s)
	- cleaning up its css (moved to ./Tabs)
	- max-width for its text set to 250px
	- showing ellipsis when its text is cut short

![image](https://user-images.githubusercontent.com/686773/71868086-54ab4f80-30d2-11ea-8596-24c84f4424f5.png?2x)


### 2020-01-05  [1.0.67]
- Fix in `entities/Query` where responses where tried to be processed after the component was already destroyed
- Enhanced `vcl/Component.prototype.set()` so that it accepts a string or a string and value as input, besides an object specifying the values for properties
- Added `onMenuClick` to `vcl/ui/Tab`s prototype

### 2019-12-31  [1.0.66]
- Introducing vcl/Component.prototype.soup()
- Persisting/restoring visibility of the console
- Refactoring storage interface

### 2019-12-27  [1.0.65]
- Fix for vcl/Component.prototype.onDestroy

### 2019-12-23
- Fix for vcl/Component.prototype.getSpecializer(removeClasses)

### 2019-12-22
- Adding v7/bro/bhrgtcodes.js

### 2019-12-21  [1.0.64]
- Updating for using pouchdb a storage layer
- Fixing vcl/Component:destroy()
- Adding vcl/Component:set(), get(), properties()
- Adding vcl/Action:toggleState()

### 2019-12-13  [1.0.63]
- Upadting NPM only, need to describe still here

### 2019-11-29  [1.0.62]
- Updating and working on app.open/popup

### 2019-10-05  [1.0.60]
- Fixed an issue with vcl/Component.prototype.toString()
- Fixed an issue where deselecting root-level nodes didn't work
- Introducing vcl/ui/Node.properties.textReflects

### 2019-10-01
- Introducing inset class to vcl/ui/Tabs  
![](https://i.snipboard.io/tNwEyY.jpg?2x)

### 2019-09-25
- Introducing menu feature to vcl/ui/Tab  
![](https://i.snipboard.io/fXON7T.jpg?2x)

### 2019-08-31  [1.0.58]
- Bugfix in vcl/Factory.parse.js (req undefined)

### 2019-08-21  [1.0.57]
- Introducing `vcl/Component.prototype.require()`

### 2019-08-01  [1.0.56]
- Making adjustments for compilation of V7
- What happened to 55? (adjustments for r.js)

### 2019-06-24  [1.0.54]
- That `vcl/Component.prototype.print()`` keeps troubling me
- Done some more worl on the Query/Array/List scrolling xp. It seems to have improved dramatically now for long lists, like veldapps/ListOf<Onderzoek>
- Adding sort() to vcl/data/Array

### 2019-06-23  [1.0.53]
- Automatically set animated class when zoom is set (Panel)
- Fixing some scrolling/rendering related issues in List classes while working on veldapps/ListOf<>
- Fixing some issues related to colouring odd/even ListRow-s
- Fixing vcl/Component.prototype.print()

### 2019-06-19 [1.0.49]
- Enhancing List scrolling

### 2019-06-16
- Another bugfix in Component.prototype.udown()

### 2019-06-13  [1.0.45]
- Bugfix in Component.prototype.udown()

### 2019-06-12  [1.0.44]
- Introducing Component.prototype.toggle()

### 2019-06-11  [1.0.43]
- (LAME) Hacking at $HOME/.../cavalion-blocks in Component.query
- Fixed vcl/ui/Console [allow top level nodes to be selected (this.sel)]

### 2019-06-10  [1.0.41]
- vcl/ui/Tabs: Finally have horizontal scrolling with trackpad working! :-D
- vcl/Component.prototype.nextTick

### 2019-06-09
- Fixed Component.prototype.udown (probably will only use it with one parameter from now on)

### 2019-06-08  [1.0.40]
- Introducing `vcl/Component.prototype.udown(selector)`,  a shorthand for `this.up().down(selector)`. Also it can be a replacement for `scope()`
- Advancing prototypes/make/Build

### 2019-06-04  [1.0.37]
- Fixed autoWidth-ing columns after source resets data

### 2019-04-16 - 1.0.35
- Added Component.prototype.print()

### 2019-04-12
- vcl/Control: adding dispatchers for on(un)selected
- vcl/Component: adding bind(), open() and close()
- App.openform: open()

### 2019-03-31 - 1.0.34
- Fixing some issues with auto sizing the width of vcl/ui/ListColumn
- Performance tweak in vcl/ui/Panel (?)
- Advancing vcl/ui/Tab with the property textReflects: render text as html or text
- Getting rid of low res images

### 2019-03-29
- vcl/ui/Console now using font-awesome for caret (no more pixels when zooming, pura-vector ;-)

### 2019-02-25
- Implementing raw and distinct features for entities/EM

### 2019-02-11 - 1.0.33
- vcl/ui/Console: Adding selecting values (Cmd+Click)
- vcl/Factory: Fix for referencing component in property hashes, before only string-refs where anticipated
- vcl/Component: Fix for getVar()'s use of default value

### 2019-02-11 - 1.0.32
- Fixing RequireJS issues
- Exposing some events for ui/List

### 2019-02-06 - 1.0.31
- vcl/ui/Tab: Built in a workaround which reminds me of Borland's `Application->ProcessMessages();`. 

>> ![](https://i.snag.gy/O2ghWj.jpg)

- vcl/ui/List: Adding selectAll()

### 2019-01-29 - 1.0.30
- Made compitable, fixing issues for server2

### 2019-01-22 - 1.0.29
- Fix vcl/Component.prototype.hasVar

### 2019-01-16 - 1.0.26
- Adding pseudo classes classes :enabled, :focused, :visible

### 2019-01-11 - 1.0.24
- Adding :app pseudo class

### 2018-12-19 - 1.0.23
- Adding Control.prototype.onscroll
- Working on endless scrolling features

### 2018-12-16 - 1.0.22
- Component/getKeysByUri: Do not split the namespace on dots anymore (or anything before last <)

### 2018-12-12 - 1.0.21
- Home.tree: Nodes are no longer rendered as expanded

### 2018-12-10
- Component.query: Now supporting querying for 'classes' property (via vcl/ui/Button.classes-toggle) 
- ui/Node: Enchancing seperator class for root node

### 2018-12-05
- vcl/entities/Query: Passing on criteria.opts to EM.query

### 2018-10-12
- vcl/ui/Array: Gathering more attribute names

### 2018-10-08

- Fixed `vcl/ui/Panel`s `zoom` property. It now supports zooming in **and** out. Funny how the solution was already in the code all along.

>> ![](https://i.snag.gy/ak3R2i.jpg)

- Fixed some _virtual constructor_ issues in `vcl/ui/List`


### 2018-10-06
- Fixing `vcl/Component` constructor situation (TObject.Create virtual constructor dejavus)

### 2018-08-28
- Fixed issue with vcl/Component.prototype.getStorageKey

### 2018-01-26
- Where are the changelogs?
- Fix: vcl/ui/Node.prototype.getTree would crash when no parent tree was found

### 2018-01-26
- Exploring Git

### 2018-01-21
- Developing vcl/entities/Query and descendants
- Start developing ListOf
- Finetuning code structures and styles (standard library?)

### 2018-01-08
- Developing Veldoffice entities client

### 2018-01-02
- Giving some love to vcl/Component::handlers and ::overrides
- vcl/Factory now catching eval errors
- vcl/ui/Printer now supports native Promise (js/Deferred.prototype.then())
- entities/Model.parse() now resolves models
- Added loaded event for Component::onLoad
- Developing veldoffice/Session, veldoffice/EM and veldoffice/models
- Adding locale

### 2017-11-04
- devtools/Workspace: Added query close for tabs
- devtools/Editor<html>: First steps to specific [uri=*.\.page/\.html] editor

### 2017-10-18
- Improved context handling with Pages and App7.loadPage (basically it's all back to url_query again, but that's a good thing :-))
- EM.query: When omitted pagesize will default to 50

### 2017-10-15
- Pages: Removing obligatory less resource. It seems these are hardly used and can always be required by the conroller module
- Commiting in favor of V7

### 2017-10-11
- Code: new release

### 2017-10-08
- V7: Releasing build 126
- stylesheet! - now supporting less
- Embracing Template7, setting up context before loading page

### 2017-10-02
- Editor<html>: Restoring scroll position upon changes in the source code

### 2017-08-11
- Component.query: Added toggleClass()
- Query.events: Added "event"
- vcl/data/Pouch: Finetuning, developing...
- vc/prototypes/App.framework7: Adding debug support
- vcl/ui/Panel: Finetuning zoom
- entities/EM: Developing, finetuning
- Resolved: #1297

### 2017-07-01
- Introducing vcl/ui/Panel (might move upwards in the class hierarchy) zoom (cool feature!!)

### 2017-06-24
- Adding vcl/data/Pouch in the mix
- Optmizing performance for vcl/ui/List icw vcl/data/Array
- Fixing (workaround) some weird bug with Function.prototype.toString

### 2017-06-20
- Updating code base

### 2017-04-23
- Improving make/Build

### 2017-03-16
- Reorganized JavaScript libraries
- Conformed code/devtools to new struture
- Currently working on:
	- eae.com/BBT/appx
	- veldapps.com/code
	- cavalion.org/devtools
	- veldapps.com/V7
	- veldapps.com/vcl-rapportage-module

### 2017-03-11
- Getting rid of cavalion.org/... module requires, now using relative paths within cavalion.org sources/modules

### 2017-03-07
- Removed [id^=vcl-] from Control CSSRules selector
- Making FormContainer work with relative formUris

### 2017-03-04
- Optimizing code for folding features in Ace
- Fixing bugs for not being comptabile with IE
- Refresh button in ui/entities/Query
- Time for cavalion.org/Command to go away - jquery.ajax should be sufficient
- Deprecating App.scaffold

### 2017-02-28
- Working on entities/Instance <--> model, how to receive sets/one-to-many collections from server?
- Fixing scaffolding issues. No longer a-synchronous. All scaffold code should run *before* onLoad.
- Explicit express in code that an certain component should be scaffolded, eg.:
	- View<Measurement>: $(["ui/entities/Query<Measurement>.scaffold"], {}, []);
	- View<Modem>: $(["ui/entities/Query<Modem>.scaffold"], {}, []);
- Working on nesting operators for Component.prototype.qsa
- Working on vcl/Control's update bug
- Introducing vcl/Action:onUpdate
- Bugfixing vcl/entities/Query; tuples vs instances
- Improving vcl/ui/FormContainer with new API swapForm()
- Simplyfing CSS fonts

### 2017-02-25
- Bug fixed where parent could not be nulled in a vcl resource
- Refactoring/bugfixing scaffolding

>>	$(["View<Logger>.select"]);

### 2017-02-24
- Bugfixing vcl/Control.update, where controls could be updated while not anticipated for and leave them in a inconsistent state in relation to the DOM (mailny they would be removed from the DOM)
- Implementing scaffolding in vcl/Factory
- Added nesting operator (<) to vcl/Component.query, indicating to parent/child relationship

### 2017-02-23
- Integrated Dygraphs for visualizing measurements in a interactive timeline
- Keeping UI as simple as possible
- Refactoring vcl/prototypes/App.v1 to multiple classes, like .openform, .console (developing)
- Adding component name in DOM node classes, prefixed by a #-sign
- Refer to component names in css definitions (# --> \\#)

### 2017-02-17
- Developing ui/entities/Query, ./QueryFilters, ./AttributeInput
- Finetuning Component.qs, still need a good operator for controls

### 2017-02-14
- Working on vcl/ui/Input
	- toInputValue/fromInputValue

### 2017-02-02
- Reformatting code to be better suited for folding features in the editor
- Console: Introducing req()
- vcl/Component.prototype.setVars: Now allowing a string as input (js.str2obj)
