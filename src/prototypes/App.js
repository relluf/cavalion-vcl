"use vcl/ui/Node, vcl/ui/Button";

[("vcl/Application"), {
	onLoad: function() {
    	var img = document.body.childNodes[0];
    	if(img && img.nodeName === "IMG") {
    		img.parentNode.removeChild(img);
    	}
    	
		var scope = this.scope(), delegate;
        scope.window.setParentNode(this.isDesigning() ?
    		scope.window.getDesigner().getParentNode() : 
    		document.body);
	}
}, [
    [("vcl/ui/Panel"), "window", { 
    	align: "client", 
    	classes: "animated",
		css: {
			// "font-family": "SF Pro Text, SF UI Text, system-ui, Helvetica Neue, Helvetica, Lucida Grande, Arial, sans-serif",
			"font-family": "Lucida Grande, Arial, sans-serif",
			"font-size": "9pt",
			".{./Button}": {
				"font-family": "Lucida Grande, Arial, sans-serif",
				"font-size": "9pt"
			},
			".with-shadow": "box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 2px 0px;",
			".transparent": "background-color:transparent;",
			".glassy-overlay": {
				"": "pointer-events: none; color:rgba(5,5,5,0.95); text-shadow: rgb(255 255 255) 0px 0px 12px, #00000094 0px 0px 5px;",
				">.{./Element}": "pointer-events: auto;",
				">.glassy:not(.no-margin)": "margin: 32px;",
				">.glassy": {
					"": "pointer-events: auto;",
					// "&:hover": "backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);"
				},
	
 				".glassy": "background-color: rgba(155, 155, 155, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
				".loading": "background: rgba(155, 155, 155, 0.35) url(/shared/vcl/images/loading.gif) 50% 50% no-repeat;",
				".rounded": "padding: 4px; border-radius: 5px;",
				".animate-width": "transition: width 250ms ease-in;",
				// ".glassy": {
				// 	"": "background: rgba(155, 155, 155, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
				// 	// "&:not(.no-animation)": "transition: backdrop-filter 350ms ease-in, -webkit-backdrop-filter 350ms ease-in;",
				// 	// "&:hover": "backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);"
				// },
				".with-shadow": "box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 2px 0px;",
				".{./Node}": {
					"&.invisible-layer": "opacity: 0.4;",
			    	"&.seperator": "border-top:1px solid rgba(155,155,155,0.55);margin-top:2px;padding-top:2px;",
					">.text>img": "width:20px;height:20px;"
				}
			}
		}
    }]
]];