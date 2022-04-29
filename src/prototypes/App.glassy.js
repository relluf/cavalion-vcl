"use vcl/CssRules";

var CssRules = require("vcl/CssRules");

var css = {
	".with-shadow": "box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 2px 0px;",
	".transparent": "background-color:transparent;",
	".glassy-overlay": {
		"": "pointer-events: none; color:rgba(5,5,5,0.95);",
 		".glassy": "background-color: rgba(155, 155, 155, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
		".with-text-shadow": "text-shadow: rgb(255 255 255) 0px 0px 12px, #00000094 0px 0px 5px;",
		".loading": "background: rgba(155, 155, 155, 0.35) url(/shared/vcl/images/loading.gif) 50% 50% no-repeat;",
		".rounded": "padding: 4px; border-radius: 5px;",
		".animate-width-height": "transition: width 250ms ease-in, height 250ms ease-in;",
		">.glassy:not(.no-margin)": "margin: 32px;",
		">.glassy": {
			"": "pointer-events: auto;",
			// "&:hover": "backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);"
		},
		">.vcl-ui-Element": "pointer-events: auto;",
		".vcl-ui-Node": {
			"&.invisible-layer": "opacity: 0.4;",
	    	"&.seperator": "border-top:1px solid rgba(155,155,155,0.55);margin-top:2px;padding-top:2px;",
			">.text>img": "width:20px;height:20px;"
		}
	}
};

["", {
	onLoad() {
		var rules = new CssRules();
		rules.setSelector("body");//.glassy");
		rules.setRules(css);
		this.vars("css-rules", rules);
		
		return this.inherited(arguments);
	}	
}];