"use vcl/ui/Node";

var Node = require("vcl/ui/Node");

[["./View"], {
	onLoad: function() {
		var scope = this.getScope();
		var nodes = [].concat(scope.tree.getControls());
		var parentNode = this.up("vcl/ui/Node");

		if(parentNode) {
			nodes.forEach(function(node) {
				node.setParent(parentNode);
			});
		}

		return this.inherited(arguments);
	}
}, [
    [("#menubar"), { visible: false }],
    [("#client"), { css: "border-left: none;" }],
	[("#left"), {}, [
		[("vcl/ui/Tree"), "tree", {
	    	onSelectionChange: function(selection) {
	    		var scope = this.getScope();
	    		scope.menubar.setVisible(scope.menubar.hasOwnProperty("_controls") &&
	    				(selection.length === 0 || selection[0]._uri !== this._uri));
	    		return this.inherited(arguments);
			}
		}]
	]]
]];