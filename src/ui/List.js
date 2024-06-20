define(function(require) {

// 2021/02/02: ListColumn-maxwidth feature  

	var Class = require("js/Class");
	var Method = require("js/Method");
	var Browser = require("../../util/Browser");
	var HtmlElement = require("../../util/HtmlElement");
	var Source = require("../../data/Source");
	var SourceEvent = require("../../data/SourceEvent");
	var Component = require("../Component");
	var Panel = require("./Panel");
	var ListColumn = require("./ListColumn");
	var ListHeader = require("./ListHeader");
	var ListFooter = require("./ListFooter");
	var ListBody = require("./ListBody");
	var ListRow = require("./ListRow");
	
	// require("stylesheet!./List.less");
	
	// TODO centralize/utilize :-p
	const capitalize = (s) => js.sf("%s%s", s.charAt(0).toUpperCase(),
			s.substring(1));
			
	const workaroundColumnAlignment = (list) => {
		const f = _ => list._columns.forEach(c => 
			c._rule.style.setProperty("display", 
				c.isVisible() ? "" : "none", "important"));
				
		list.setTimeout("workaround-column-alignment", f, 500);
	};


	var List = {
		inherits: Panel,
		prototype: {
			constructor: function() {
				this._columns = [];

				this._header = new ListHeader();
				this._footer = new ListFooter();
				this._body = new ListBody();

				this._header.setParent(this);
				this._body.setParent(this);
				this._footer.setParent(this);
				this._footer.setVisible(false);

				this._selection = [];
			},

			'@css': {
				overflow: "hidden",
				'overflow-x': "auto",
				'&.busy': {
					'background': "url(/shared/vcl/images/loading.gif) no-repeat 4px 32px",
					'.body': {
						visibility: "hidden"
					}
				},
				'.body': {
					overflow: "auto",
					position: "absolute",
					left: "0",
					top: "0px",
					right: "0",
					bottom: "0",
					'line-height': "13px",
					// 'background-color': "white",
					'.scroll': {
						position: "absolute",
						width: "1px",
						height: "1px",
						overflow: "hidden",
						'z-index': 2
					}
				},
				'&.header-invisible .{./ListHeader}': "height:0;",
				'.{./ListColumn}': "transition: width 400ms, max-width 400ms",
				'.ListCell': "transition: width 400ms, max-width 400ms"
			},
			MAX_AUTOCOLUMNS: 50,

			/** @overrides ../Control.prototype */
			_align: "client",
			_executesAction: "onRowDblClick",
			_content:
				"<div class=\"body\">" +
					"<div class=\"scroll\">.</div>" +
				"</div>",

            /** @overrides ./Panel.prototype._focusable */
            _focusable: true,

			_autoColumns: false,
			_formatDates: true,
			
			_source: null,
			_sourceMonitor: null,
			_rowHeight: 23,
			_rowBuffer: 25,
			_count: 0,
			_topRow: 0,
			_visibleRowCount: 0,

			_selection: null,

			_header: null,
			_footer: null,
			_body: null,
			_columns: null,
			
			_scrollTimeout: 100,

			_onSelectionChange: null,
			_onColumnDropped: null,
			_onRowGetClasses: null,
			_onColumnGetValue: null,
			_onColumnRenderCell: null,

/**--		#CVLN-20220118-1-workaround */			
			visibleChanged() {
				if(this.isVisible()) {
					// this.print("#CVLN-20220118-1 Calling rowHeightChanged-workaround");
					this._body.rowHeightChanged();
				}
				return this.inherited(arguments);
			},

/**--		overrides ../Component.prototype */
			destroy: function() {
				/** @overrides ../Component.prototype.destroy */
				this.setSource(null);

				this._header.destroy();
				this._body.destroy();
				this._footer.destroy();

				// this._columns will change while nilling listview reference
				var columns = [].concat(this._columns);
				for(var i = 0; i < columns.length; ++i) {
					columns[i].setList(null);
				}

				return this.inherited(arguments);
			},
			getChildren: function(func, root) {
				/** @overrides ../Component.prototype.getChildren */
				this.inherited(arguments);
				if(root !== this) {
					this._columns.forEach(function(column) {
						if(column.getOwner() === root) {
							func(column);
						}
					});
				}
			},
			loaded: function() {
				/** @overrides ../Component.prototype.loaded */
				this.inherited(arguments);
				if(this._sourceSetWhileLoading === true) {
					delete this._sourceSetWhileLoading;
					this.setCount(this._source.getSize());
				}
			},
			
/**--		overrides ../Control.prototype */
			initializeNodes: function() {
				/** @overrides ../Control.prototype.initializeNodes */
				this.inherited(arguments);

				this._nodes.body = this.getChildNode(0);
				this._nodes.scroll = this.getChildNode(0, 0);

				var thisObj = this;

				/**
				 *
				 */
				this._nodes.body.onscroll = function(e) {
					//EventDispatcher.handleEvent;
					thisObj.onscroll(e);
				};
				this._nodes.body.scrollTop = this._topRow * this._rowHeight;

				this._header.nodeNeeded();
				this._footer.nodeNeeded();
				this._body.nodeNeeded();
				if(this._source === null || this._source.isBusy() === false) {
					this.removeClass("busy");
				}
			},
			alignControls: function(callback) {
				/** @overrides ../Control.prototype.alignControls */
				var thisObj = this;
				
				var args; args = [function(rect) {
					var h = parseInt(thisObj.getComputedStylePropValue("height"), 10);
					h -= rect.top;
					h -= rect.bottom;
					thisObj.setVisibleRowCount(Math.round(h / thisObj._rowHeight));

					var bw = thisObj.getBodyWidth();
					var bh = thisObj.getBodyHeight();
					var s = thisObj._nodes.scroll.style;
					s.left = js.sf("%dpx", bw);
					s.top = js.sf("%dpx", bh + rect.top);

					thisObj._body.setBounds(rect.left, rect.top - 3, undefined, undefined, bw, bh);
				}];

				args.callee = arguments.callee;

				return this.inherited(args);
			},
			getClientRect: function() {
				/** @overrides ./Panel.prototype.getClientRect */
				var r = this.inherited(arguments);
				// Adjust for the scrollbars which are rendered in this._nodes.body
				r.right = (this._node.clientWidth - this._nodes.body.clientWidth);
				r.bottom = (this._node.clientHeight - this._nodes.body.clientHeight);
				return r;
			},
			getClientNode: function(control) {
				/** @overrides ../Control.prototype.getClientNode */
				if(control === this._body) {
					return this._nodes.body;
				}
				return this._node;
			},
			onscroll: function(evt) {
				/** @overrides ../Control.prototype.scroll */
				if(evt.target === this._nodes.body) {
					this.notifyEvent("setScrollLeft", this._nodes.body.scrollLeft);

					var me = this;
					var topRow = parseInt(me._nodes.body.scrollTop / me._rowHeight, 10);
					me._topRow = topRow;
					
					me.render_();
				}

workaroundColumnAlignment(this);

				return this.inherited(arguments);
			},
			storeScroll: function() {
				/** @overrides ../Control.prototype.storeScroll */
				if(this._nodes !== null) {
					this._scrollLeft = this._nodes.body.scrollLeft;
					this._scrollTop = this._nodes.body.scrollTop;
				}
			},
			restoreScroll: function() {
				/** @overrides ../Control.prototype.restoreScroll */
				if(this._nodes !== null) {
					// leave as is for IE
					var body = this._nodes.body;
					if(body !== null && (this._scrollLeft !== body.scrollLeft || this._scrollTop !== body.scrollTop)) {
						body.scrollLeft = this._scrollLeft;
						body.scrollTop = this._scrollTop;
					}
				}
			},
			dispatchChildEvent: function(component, name, evt, f, args) {
				/** @overrides ../Control.prototype.dispatchChildEvent */
				if(name === "mousedown" && evt.shiftKey === true) {
					// prevent selection with mouse
					evt.preventDefault();
				} else if(component instanceof ListRow) {
					if(["dblclick", "dragenter", "dragover", "dragleave", "drop"].indexOf(name) !== -1) {
						this.dispatch(name, evt);
					} else if(name === "click") {
						var rowIndex = component._rowIndex;
						var selection;
						if(evt.ctrlKey === true || evt.metaKey === true) {
							if(this.isRowSelected(rowIndex)) {
								var index = this._selection.indexOf(rowIndex);
								selection = [].concat(this._selection);
								selection.splice(index, 1);
							} else {
								selection = this._selection.concat([rowIndex]);
							}

						} else if(evt.shiftKey === true) {
							var length = this._selection.length;
							var prev = length > 0 ? this._selection[length - 1] : 0;
							var i;

							HtmlElement.clearSelection();

							if(prev === rowIndex) {
								selection = this._selection;
							} else {
								selection = [];
								if(this.isRowSelected(prev)) {
									selection.push(prev);
								}
								if(prev < rowIndex) {
									for(i = prev + 1; i <= rowIndex; ++i) {
										if(!this.isRowSelected(i)) {
											selection.push(i);
										}
									}
								} else {
									for(i = prev - 1; i >= rowIndex; --i) {
										if(!this.isRowSelected(i)) {
											selection.push(i);
										}
									}
								}
							}
						} else {
							selection = [component._rowIndex];
							evt.preventDefault();
						}
						this.setSelection(selection);
						this.dispatch("click", evt);
					}
				}
				return this.inherited(arguments);
			},
			onresize: function(evt) {
				/** @overrides ../Control.prototype.onresize */
				this.alignControls();
				return this.inherited(arguments);
			},
			onkeydown: function(evt) {
				/** @overrides ../Control.prototype.onkeydown */
				var r = this.inherited(arguments);
				if(r !== false) {
					if(evt.keyCode === 13 && this._selection.length) {
						if(this._action && this._action.isEnabled() && this._executesAction === "onRowDblClick") {
							this._action.execute(evt, this);
						}
					} else if(evt.keyCode === 38 || evt.keyCode === 33) {
						if(this._selection.length) {
							var index = this.getSelection().pop() - 1;
							if(index >= 0) {
								this.setSelection([index]);
								if(index < this._topRow + 1) {
									this.setTopRow(this._topRow - parseInt(this._visibleRowCount / 2));
								}
							}
						} else if(this._count) {
							this.setSelection([0]);
						}
					} else if(evt.keyCode === 40 || evt.keyCode === 34) {
						if(this._selection.length) {
							var index = this.getSelection().pop() + 1;
							if(index < this._count) {
								this.setSelection([index]);
								if(this._topRow + this._visibleRowCount - 2 < index) {
									this.setTopRow(this._topRow + parseInt(this._visibleRowCount / 2));
								}
							}
						} else if(this._count) {
							this.setSelection([0]);
						}
					}
				}
				return r;
			},

			notifyEvent: function(event, data) {
				if(event === "columnsChanged") {
					this.fire("onColumnsChanged", data)
				}
			},
			render_: function(bodyUpdateRows/*TODO*/) {
				if(bodyUpdateRows) return this._body.updateRows();
				
				var vrc = this.getVisibleRowCount(true);

				if(this._topRow > this._count - vrc + 1) {
					this._topRow = this._count - vrc + 1;
				}

				var start = this._topRow - this._rowBuffer;
				var end = start + vrc + this._rowBuffer * 2;

				if(start < 0) {
					start = 0;
				}

				if(end > this._count - 1) {
					start = start - (end - (this._count - 1));
					if(start < 0) {
						start = 0;
					}
					end = this._count - 1;
				}

				// if(this._count > 0 && this._source !== null && this._source.isActive()) {
				// 	if(this._sourceMonitor === null || this._sourceMonitor.start !== start || this._sourceMonitor.end !== end) {
				// 		var me = this;
				// 		if(this._sourceMonitor !== null) {
				// 			this._source.releaseMonitor(this._sourceMonitor);
				// 		}
				// 		this._sourceMonitor = this._source.getMonitor(start, end);
				// 		this._sourceMonitor.process = function() {
				// 			me.setTimeout("updateBodyRows", function() {
				// 				me._body.updateRows();
				// 			}, 10);
				// 		};
				// 		this.setTimeout("render", function() {
				// 			// this._source.getObjects(this._topRow, this._topRow + vrc);
				// 			this._source.getObjects(start, end);
				// 			this._source.getObjects(this._topRow, this._topRow + vrc);
				// 		}.bind(this), 50);
				// 	}
				// }

				if(end > start && this._source !== null && this._source.isActive()) {
					this.setTimeout("render", () => {
						if(this._source.isActive() && this._source.getSize()) {
							this._source.getObjects(this._topRow, this._topRow + vrc);
							this._source.getObjects(start, end);
						}
					}, 50);
				}
				this._body.render_();
			},
			renderCell: function(cell, row, column) {
				var value, orgValue;
				if(column._attribute !== "") {
					orgValue = (value = this._source.getAttributeValue(column._attribute, row));
				}
				
				if(value === Source.Pending) {
					value = "-";
				} else if(column._wantsNullValues || (value !== null && value !== undefined)) {
					if(column._displayFormat !== "") {
						value = js.sf(column._displayFormat, value);
					}
					if(column._onGetValue !== null) {
						value = column.fire("onGetValue", [
						        value, row, this._source]);
					}
					if(this._onColumnGetValue !== null) {
					    value = this.fire("onColumnGetValue", [
					            column, value, row, this._source]);
					}
					if(column._onRenderCell !== null) {
						if(column.fire("onRenderCell", [cell, value, column, 
							    row, this._source, orgValue]) === false) {
							return;
						}
					}
					if(this._onColumnRenderCell !== null) {
					    if(this.fire("onColumnRenderCell", [cell, value, column, 
							    row, this._source, orgValue]) === false) {
					        return;
					    }
					}
					if(this._formatDates === true && this.isDate(value)) {
						value = this.formatDate(value);
					}
				}
				
				if(value === null || value === undefined || value === "") {
					value = column._rendering === "textContent" ? List.space : "&nbsp;";
				} else if(value instanceof Array) {
					// TODO (could be [string, date, null, undefined, etc])
					if(typeof value[0] !== "object") {
						value = value.join("");
					} else {
						// value = value.map(_ => js.nameOf(_)).join(", ");
						value = js.sf("%s, ... (%d)", js.nameOf(value[0]), value.length);
						// value = String(value.length);
					}
				} else {
					value = js.sf("%n", value);
				}

				if(column._rendering === "textContent") {
					cell.textContent = value;
				} else {
					cell.innerHTML = value;
				}
				column.autoWidth(cell.textContent, cell);
				
workaroundColumnAlignment(this);
			},
			isDate: function(value) {
				return (value instanceof Date) || (typeof value === "string" && 
					value.length === 24 && value.endsWith("Z"));
			},
			formatDate: function(value, opts) {
				if(!(value instanceof Date)) value = new Date(value);
				if(opts && opts.utc) {
					return js.sf("%d/%02d/%02d %02d:%02d", value.getUTCFullYear(), value.getUTCMonth() + 1,
							value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes());
				}
				
				return js.sf("%d/%02d/%02d %02d:%02d", value.getFullYear(), value.getMonth() + 1,
						value.getDate(), value.getHours(), value.getMinutes());
			},

			getBodyWidth: function() {
				var r = 0;
				for(var i = 0; i < this._columns.length; ++i) {
					var column = this._columns[i];
					if(column.isVisible() === true) {
						if(i < this._header._controls.length) {
							// this.print("getBodyWidth-adding", parseInt(this._header._controls[i].getComputedStylePropValue("width"), 10));
							r += parseInt(this._header._controls[i].getComputedStylePropValue("width"), 10);
						} else {
							// this.print("getBodyWidth-adding", column.getWidth());
							r += column.getWidth();
						}
					}
				}
				return r;
			},
			getBodyHeight: function() {
				return this._count * this._rowHeight;
			},
			getCount: function() {
				return this._count;
			},
			setCount: function(value) {
				if(this._count !== value) {
					this._count = value;
					this.setSelection([]);
					if(value === 0) {
						this.resetColumnAutoWidth();
					}
					//this.alignControls();
					this.render_();
					// this.nextTick(() => this._body.updateRows());
					// value && this._body.updateRows();
				}
			},

			getRowClasses: function(row) {
				if(this._onRowGetClasses !== null) {
					return this.fire("onRowGetClasses", [row]) || [];
				}
				return [];
			},
			getRowHeight: function() {
				return this._rowHeight;
			},
			setRowHeight: function(value) {
				if(this._rowHeight !== value) {
					this._rowHeight = value;
					this.alignControls();
					this._body.rowHeightChanged();
				}
			},
			isRowSelected: function(rowIndex) {
				return this._selection.indexOf(rowIndex) !== -1;
			},
			getTopRow: function() {
				return this._topRow;
			},
			setTopRow: function(value) {
				if(value >= 0 && value < this._count) {
					if(this._nodes !== null) {
						this._nodes.body.scrollTop = value * this._rowHeight;
					} else {
						this._topRow = value;
					}
				}
			},
			getVisibleRowCount: function(adjusted) {
				if(adjusted && this._visibleRowCount > this._count) {
					return this._count;
				}
				return this._visibleRowCount;
			},
			setVisibleRowCount: function(value) {
				if(this._visibleRowCount !== value) {
					this._visibleRowCount = value;
					this.render_();
				}
			},
			
			columnPropertyChanged: function(column, which, newValue) {
				if(which === "width") {
					if(this._node !== null) {
						this.setTimeout("applyBounds", 100);
					}
				} else if(which === "visible") {
					if(this._node !== null) {
						this.notifyEvent("columnsChanged", {
							type: "visible",
							column: column,
							newValue: newValue
						});
					}
				} else if(which === "index") {
					this._columns = Array.move(this._columns, newValue.oldValue, newValue.newValue);
					if(this._node !== null) {
						this.notifyEvent("columnsChanged", {
							type: "visible",
							column: column,
							newValue: newValue
						});
					}
				} else if(which === "attribute" || which === "onGetValue" || which === "onRenderCell" || which === "displayFormat") {
					if(this._node !== null) {
						this._body.updateRows();
					}
				}
			},
			getColumnCount: function() {
				return this._columns.length;
			},
			getColumn: function(index) {
				return this._columns[index];
			},
			getColumnByAttribute: function(attribute) {
				for(var i = 0, l = this._columns.length; i < l; ++i) {
					var c = this._columns[i];
					if(c._custom === false && c._attribute === attribute) {
						return c;
					}
				}
				return null;
			},
			getColumnByName: function(name) {
				for(var i = 0, l = this._columns.length; i < l; ++i) {
					var c = this._columns[i];
					if(c._custom === false && c._name === name) {
						return c;
					}
				}
				return null;
			},
			insertColumn: function(column, index) {
				this._columns.push(column);
				column._list = this;
				if(index !== undefined) {
					var begin = this._columns.splice(0, index);
					var end = this._columns.splice(0, this._columns.length - 1);
					this._columns = begin.concat(this._columns).concat(end);
				}
				column.setParent(this._header);
				column.setIndex(index);
				this.notifyEvent("columnsChanged", {
					type: "add",
					column: column,
					index: index
				});
			},
			removeColumn: function(column) {
				this._columns.splice(this._columns.indexOf(column), 1);
				column._list = null;
				column.setParent(null);
				this.notifyEvent("columnsChanged", {
					type: "remove",
					column: column
				});
			},
			addColumn: function(owner) {
				var column = new ListColumn(owner || this._autoColumns === true ? this : this._owner);
				column.setList(this);
				return column;
			},
			columnDropped: function(column, target) {
				if(this.dispatch("columndrop", {
					column: column,
					target: target
				}) !== false) {
					if(target === null) {
						column.setVisible(false);
					} else {
						column.setIndex(target.getIndex());
					}
				}
			},
			getColumnIndex: function(column) {
				return this._columns.indexOf(column);
			},
			setColumnIndex: function(column, newIndex) {
				var curIndex = this.getColumnIndex(column);
				if(curIndex !== newIndex && newIndex >= 0 && newIndex < this._columns.length) {
					this._columns = Array.move(this._columns, curIndex, newIndex);
					this.notifyEvent("columnsChanged", {
						type: "setColumnIndex",
						oldValue: curIndex,
						newValue: newIndex
					});
				}
			},
			getColumns: function() {
				return this._columns;
			},
			destroyColumns: function() {
				while(this._columns.length) {
					this._columns[0].destroy();
				}
				this.notifyEvent("columnsChanged");
			},
			updateColumns: function() {
				var updateColumns = this.updateColumns;

				this.updateColumns = () => console.log("updateColumns blocked");
				this.resetColumnAutoWidth(); 
				
				try {
					if(this._source !== null) {
						var columns = [].concat(this._columns);
						var attributes = [];
						var changed = false;
						var attrs = this._source.getAttributeNames();
						var capit = this.vars("autoColumns.capitalize", 0, true);
						var shuffle = this.vars("autoColumns.attributeInFront", 0, true);
						var onInit = this.vars("autoColumns.onColumnInit");

						for(var i = 0; i < attrs.length; ++i) {
							var column = this.getColumnByAttribute(attrs[i]);
							if(column === null) {
								column = this.addColumn();
								column.setAttribute(attrs[i]);
								var s = attrs[i].split(":").pop().split(".");
								if(s.length > 1) {
									if(shuffle) {
										s = [s.pop()].concat(s).join(".");
									} else {
										s = s.join(".");
									}
								} else {
									s = s[0];
								}
								if(capit) {
									s = capitalize(s);
								}
								column.setContent(s);
								column.setList(this);
								onInit && onInit.apply(this, [column]);
								changed = true;
							}
							attributes.push(attrs[i]);
						}

						// TODO `#CVLN-20201004-1` deal with a lot of columns
						// for(i = 0; i < columns.length; ++i) {
						// 	if(columns[i]._custom === false && (
						// 			columns[i]._attribute === "" ||
						// 			attributes.indexOf(columns[i]._attribute) === -1)) {
						// 		columns[i].destroy();
						// 	}
						// }

						if(changed === true) {
							this.notifyEvent("columnsChanged", [], true);
						}
					} else {
						this.destroyColumns();
					}
				} finally {
					this.updateColumns = updateColumns;
				}
			},
			resetColumnAutoWidth: function() {
				for(var i = 0; i < this._columns.length; ++i) {
					this._columns[i].setAutoWidthValue("", true);
				}
				this.render_();
			},
			getAutoColumns: function() {
				return this._autoColumns;
			},
			setAutoColumns: function(value) {
				if(this._autoColumns !== value) {
					this._autoColumns = value;
					this.updateColumns();
				}
			},
			getOnColumnDropped: function() {
				return this._onColumnDropped;
			},
			setOnColumnDropped: function(value) {
				this._onColumnDropped = value;
			},
			getOnColumnGetValue: function() {
				return this._onColumnGetValue;
			},
			setOnColumnGetValue: function(value) {
				this._onColumnGetValue = value;
			},
			
			sourceNotifyEvent: function(event, data) {
// this.app().print(js.sf("event: %s - data: %s => busy: %s, count: %s, topRow: %s", event, data, this.hasClass("busy"), this._count, this._topRow))
				switch(event) {

					case SourceEvent.activeChanged:
						this.setCount(this._source.getSize());
						break;

					case SourceEvent.changed:
						this.setCount(this._source.getSize());
						this.notifyEvent("updateRows", {start: 0, end: this._source.getSize() - 1});
/*- FIXME Following line is necessary in order to make sure that the scrollbars are visible */
						this.isVisible() && this.alignControls();
						break;

					case SourceEvent.busyChanged:
						
						this.setTimeout("update-busy", function() {
							if((data && this._count > 0) || this.hasClass("ignore-busy")) { /* TODO what about scrolling up? */
								return;
							}
							if(data && !this.hasClass("busy")) {
								this.addClass("busy");
							} else if(!data && this.hasClass("busy")) {
								this.removeClass("busy");
							}
						}.bind(this), 100);
						break;

					case SourceEvent.updated:
						if(this.hasClass("busy")) {
							this.removeClass("busy");
						}
						this.notifyEvent("updateRows", data);
						break;

					case SourceEvent.layoutChanged:
						if(this._autoColumns === true) {
							this.updateColumns();
							this.render_(true);
						}
						break;
				}
			},
			sourceDestroyed: function() {
				this.setSource(null);
			},
			getSource: function() {
				return this._source;
			},
			setSource: function(value) {
				if(this._source !== value) {
					if(this._source !== null) {
						if(this._sourceMonitor !== null) {
							this._source.releaseMonitor(this._sourceMonitor);
							this._sourceMonitor = null;
						}
						Method.disconnect(this._source, "notifyEvent", this, "sourceNotifyEvent");
						Method.disconnect(this._source, "destroy", this, "sourceDestroyed");
						this.setCount(0);
					}
					this._source = value;
					if(this._source !== null) {
						Method.connect(this._source, "notifyEvent", this, "sourceNotifyEvent");
						Method.connect(this._source, "destroy", this, "sourceDestroyed", "before");
						if(!this.isLoading()) {
							this.setCount(this._source.getSize());
						} else {
							this._sourceSetWhileLoading = true;
						}
					}
					this.sourceNotifyEvent(SourceEvent.layoutChanged);
				}
			},
			
			onselectionchange: function() {
				return this.fire("onSelectionChange", arguments);
			},
			oncolumndrop: function() {
				return this.fire("onColumnDropped", arguments);
			},

			valueByColumnAndRow(column, row) {
				var value = this._source.getAttributeValue(column._attribute, row, true);
				if(column._wantsNullValues || (value !== null && value !== undefined)) {
					if(column._displayFormat !== "") {
						value = js.sf(column._displayFormat, value);
					}
					if(column._onGetValue !== null) {
						value = column.fire("onGetValue", [value, row, this._source]);
					}
					if(this._onColumnGetValue !== null) {
					    value = this.fire("onColumnGetValue", [column, value, row, this._source]);
					}
					if(this._formatDates === true && this.isDate(value)) {
						value = this.formatDate(value);
					}
				}
				return value;
			},
			groupBy(column/*, ... TODO */) {
				var r = {};
				this._source.getObjects().forEach((obj, row) => {
					var value = this.valueByColumnAndRow(column, row);
					(r[value] = r[value] || []).push(obj);
				});
				return r;
			},
			sortBy(column, dir, numeric) {
				const sv = column.get("onSortValues");

				dir = dir === "desc" ? - 1 : 1;
				
				if(typeof column === "string") {
					column = column.split(" ");
					if(arguments.length === 1) {
						dir = column[1];
					}
					if(column.length === 2) {
						numeric = column[2] === "numeric";
					}
					column = this.getColumnByName(column[0]);
				} else if(typeof column === "number") {
					column = this.getColumn();
				}

				this._source.sort(
					(i1, i2) => {
						var row1 = this._source._array.indexOf(i1);
						var row2 = this._source._array.indexOf(i2);
	
						if(sv) {
							i1 = this._source.getAttributeValue(column._attribute, row1, true);
							i2 = this._source.getAttributeValue(column._attribute, row2, true);
	
							return dir * sv(i1, i2);
						}

						i1 = this.valueByColumnAndRow(column, row1);
						i2 = this.valueByColumnAndRow(column, row2);

						if(i1 === i2) return 0;
						
						if(i1 === undefined || i1 == null) return dir * 1;
						if(i2 === undefined || i2 == null) return dir * -1;

						if(numeric === true) {
							if(isNaN(i1 = parseFloat(i1))) return dir * 1;
							if(isNaN(i2 = parseFloat(i2))) return dir * -1;
						} else if(typeof i1 === "object") {
							i1 = js.nameOf(i1);
							i2 = js.nameOf(i2);
						}
	
						return (i1 < i2 ? -1 : 1) * dir;
					});
			},
			
			hasSelection: function() {
				return this._selection.length > 0;
			},
			getSelection: function(asObjects) {
				var r = [].concat(this._selection);
				if(asObjects === true) {
					for(var i = 0, l = r.length; i < l; ++i) {
						r[i] = this._source.getObject(r[i]);
					}
				}
				return r;
			},
			setSelection: function(value) {
				var oldValue = this._selection || [];
				var length = oldValue.length;

				if(length === value.length) {
					var equals = true;
					for(var i = 0; i < length && equals === true; ++i) {
						equals = oldValue[i] === value[i];
					}
					if(equals === true) {
						return; // no change
					}
				}

                // FIXME validate selection
				this._selection = value;
				this.dispatch("selectionchange", {
					newValue: value,
					oldValue: oldValue
				});
				this.updateChildren(true, true);
			},
			selectAll: function() {
				var selection = [];
				for(var i = 0; i < this._count; ++i) {
					selection.push(i);
				}
				this.setSelection(selection);
			},
			getOnSelectionChange: function() {
				return this._onSelectionChange;
			},
			setOnSelectionChange: function(value) {
				this._onSelectionChange = value;
			}
		},
		properties: {
			"align": {
				set: Function,
				type: Panel.ALIGN
			},
			"autoColumns": {
				type: Class.Type.BOOLEAN,
				set: Function
			},
			"columns": {
				type: Class.Type.ARRAY,
				stored: false,
				visible: false
			},
			"executesAction": {
				type: ["No", "onClick", "onRowDblClick"]
			},
        	"focusable": {
        		type: Class.Type.BOOLEAN,
        		set: Function
        	},
			"onSelectionChange": {
				type: Class.Type.EVENT,
				editorInfo: {
					defaultValue: "(function(data) {})"
				}
			},
			"onColumnsChanged": {
				type: Class.Type.EVENT
			},
			"onColumnDropped": {
				type: Class.Type.EVENT
			},
			"onColumnGetValue": {
				type: Class.Type.EVENT,
				editorInfo: {
					defaultValue: "(function(column, value, rowIndex, source) {})"
				}
			},
			"onColumnRenderCell": {
				type: Class.Type.EVENT,
				editorInfo: {
					defaultValue: "(function(cell, value, column, row, source, orgValue) {})"
				}
			},
			"onGetRowClasses": { // TODO deprecated
				get: function() { return this._onRowGetClasses; },
				set: function(value) { this._onRowGetClasses = value; },
				type: Class.Type.EVENT,
				editorInfo: {
					defaultValue: "(function(row) {})"
				}
			},
			"onRowGetClasses": {
				type: Class.Type.EVENT,
				editorInfo: {
					defaultValue: "(function(row) {})"
				}
			},
			"rowHeight": {
				type: Class.Type.INTEGER
			},
			"source": {
				set: Function,
				type: Component
			}
		},
		statics: {
			space: String.fromCharCode(require("util/Browser").win ? 32 : 0)
		}
	};

	return (List = Class.define(require, List));
});