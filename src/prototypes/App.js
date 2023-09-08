"";

["vcl/Application", { }, [
    ["vcl/ui/Panel", ("window"), { 
    	align: "client", classes: "animated",
		onLoad() { 
			this.setParentNode(document.body); 
		}
    }]
]];