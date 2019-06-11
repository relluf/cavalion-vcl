### 2019-06-11  [1.0.42]
- (LAME) Hacking at $HOME/.../cavalion-blocks in Component.query

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

	$(["View<Logger>.select"]);

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
