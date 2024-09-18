"use vcl/CssRules, vcl/ui/Input";

var CssRules = require("vcl/CssRules");

var css = {
	".with-shadow": "box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 2px 0px;",
	".with-text-shadow": "text-shadow: rgb(255 255 255) 0px 0px 12px, #00000094 0px 0px 5px;",
	".transparent": "background-color:transparent;",
	".glassy-overlay": {
		"": "pointer-events: none; color:rgba(5,5,5,0.95);",
 		".glassy": "background-color: rgba(155, 155, 155, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
		".loading": "background: rgba(155, 155, 155, 0.35) url(/shared/vcl/images/loading.gif) 50% 50% no-repeat;",
		".rounded": "padding: 4px; border-radius: 5px;",
		".animate-width-height": "transition: width 250ms ease-in, height 250ms ease-in;",
		">.glassy:not(.no-margin)": "margin: 32px;",
		">.glassy": {
			"": "pointer-events: auto;",
			// "&:hover": "backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);"
		},
		">.{Element}": "pointer-events: auto;",
		".{Node}": {
			"&.invisible-layer": "opacity: 0.4;",
	    	"&.seperator": "border-top:1px solid rgba(155,155,155,0.55);margin-top:2px;padding-top:2px;",
			">.text>img": "width:20px;height:20px;"
		}
	},
	'.container-glassy': { 
		/* TODO CSS definitions must (eventually) be moved to App.glassy */
		'': {
			// 'height': HEIGHT + "px",
			// 'width': WIDTH + "px",
			'top': "5%", 
			// 'height': "100%",
			
			'min-width': "54px",
			'min-height': "54px",

			'border-radius': "5px",
			'z-index': "1999",
			// 'backdrop-filter': "blur(10px)",
			'transition': "box-shadow 0.45s ease 0s, transform 0.45s ease 0s, left 0.45s ease 0s, right 0.45s ease 0s, top 0.45s ease 0s, bottom 0.45s ease 0s, width 0.45s ease 0s, height 0.45s ease 0s, border-width 0.45s ease 0s",
		},
		'&:hover': {
			'box-shadow': "0 0 10px 5px rgba(0,0,0,.2)",
			'cursor': "move",
			'.client': "border-color: rgba(56,127,217,0.025); background-color:rgba(155, 155, 155, 0.2);"
		},
		// '&.square': {
		// 	'min-width': 175 + "px",
		// 	'min-height': 175 + "px"
		// },
		'&.dragging': {
			'transition': "box-shadow 0.15s ease 0s" || "transform 75ms ease-out 0s, left 75ms ease-out 0s, right 75ms ease-out 0s, top 75ms ease-out 0s, bottom 75ms ease-out 0s, width 75ms ease-out 0s, height 75ms ease-out 0s, border-width 0.45s ease 0s",

			'box-shadow': "0 0 20px 10px rgba(0,0,0,.2)",
			'.client': {
				'border-color': "rgba(56,127,217,0.4)" || "rgba(255,215,0,0.75)"
			}
			
		},
		'&.glassy-overlay > .client.no-margin': "margin:0;",
		'&.right': "right: 40px; transform-origin: top right;",
		'&.left': "left: 40px; transform-origin: top left;",

			// "&.right": {
			// 	'': "right: 5%; transform-origin: top right;",
			// 	"&:not(:hover)": "margin-left:1px; transform: translate3d(75%, 0, 0);"
			// },
			// "&.left": {
			// 	'': "left: 5%; transform-origin: top left;",
			// },

		'&.shrink-to-corner:not(:hover)': {
			'width': 175 + "px",
			'height': 175 + "px"
		},
		'&:not(.no-transparent-effects)': {		
			'*': "text-shadow: none;",
			'.{List}': "border-radius:5px;",
			'.{ListHeader}': {
				'': "background-color:transparent;transition:background-color 1s ease 0s;", 
				'&.scrolled': "background-color:rgba(255,255,255,0.75);", 
				'>div': "background-image:none;border:none;font-weight:bold;"
			},
			'.{Input}': {
				'input': 'background-color: rgba(255,255,255,0.2);',
				// 'input:focus': 'background-color: rgba(255,255,255,0.9);'
			},
			
			// '.{ListHeader}': { 
			// 	'': "background-color:transparent;transition:background-color 0.5s ease 0s;", 
			// 	':active': "background-color: gold;", //rgb(56, 121, 217);" } 
			// 	'&.scrolled': "background-color:rgba(255,255,255,0.75);"
			// }
			
		},
		
		'input': {
			// 'flex': "1 1 0%",
		    // 'transition': "width 0.5s ease 0s",
		    // 'width': "150px"
		    'padding': "5px",//"5px 24px",
		    'border-radius': "5px",
		    'border': "none",
		    'background': "rgba(255, 255, 255, 0.2)"
		},
		
		'.client': {
			'position': "relative",
			'border-radius': "5px",
			'border': "7px solid rgba(0,0,0,0)",
			// 'overflow': "hidden",
			'height': "100%",
			'transition': "border-color 0.45s ease 0s, background-color 0.45s ease 0s",
			'&:hover': {
			}
		},
		'.seperator.seperator.seperator': "border-top: 1px solid rgba(155, 155, 155, 0.55);",
		
		'&.phone': {
			'': "width: 389px; border-radius:20px; box-shadow: 0 0 20px 10px rgba(0,0,0,.2);",
			">.client": {
				'': "border-radius: 20px;",
				'iframe': "border-radius: 20px;"
			}
		}
	},
	
	'.veldoffice\\/Tabs\\<Document\\> .\\#preview': "background-color: rgba(240, 240, 240, 0.75);"
};


["", {
	onLoad() {
		const w = this.qs("#window");
		w.set("css", js.mi(w.get("css"), css));
		return this.inherited(arguments);
	}	
}, [

	// ["#window", {
		
	// 	css: css
		
	// }]	
	
	
]];