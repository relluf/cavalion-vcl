$("vcl/Application", {
	onLoad: function() {
    	var img = document.body.childNodes[0];
    	if(img.nodeName === "IMG") {
    		img.parentNode.removeChild(img);
    	}
    	
		var scope = this.scope(), delegate;
        scope.window.setParentNode(this.isDesigning() ?
    		scope.window.getDesigner().getParentNode() : 
    		document.body);
	}
}, [
    $("vcl/ui/Panel", "window", { 
    	align: "client", 
    	classes: "animated",
		css: {
			// "background": "-webkit-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(255, 255, 255) 50%, #fafafa 100%)",
			"font-family": "Lucida Grande, Arial, sans-serif",
			"font-size": "9pt",
			".{./Button}": {
				"font-family": "Lucida Grande, Arial, sans-serif",
				"font-size": "9pt"
			}
		}
    }, [])
]);