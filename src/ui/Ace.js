define(["require", "js/defineClass", "ace/ace", "./Panel", "js/Type", "util/Text"], 
function(require, Ace, ace, Panel, Type, Text) {
    
	var Range = ace.Range;
	
	// Somehow this got broken Cmd+Alt+0 (really missing it, spend over 2 hours (sigh!))
	// DefaultCommands.commands[12].exec = (editor) => { 
	// 	editor.session.foldAll(); 
	// 	while(editor.session.unfold(editor.getCursorPosition(), false)); 
	// };

	const initCommands = (editor) => {
		editor.commands.addCommand({
		    name: "toggleNestedFolds",
		    bindKey: { win: "Shift-F2", mac: "Shift-F2" }, // Define the key binding for both Windows and Mac
		    exec: (editor) => {
				var session = editor.getSession();
		        var row = session.selection.getCursor().row;
		        row = session.getRowFoldStart(row);
		        var range = session.$toggleFoldWidget(row, { all: true });
		        
		        if (range) return;
		        // handle toggleParent
		        var data = session.getParentFoldRangeData(row, true);
		        range = data.range || data.firstRange;
		        
		        if (range) {
		            row = range.start.row;
		            var fold = session.getFoldAt(row, session.getLine(row).length, 1);
		
		            if (fold) {
		                session.removeFold(fold);
		            } else {
		                session.addFold("...", range);
		            }
		        }
	        }
		});
	};
	const removeAllMarkers = (editor, lines) => {
	    // Haal alle markers op (zowel voor de achtergrond als voor de selectie)
	    const markers = editor.session.getMarkers(false); // true voor achtergrond markers

	    // Verwijder elke marker
	    for (let markerId in markers) {
	        editor.session.removeMarker(markerId);
	    }
	    
		lines.forEach(lineNumber => editor
			.session
			.removeGutterDecoration(lineNumber, "line-deleted"));
	};
	const markDeletionInGutter = (editor, lineNumber) => {
	    editor.session.addGutterDecoration(lineNumber, "line-deleted");
	};
	
	ace.config.set("basePath", window.require.toUrl("ace").split("?")[0]);

	return (Ace = Ace(require, {
		inherits: Panel,
		prototype: {

			"@css": {
				"background-color": "white",
				"z-index": "200",
				">div": "position: absolute; top: 0; left: 0; bottom: 0; right: 0;",
				".textdiff": "background-color: rgba(255,255,0,0.5); position: absolute;",
				".line-deleted":"position: absolute; background-color: #ffcccc; right: 0; left: 0;"
			},

			_align: "client",
			_editor: null,
			_content: "<div></div>",

			_cursorPos: null,

			onnodecreated: function() {
				/**
				 * @overrides ../Control.prototype.onnodecreated
				 */
				var me = this;
				
				this._editor = ace.edit(this._node.childNodes[0]);
				this._editor.$blockScrolling = Infinity;
				this._editor.setOption("useSoftTabs", false);
				this._editor.on("change", (e) => this.dispatch("change", e));
				
				initCommands(this._editor);
				
				return this.inherited(arguments);
			},
			onchange: function() {
				/**
				 *
				 */
				return this.fire("onChange", arguments);
			},

			applyBounds: function() {
				/**
				 * @overrides ./Panel.prototype.applyBounds
				 */
				this.inherited(arguments);
				this._editor.resize();
			},
			setFocus: function() {
				/**
				 * @overrides ../Control.prototype.setFocus
				 */
				this.nodeNeeded();
				this._editor.focus();
			},
			getEditor: function() {
				/**
				 *
				 * @returns
				 */
				this.nodeNeeded();
				return this._editor;
			},
			getValue: function() {
				this.nodeNeeded();
				return this._editor.session.getValue();
			},
			setValue: function(value) {
				this.nodeNeeded();
				if(value instanceof Array && value.every(s => typeof s === "string")) {
					value = value.join("\n");
				}
				return this._editor.setValue(typeof value === "string" ? value : JSON.stringify(value));
			},
			getLines: function(seperator) {
				return this.getValue().split(seperator || "\n");
			},
			setMode: function (mode) {
				this.getEditor().session.setMode("ace/mode/" + mode);
			},
			
			append: function(content) {
				const editor = this.getEditor();
			    const session = editor.getSession();       // Get the current session
			    const lastRow = session.getLength();       // Get the last row of the document
			    
			    session.insert({ row: lastRow, column: 0 }, '\n' + content);  // Insert content at the bottom
			},
			prepend: function(content) {
				const editor = this.getEditor();
			    const session = editor.getSession();       // Get the current session

			    session.insert({ row: 0, column: 0 }, '\n' + content);  // Insert content at the bottom
			},
			
			getSelection: function() {
				const editor = this.getEditor();

				const selectionRange = editor.getSelectionRange();
				const selectedText = editor.session.getTextRange(selectionRange);
				
				return selectedText.split('\n');				
			},
			setSelection: function(lines) {
				const editor = this.getEditor();

			    const selectionRange = editor.getSelectionRange();
			    const startRow = selectionRange.start.row;
			    const startColumn = selectionRange.start.column;
			
			    // Join the array of lines with newlines to recreate the multi-line text
			    const textToInsert = lines.join('\n');
			
			    // Replace the selected text with the new content
			    editor.session.replace(selectionRange, textToInsert);
			
			    // Move the cursor to the end of the inserted text
			    const endRow = startRow + lines.length - 1;
			    const endColumn = lines[lines.length - 1].length;
			    editor.selection.setSelectionRange({
			        start: { row: startRow, column: startColumn },
			        end: { row: endRow, column: endColumn }
			    });
			},

			reflectActionEvent(evt) {},
			getDiffs: function(originalText) {
				var dmp = new Text.dmp();
				var editor = this.getEditor();

			    const currentText = editor.getValue();
			    const diffs = dmp.diff_main(originalText, currentText);
			    dmp.diff_cleanupSemantic(diffs); // Maakt de diff output schoner
			    
			    return diffs;
			},
			markDiffs: function(diffs) {
				var editor = this.getEditor();
 				if(typeof diffs === "string") {
					return this.markDiffs(this.getDiffs(diffs));
				}
				
			    removeAllMarkers(editor, this.getLines().map((l, i) => i));

			    let cursorPosition = 0; // Houdt de positie in de tekst bij
			    diffs.forEach((diff) => {
			        const [operation, text] = diff;
			        switch (operation) {
			            case 0: // Geen wijziging
			                cursorPosition += text.length;
			                break;
			            case -1: // Tekst verwijderd
			                // Marker voor verwijderde tekst niet nodig, maar je kunt dit aanpassen
			                // cursorPosition += text.length; // Verwijderde tekst overslaan
							const p = editor.session.doc.indexToPosition(cursorPosition, 0);
			                markDeletionInGutter(editor, p.row);
			                break;
			            case 1: // Tekst toegevoegd
			                const start = editor.session.doc.indexToPosition(cursorPosition, 0);
			                const end = editor.session.doc.indexToPosition(cursorPosition + text.length, 0);
			                const m = editor.session.addMarker(new Range(start.row, start.column, end.row, end.column), "textdiff", "text", false);
			                cursorPosition += text.length;
			                break;
			        }
			    });
			    
				return diffs;
			},
			makePatch: function(originalText, diffs) {
				if(typeof diffs === "undefined") {
					diffs = this.getChanges(originalText);
				}
				
				var dmp = new Text.dmp();
			    return dmp.patch_make(originalText, diffs);
			},
			applyPatch: function(originalText, patch) {
				var dmp = new Text.dmp();
			    const results = dmp.patch_apply(patch, originalText);
			    // originalText = results[0]; // Update de originele tekst met de nieuwe versie
			    // console.log("patch_apply-results", results);
			    this.setValue(results[0]);
			},
			removeDiffs: function() {
			    removeAllMarkers(this.getEditor(), this.getLines().map((l, i) => i));
			}
		}, 
		properties: {

// 			/** @overrides ../Element.properties.executesAction */
// 			"executesAction": {
// 				type: ["No", "onClick", "onEnterPressed"]
// 			},

// 			"detectChangeTimeout": {
// 				type: Type.INTEGER
// 			},
// 			"type": {
// 				type: InputTypes,
// 				set: Function
// 			},
// 			"placeholder": {
// 				type: Type.STRING,
// 				set: Function
// 			},
			"onChange": {
				type: Type.EVENT
			},
// 			"value": {
// 				type: Type.STRING,
// 				set: Function
// 			},
// 			"source": {
// 				set: Function,
// 				type: Component
// 			},
// 			"sourceAttribute": {
// 				type: Type.STRING,
// 				set: Function
// 			},

			"mode": {
				type: Type.STRING,
				set: Function
			}

		}
	}));
});