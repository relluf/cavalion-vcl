"use vcl/ui/Popup, vcl/ui/List";

["vcl/Application", { }, [
    ["vcl/ui/Panel", ("window"), { 
    	align: "client", classes: "animated",
		onLoad() { 
			this.setParentNode(document.body); 
			
			req("vcl/ui/Popup").prototype.setParent = function(value) {
				return this.inherited(arguments);
			},
			req("vcl/ui/Popup").prototype._parent = this;
		}
    }]
]];