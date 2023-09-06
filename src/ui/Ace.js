define(["require", "js/defineClass", "ace/ace", "ace/commands/default_commands", "./Panel", "js/Type"], 
function(require, Ace, ace, DefaultCommands, Panel, Type) {
    
	// Somehow this got broken Cmd+Alt+0 (really missing it, spend over 2 hours (sigh!))
	DefaultCommands.commands[12].exec = (editor) => { 
		editor.session.foldAll(); 
		while(editor.session.unfold(editor.getCursorPosition(), false)); 
	};

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
	

	return (Ace = Ace(require, {

		inherits: Panel,

		prototype: {

			"@css": {
				"background-color": "white",
				"z-index": "200",
				">div": "position: absolute; top: 0; left: 0; bottom: 0; right: 0;"
			},

			_align: "client",
			_editor: null,
			_content: "<div></div>",

			_cursorPos: null,

			applyBounds: function() {
				/**
				 * @overrides ./Panel.prototype.applyBounds
				 */
				this.inherited(arguments);
				this._editor.resize();
			},
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
			setFocus: function() {
				/**
				 * @overrides ../Control.prototype.setFocus
				 */
				this.nodeNeeded();
				this._editor.focus();
			},
			onchange: function() {
				/**
				 *
				 */
				return this.fire("onChange", arguments);
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
				return this._editor.setValue(typeof value === "string" ? value : JSON.stringify(value));
			},
			getLines: function(seperator) {
				return this.getValue().split(seperator || "\n");
			},
			setMode: function (mode) {
				this.getEditor().session.setMode("ace/mode/" + mode);
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