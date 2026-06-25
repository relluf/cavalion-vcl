"use devtools/Parser";

const Parser = require("devtools/Parser");

const HOTKEY_ALWAYS_ENABLED = {
	isHotkeyEnabled() { 
		if(this._owner.isEnabled()) {
			return (Control.focused || this).up("devtools/Workspace<>") === null;
		}
		return false;
	}
};

["", {}, [

    ["vcl/Action", ("format"), {
    	hotkey: "Shift+MetaCtrl+F",
		overrides: HOTKEY_ALWAYS_ENABLED,
    	on(evt) {
    		const ace = getAce();
    		if(ace) {
    			Parser.format(ace);
    		}
    	}
    }],
    ["vcl/Action", ("print"), {
    	hotkey: "MetaCtrl+Enter|Shift+MetaCtrl+Enter",
		overrides: HOTKEY_ALWAYS_ENABLED,
    	on(evt) {
    		const ace = evt.ace || getAce();
    		if(ace) {
	    		const resource = ace.vars(["resource"]);
	    		const doc = ace.vars(["instance"]) || {};
	    		const name = (uri) => uri.split("/").pop();
	    		
	    		let console = evt.shiftKey ? this.ud("#console") : (
	    			evt.console || ace.ud("> #console"));
	    		if(!console || !console.isVisible()) {
	    			console = this.ud("#console");
	    		}
	    		
	    		try {
		    		const root = Parser.getRoot(ace, {
		    			javascript: { eval_: (expr) => 
		    				this.ud("#console")._onEvaluate(expr, { ace: ace })
		    			}
		    		});
		    		
					(console || this.app()).print(name(resource ? resource.uri : (doc.id || doc.naam || "")), root);
	    		} catch(e) {
					(console || this.app()).print(name(resource ? resource.uri : (doc.id || doc.naam || "")), e);
	    		}
    		}
    	}
    }]
	
]];
