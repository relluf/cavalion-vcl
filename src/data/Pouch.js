define(function(require) {
	
	var SourceEvent = require("../../data/SourceEvent");
	var Source = require("../../data/Source");
	var Pouch = require("js/defineClass");
	var Type = require("js/Type");
	var BaseArray = require("./Array");
	
	var PouchDB = require("pouchdb");
	
	function put(keys, db, instance, id, doc) {
		doc = doc || {_id: id};
		keys.forEach(function(k) {
			if(instance.hasOwnProperty(k + "$")) {
				doc[k] = instance[k + "$"];
			} else {
				doc[k] = instance[k];
			}
		});
		
		// db.put(updated version);
		delete doc.id;
		return db.put(doc);
	}
	function getPageOptions(page, pagesize, pages, array) {
		var options = { include_docs: true, limit: pagesize }, 
			nofpages = pages.length, lastpagesize = array.length % pagesize;
			
		if(page === 0) {
			return options;
		} else if(page === nofpages - 1) {
			options.descending = true;
			options.limit = (lastpagesize + pagesize) % pagesize;
			return options;
		}

		var pagebefore = page - 1, pageafter = page + 1;
		// determine page before requested page
		while(pagebefore > 0 && pages[pagebefore] !== true) {
			pagebefore--;
		}

		// determine page after requested page
		while(pageafter < nofpages && pages[pageafter] !== true) {
			pageafter++;
		}

		// which is closer?
		if(pageafter < nofpages && pagebefore > 0 && 
				(page - pagebefore > pageafter - page)) {
			// pageafter is closer, pretend pagebefore was never found
			pagebefore = -1;
		}
		
		if(pages[pagebefore] === true) {
			// start with the last object of the previous page
			options.startkey = array[(pagebefore + 1) * pagesize - 1]._id;
			// and skip it since it's already fetch
			options.skip = 1 + ((page - pagebefore - 1) * pagesize); 
		} else if(pages[pageafter] === true) {
			options.descending = true;
			// start with the last object of the previous page
			options.startkey = array[pageafter * pagesize]._id;
			options.skip = 1 + ((pageafter - page - 1) * pagesize); 
		} else {
			options.skip = page * pagesize;
		}
		
		return options;
	}

	
	return (Pouch = Pouch(require, {
		inherits: BaseArray,
		prototype: {
			_adapter: "",
			_dbName: "",
			_db: null,
			_sync: "",
			_pageSize: 25,
			_pages: null,
			_includeDocs: true,
			_requesting: null,
			
			_busyCount: 0,

			loaded: function() {
				/** @overrides ./Component.prototype.loaded */
				if(this._refreshWL) {
					delete this._refreshWL;
					this.refresh();
				}
				return this.inherited(arguments);
			},
			getObjects: function(start, end) {
				var arr = this.inherited(arguments);
				var from = Math.floor(start / this._pageSize);
				var to = Math.floor(end / this._pageSize);
				for(var p = from; p <= to; ++p) {
					this.getPage(p);
				}
				return arr;
			},
			getPage: function(page) {
				var me = this, arr = this._array;

				this._requesting = this._requesting || [];
				if(this._requesting.current) {
					this._requesting.push(page);
					return this._requesting.current.then(function(r) { 
						me.getPage(me._requesting.pop()); 
						return r;
					});
				}

				this._pages = this._pages || [];
				if(this._pages[page] === undefined) {
					var options = getPageOptions(page, this._pageSize, this._pages, arr);
					var start = page * this._pageSize;

					this.incBusy();
console.log("requesting page", page, options);
					this._requesting.current = this._pages[page]
					= this._db.allDocs(options).then(function(result) {
						me._requesting.shift();
						me._pages[page] = true;
						delete me._requesting.current;
						
						result.rows.forEach(function(item, index) {
							if(options.descending) {
								arr[start + result.rows.length - index - 1] = item.doc;	
							} else {
								arr[start + index] = item.doc;
								// item.doc.index = index + start;
							}
						});
						if(page === 0) {
							me.notify(SourceEvent.layoutChanged);
						}
						me.notify(SourceEvent.changed);
						me.decBusy();
						return result;
					}).catch(function(e) {
						me.decBusy();
						console.error(e);
					});
				}
			},

			incBusy: function() {
				if(this._busyCount++ === 0) {
					this.setBusy(true);
				}
			},
			decBusy: function() {
				if(--this._busyCount === 0) {
					this.setBusy(false);
				}
			},
			
			changes: function(evt) {
		        this._changes = (this._changes || []);
		        this._changes.push(evt.changes);

		        var me = this;
		        this.setTimeout("count" + Math.floor(Date.now() / 1000), function() {
			        me._db.info(function(error, info) {
			        	var size = me.getSize();
			        	if(size === 0) {
			        		me.setArray(info.doc_count);
		        			me.notify(SourceEvent.layoutChanged);
			        	} else {
			        		var arr = Array(info.doc_count - size);
			        		me.push.apply(me, Array.from(
			        			arr, () => Source.Pending));
			        	}
			        
			        	if(info.doc_count !== size) {
			        		delete me._pages;
			        		console.log("resetting count", size, '->', 
			        			info.doc_count, [].concat(me._array));
			        	}
			        });
		        }, 250);
			},
			refresh: function() {
				if(this.isLoading()) {
					this._refreshWL = true;
					return;
				}

				var me = this;
				if(me._db === null) {
					var opts = {};
					if(me.hasOwnProperty("_adapter")) {
						opts.adater = me._adapter;
					}
					me._db = new PouchDB(me._dbName, opts);
					delete me._pages;
					
					me._db.info(function(error, info) {
						console.log(me._name, "db info", arguments);
						me.setArray(info.doc_count);
						me._db.changes({since: "now", live: true})
							.on("change", function(evt) {
						        // console.log(me._name, "db changes", evt);
								me.changes(evt);
							});
					});
					if(me._sync) {
						me._db.sync(me._sync, { live:true }, function() {
							console.error("db sync error", arguments);
						});
					}
				}
			},
			
			getDbName: function() {
				return this._dbName;
			},
			setDbName: function(value) {
				if(this._dbName !== value) {
					delete this._db;
					
					this._dbName = value;
					this.refresh();
				}
			},
			setSync: function(value) {
				if(this._sync !== value) {
					delete this._db;
					
					this._sync = value;
					this.refresh();
				}
			}
			
		},
		properties: {
			dbName: { type: Type.STRING, get: Function, set: Function },
			sync: { type: Type.STRING, set: Function }
		}
	}));

});