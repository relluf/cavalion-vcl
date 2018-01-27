"locale, vcl/ui/Node";

var Node = require("vcl/ui/Node");

var locale = window.locale;

var styles = {
	
	"#search-panel": "padding: 4px 6px;",
	"#search": "padding: 4px; width: 100%; border-radius: 5px; border: 1px solid #f0f0f0;"
};
var handlers = {
	"loaded": function() {
		var scope = this.scope();
		
		scope.tree.refresh();
		
		// var arr = scope.nodes._array;
		// scope.nodes.setArray(null);
		// scope.nodes.setArray(arr);
	}
}

var letters = "aaaaaabbccdddeeeeeeeeefgghiiijjkklllmmnnnnnnoooooppqrrssttuuuuuvvwxyzzz";
function randomWord() {
	var n = Math.random() * 10;
	if(n > 7) {
		n += Math.random() * 5;
	}
	
	n = parseInt(n) + 1;
	
	var r = "", p;
	while(n-- >= 0) {
		p = parseInt(Math.random() * letters.length);
		r += letters.substring(p, p + 1);
	}
	
	return r.substring(0, 1).toUpperCase() + r.substring(1);
}

function Node_render() {
	/**
	 * @overrides Node.prototype.render
	 */
	var record = this._vars.record;
	// this._nodes.text.innerHTML =
	this._nodes.icon.innerHTML = String.format("<i class='fa fa-%s'></i>", record.icon);
	this._nodes.text.textContent = record.text;
}

var ID = 7;

$("vcl/ui/Form", { css: styles, handlers: handlers }, [
	
	$("vcl/ui/Panel#search-panel", { align: "top", autoSize: "height" }, [
		$("vcl/ui/Input#search")
	]),

	$("vcl/data/Array#nodes", {
		array: [
			{ id: 1, parent: 0, text: locale("Root"), icon: "home" },
				{ id: 2, parent: 1, text: locale("Sub1") },
				{ id: 3, parent: 1, text: locale("Sub2") },
				{ id: 4, parent: 1, text: locale("Sub3 ++ ") },
					{ id: 6, parent: 4, text: "Sub3.1" },
				{ id: 5, parent: 1, text: locale("Sub4") }
		]
	}),

	$("vcl/ui/Tree#tree", { align: "left", width: 300,
		onSelectionChange: function() {
			// this.scope().console.print("selectionchange", arguments);
		},
		onNodesNeeded: function(parent) {
			var scope = this.scope(), owner = this._owner;
			
			if(parent === null) {
				parent = this;
				scope.nodes.getArray().forEach(function(record) {
					if(record.parent === 0) {
						node = new Node(owner);
						node.render = Node_render;
						node.setVar("record", record);
						node.setExpandable(true);
						node.setParent(parent);
					}
				});
			} else {
				var parentId = parent.getVar("record.id");
				parent.setExpandable(false);
				// parent.addClass("loading");
				setTimeout(function() {
					parent.setExpandable(true);
					parent.removeClass("loading");
					for(var i = 0; i < 2 + Math.random() * 20; ++i) {
						var record = {text: randomWord(), id: ID++};
						
						node = new Node(owner);
						node.render = Node_render;
						node.setVar("record", record);
						node.setExpandable(true);
						node.setParent(parent);
					}
					
				}, Math.round(Math.random() * 500));
			}
		} }),//, source: "#nodes" }),
	
	$("vcl/ui/List", { autoColumns: true, align: "client", source: "nodes" }),

	$("vcl/ui/Console#console", { align: "bottom", height: 200, onEvaluate: function(expr) { var scope = this.scope(); return eval(expr); }})
	
]);