define(function(require) {
	
// 2025/09/24: Refactoring rendering process: https://chatgpt.com/g/g-p-67c87b1e85cc81919f001cf9e4e558d2-vo/c/68d2e612-0f28-8330-a487-7e6e4431a1c5

	var Class = require("js/Class");
	var Method = require("js/Method");
//	var Component = require("../Component");
	var Panel = require("./Panel");
	var ListRow = require("./ListRow");
	var List = require("js/referenceClass!./List");

	var ListBody = {
		inherits: Panel,
		prototype: {

			constructor: function() {
				this._rowCache = [];
			},

			"@css": {
				overflow: "hidden"
			},

			_count: 0,
			_rowCache: null,
			_firstRow: -1,

			alignControls: function() {
				/** @overrides ./Panel.prototype.alignControls */
			},
			setParent: function(value) {
				/** @overrides ../Control.prototype.setParent */
				if(this._parent !== value) {
					if(this._parent !== null) {
						Method.disconnect(this._parent, "notifyEvent", this, "listNotifyEvent");
					}
					if(value !== null && !(value instanceof List)) {
						throw new Error("Need a List as parent");
					}
					this.inherited(arguments);
					if(this._parent !== null) {
						Method.connect(this._parent, "notifyEvent", this, "listNotifyEvent");
						this.columnsChanged();
					}
				}
			},

			listNotifyEvent: function(event, data) {
				if(event === "columnsChanged") {
					this.columnsChanged(data);
				} else if(event === "updateRows") {
					this.updateRows(data);
				}
			},
			getList: function() {
				return this._parent !== null ? this._parent : null;
			},
			render_: function() {
				var list = this.getList();
				if(list.getCount() === 0) {
					this._firstRow = 0;
					this.setCount(0);
				} else {
					// visual effect, a form will seem to render more quickly
					this.setTimeout("renderRows", 10);
					// this.renderRows();
				}
			},
			renderRows: function() {
				var list = this.getList();
				var firstRow = list.getTopRow();
				var visibleRows = list.getVisibleRowCount(true);
				var max = list.getCount();
				var rowBuffer = list._rowBuffer;
			
				var count = visibleRows + rowBuffer * 2;
				if (count > max) count = max;
			
				firstRow -= rowBuffer;
				if (firstRow < 0) firstRow = 0;
				if (firstRow + count > max) firstRow = max - count;
			
				var delta = Math.abs(this._firstRow - firstRow);
				if (firstRow !== 0 && delta === 0) return;
				this.setCount(count);
			
				if (this._firstRow === -1 || delta > rowBuffer / 2) {
					// --- pagemove: two-pass, visible rows last ---
					const vStart = firstRow + rowBuffer;                 // first visible row
					const vEnd   = vStart + visibleRows - 1;            // last visible row
					const later = [];
			
					for (let i = 0; i < count; ++i) {
						const row = this._controls[i];
						const idx = i + firstRow;
			
						// off-screen rows now…
						if (idx < vStart || idx > vEnd) {
							row.setRowIndex(idx);
						} else {
							// …visible rows deferred
							later.push([row, idx]);
						}
					}
			
					// visible rows last (next tick keeps UI & fetching logic snappy)
					this.setTimeout("renderRows.visible", () => {
						for (const [row, idx] of later) row.setRowIndex(idx);
					}, 0);
			
					this._firstRow = firstRow;
				} else {
					// --- normal small scroll: keep the cheap rotation logic ---
					if (/* delta > rowBuffer * 0.75 || */ firstRow === 0 || firstRow === max - count) {
						while (this._firstRow < firstRow) {
							let row = this._controls.splice(0, 1)[0];
							this._controls.push(row);
							row.setRowIndex(this._firstRow + count);
							this._firstRow++;
						}
						while (this._firstRow > firstRow) {
							let row = this._controls.pop();
							this._controls = [row].concat(this._controls);
							row.setRowIndex(--this._firstRow);
						}
					}
				}
			},
			updateRows: function(range) {
				if (this.hasOwnProperty("_controls")) {
					const list = this.getList();
					const top = list.getTopRow();
					const visEnd = top + list.getVisibleRowCount(true) - 1;
			
					const early = [];  // off-screen first
					const late  = [];  // in-view last
			
					for (var i = 0; i < Math.min(this._controls.length, this._parent.getCount()); ++i) {
						var c = this._controls[i];
						if (c._node !== null) {
							// Update row when the range is unknown or its rowIndex is within the range
							if (range === undefined || (c._rowIndex >= range.start && c._rowIndex <= range.end)) {
								// In-view? Defer. Otherwise do it now.
								(c._rowIndex >= top && c._rowIndex <= visEnd ? late : early).push(c);
							}
						}
					}
			
					// Initialize off-screen first…
					early.forEach(c => c.initializeNodes());
			
					// …and do the visible rows last (small defer keeps the UI snappy)
					this.setTimeout("init-visible-rows", function() {
						late.forEach(c => c.initializeNodes());
					}, 0);
				}
			},
			rowHeightChanged: function() {
				var rowHeight = this.getList().getRowHeight();
				if(this.hasOwnProperty("_controls")) {
					for(var i = 0; i < this._controls.length; ++i) {
						var row = this._controls[i];
						var index = row._rowIndex;
						if(index !== -1) {
							row._rowIndex = -1;
							row.setRowIndex(index);
							row.setHeight(rowHeight);
						}
					}
				}
			},
			columnsChanged: function() {

				function f() {
					var i;

					if(this.hasOwnProperty("_controls")) {
						for(i = 0; i < this._controls.length; ++i) {
							if(this._controls[i]._node !== null) {
								this._controls[i].initializeNodes(true);
							}
						}
					}
					for(i = 0; i < this._rowCache.length; ++i) {
						// FIXME
						if(this._rowCache[i]._node !== null) {
							this._rowCache[i]._node.innerHTML = "";
						}
					}
				}

				this.setTimeout("columnsChanged", f.bind(this), 50);
			},
			setCount: function(value) {
				if(this._count !== value) {
					this._count = value;

					var list = this.getList();
					var rowHeight = list.getRowHeight();
					var count = list.getCount();
					var index;

					if(!this.hasOwnProperty("_controls")) {
						this._controls = [];
					}

					while(this._controls.length < this._count) {
						var row;
						if(this._rowCache.length) {
							row = this._rowCache.splice(0, 1)[0];
						} else {
							row = new ListRow();
							row.setOwner(this);
						}
						row.setHeight(rowHeight);
						row._parent = this;
						this._controls.push(row);

						index = this._controls.length - 1 + this._firstRow;
						if(index < count) {
							row.setRowIndex(index);
						} else {
							row.setRowIndex(-1);
						}
						row._update();
					}

					if(this._controls.length > this._count) {
						var n = this._controls.length - this._count;
						var rows = this._controls.splice(this._controls.length - n, n);
						for(var i = 0; i < rows.length; ++i) {
							rows[i]._parent = null;
							rows[i]._rowIndex = -1;
							rows[i]._update();
						}
						this._rowCache = this._rowCache.concat(rows);
					}
				}
			}
		}
	};

	return (ListBody = Class.define(require, ListBody));
});