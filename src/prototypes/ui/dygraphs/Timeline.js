"dygraphs/Dygraph, js";

var Dygraph = require("dygraphs/Dygraph");
var js = require("js");

function draw(data, options) {
/* TODO describe usage:
	-vars: { graph, data, options }
*/
	var scope = this.scope(), me = this;
    var node = scope.host.getNode();
    var history = this.vars("history");
    var graph = this.vars("graph");
    var defs = {};
    
    if (graph !== undefined) {
    	try {
	    	this.print("using previous graph");
    		defs.dateWindow = graph.xAxisRange();
    		defs.valueRange = graph.yAxisRange();
        	graph.destroy();
    	} catch(e) {
    		console.error(e);
    	}
    } else {
    	this.print("no previous graph, defaulting to 1Y");
    	defs.dateWindow = [parseInt(Date.now() / 1000) * 1000];
    	defs.dateWindow.unshift(defs.dateWindow[0] - 365*24*60*60*1000);
    }
    
    this.clearTimeout("update-history");
	this.print("defs", JSON.stringify(defs));

    if (data === undefined) {
        data = this.vars("data");
        if (data === undefined) {
            return;
        }
    } else {
        this.vars("data", data);
    }

    if (options === undefined) {
        options = this.vars("options");
    } else {
        this.vars("options", options);
    }

    try {
        this.vars("graph", new Dygraph(node, data, js.mixIn(js.mixIn({
            rollPeriod: 1,
            showRoller: true,
			drawCallback: function(g, is_initial) {
				var b;

				if(history.block) {
					if(--history.block === 0) {
						delete history.block;
					}
					scope.history_back.update();
					scope.history_forward.update();
				} else {
					me.setTimeout("update-history", function() {
						var item = { x: defs. x || g.xAxisRange(), y: defs.y || g.yAxisRange() };
						var current = history[history.index];
						if(item.x[0] === 0) return;
						if(!current || (current.x[0] !== item.x[0] || current.x[1] !== item.x[1] || current.y[0] !== item.y[0] || current.y[1] !== item.y[1])) {
							history.splice(history.index + 1);
							history.index = history.push(item) - 1;
							scope.history_back.update();
							scope.history_forward.update();
						}
					}, 450);
				}
				me.emit("draw", [g, is_initial]);
			},
            axisLabelFontSize: 10,
			// highlightSeriesOpts: {
			// 	strokeWidth: 3,
			// 	strokeBorderWidth: 1,
			// 	highlightCircleSize: 5
			// },
            // customBars: true,
	        // highlightCircleSize: 2,
	        // strokeWidth: 1,
	        // strokeBorderWidth: isStacked ? null : 1,
	        // labelsDivWidth: 0, ??
            // legend: "always",
            // showRangeSelector: true
        }, options || {}), defs)));
    } catch(e) {
    	console.error(e);
    	/*- TODO prevent construction */
    	this.removeVar("graph");
    }
}
function clear() {
	this.print("clear");
    this.clearTimeout("update-history");
    
    var graph = this.removeVar("graph");
    if (graph !== undefined) {
    	try {
        	graph.destroy();
    	} catch(e) {
    		console.error(e);
    	}
    }
    var history = this.vars("history");
    history.splice(0);
    
    this.scope().history_back.update();
    this.scope().history_forward.update();
}

[["./LineChart"], {
    vars: { clear: clear, draw: draw, history: [] },
    onLoad: function() {
    	this.vars("resized", true);
    	this.vars("history", []);
    	return this.inherited(arguments);
    },
    onActivate: function() {
    	if(this.removeVar("resized") === true) {
// this.print("onActivate -> update -> draw");
	        this.update(() => draw.apply(this, []));
    	}
    	return this.inherited(arguments);
    },
    onResize: function () {
        if (this.isVisible() === false) {
			this.print("onResize -> remember");
            this.vars("resized", true);
        } else {
			this.print("onResize -> update", this.getComputedStyle().width);
	        this.update(() => draw.apply(this, []));
        }
        return this.inherited(arguments);
    }
}, [
	["vcl/Action", ("history_back"), {
		enabled: false,
		onExecute: function() {
			var g = this._owner.vars("graph");
			var history = this._owner.vars("history");
			var item = history[--history.index];
			history.block = (history.block || 0) + 1;
			g.updateOptions({dateWindow: item.x, valueRange: item.y});
		},
		onUpdate: function() {
			var history = this._owner.vars("history");
			this.setEnabled(history.length > 0 && history.index > 0);
		}
	}],
	["vcl/Action", ("history_forward"), {
		enabled: false,
		onExecute: function() {
			var g = this._owner.vars("graph");
			var history = this._owner.vars("history");
			var item = history[++history.index];
			history.block = (history.block || 0) + 1;
			g.updateOptions({dateWindow: item.x, valueRange: item.y});
		},
		onUpdate: function() {
			var history = this._owner.vars("history");
			this.setEnabled(history.index < history.length - 1);
		}
	}]
]];