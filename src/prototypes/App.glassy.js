"use util/HtmlElement, vcl/CssRules, vcl/ui/Input, vcl/ui/Tabs, vcl/ui/ListRow";

const CssRules = require("vcl/CssRules");

document.body.appendChild(require("util/HtmlElement").fromSource(
	`<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute; overflow:hidden">
	    <defs>
	        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
	            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise"></feTurbulence>
	            <feGaussianBlur in="noise" stdDeviation="2" result="blurred"></feGaussianBlur>
	            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
	        </filter>
	    </defs>
	</svg>`));
	
function animate() {
	const node = document.qs("svg feGaussianBlur");

	let value = 0, dir = 1, update = () => {
		node.setStdDeviation(value, value);
	    value += (dir * Math.random() * 1.5);
	    if(value % 100 === 0) {
	        dir = -dir;
	    }
	};
	
	return setInterval(update, 25);	
}

[(""), [

	[("#window"), { 
		css: {
			'#close-x': {
				'': "transition: opacity 1s; opacity: 0.1; position:absolute;top:0;right:0;color:silver;padding:2px 4px;font-size:14pt;z-index:999999999999; border: 1px solid transparent; border-radius:16px;",
				'&:hover': "color:black;font-weight:bold;cursor:pointer;opacity: 1;backdrop-filter: blur(10px); background-color: rgba(255,255,255,0.5);",
				'&:active': "background-color: rgba(56,127,217,0.025);"
			},
			".with-shadow": "box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 2px 0px;",
			".with-text-shadow": "text-shadow: rgb(255 255 255) 0px 0px 12px, #00000094 0px 0px 5px;",
			".transparent": "background-color:transparent;",
			".glassy-overlay": {
				"": "pointer-events: none; color:rgba(5,5,5,0.95);",
		 		".glassy": "background-color: rgba(215, 215, 215, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
				".loading": "background: url(/shared/vcl/images/loading.gif) 50% 50% no-repeat;",
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
			    	"&.seperator-bottom": "border-bottom:1px solid rgba(155,155,155,0.55);margin-bottom:2px;padding-bottom:2px;",
					">.text>img": "width:20px;height:20px;"
				}
			},
			
	        '&.distorted': {
		        '': {
		            'position': "absolute",
		            'width': "300px",
		            'height': "200px",
		            'border-radius': "28px",
		            'cursor': "move",
		            'isolation': "isolate",
		            'touch-action': "none",
		            /* enable pointer dragging on touch */
		            'box-shadow': "0px 6px 24px rgba(0, 0, 0, 0.2)"
		        },
	        	'::before': {
		            'content': "''",
		            'position': "absolute",
		            'inset': "0",
		            'z-index': "0",
		            // 'box-shadow': "inset 0 20px -5px rgba(255, 255, 255, 0.7);",
		            // 'background-color': "rgba(255, 255, 255, 0.4)"
		        },
	        	'::after': {
		            'content': "''",
		            'position': "absolute",
		            'inset': "0",
		            'z-index': "-1",
		            // 'border-radius': "28px",
		            'backdrop-filter': "blur(2px)",
		            'filter': "url(#glass-distortion)",
		            'isolation': "isolate",
		            '-webkit-backdrop-filter': "blur(2px)",
		            '-webkit-filter': 'url("#glass-distortion")'
		        }
			},
			
			'.container-glassy': { 
				'': {
					// 'height': HEIGHT + "px",
					// 'width': WIDTH + "px",
					'top': "5%", 
					// 'height': "100%",
					
					'min-width': "54px",
					'min-height': "54px",
		
					'border-radius': "7px",
					'z-index': "1999",
					// 'backdrop-filter': "blur(10px)",
					'transition': "box-shadow 0.45s ease 0s, transform 0.45s ease 0s, left 0.45s ease 0s, right 0.45s ease 0s, top 0.45s ease 0s, bottom 0.45s ease 0s, width 0.45s ease 0s, height 0.45s ease 0s, border-width 0.45s ease 0s",
				},

				'&:hover': {
					'box-shadow': "0 0 10px 5px rgba(0,0,0,.2)",
					'cursor': "move",
					'.client': "border-color: rgba(56,127,217,0.025);"// background-color:rgba(215, 215, 215, 0.2);"
				},
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
		
				'#menubar': "border-bottom: none;",
		
		        '&.parent-topleft': "transform-origin: 0% 0%;",
		        '&.parent-topcenter': "transform-origin: 50% 0%;",
		        '&.parent-topright': "transform-origin: 100% 0%;",
		        '&.parent-middleleft': "transform-origin: 0% 50%;",
		        '&.parent-middlecenter': "transform-origin: 50% 50%;",
		        '&.parent-middleright': "transform-origin: 100% 50%;",
		        '&.parent-bottomleft': "transform-origin: 0% 100%;",
		        '&.parent-bottomcenter': "transform-origin: 50% 100%;",
		        '&.parent-bottomright': "transform-origin: 100% 100%;",
				'&.shrink-to-corner:not(:hover)': {
					'width': 175 + "px",
					'height': 175 + "px"
				},
				'&:not(.no-transparent-effects)': {		
					'*': "text-shadow: none;",
					'.{List}': "border-radius:5px;",
					'.{ListHeader}': {
						'': "background-color:transparent;transition:background-color 1s ease 0s;", 
						'&.scrolled': "background-color:rgba(255,255,255,0.75);backdrop-filter:blur(10px);", 
						'>div': "background-image:none;border:none;font-weight:bold;"
					},
					'.{Input}': {
						'input': 'background-color: rgba(255,255,255,0.2);',
						// 'input:focus': 'background-color: rgba(255,255,255,0.9);'
					},
					
					'.{Button}': "border: none; background: transparent; box-shadow: none;"
					
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
					'border-radius': "7px",
					'border': "0px solid rgba(0,0,0,0)",
					// 'overflow': "hidden",
					'height': "100%",
					'transition': "border-color 0.45s ease 0s, background-color 0.45s ease 0s, border-width: 0.45s ease 0s",
					'&:hover': {
						// 'border-width': "10px"
					}
				},
				'.seperator.seperator.seperator': "border-top: 1px solid rgba(215, 215, 215, 0.55);",
				
				'&.phone': {
					'': "width: 389px; border-radius:20px; box-shadow: 0 0 20px 10px rgba(0,0,0,.2);",
					">.client": {
						'': "border-radius: 20px;",
						'iframe': "border-radius: 20px;"
					}
				}
			},
			'.glassy': {
				'#bar': "background-color: rgba(240, 240, 240, 0.35);",
				'.{Tabs}': {
					'': "background-color: rgba(240, 240, 240, 0.35); height: auto;",
					'.{Tab}': {
						'': "background-color: transparent; border: none;",
						'&:not(.disabled)': "cursor: pointer;",
						'&.selected': "font-weight: bold; background-color:rgba(255, 255, 255, 0.65); border-radius:3px;"
					}
				},
				'.{ListRow}:not(.selected).odd': "background-color: rgba(240, 240, 240, 0.55);",
				
	        	// '::before': {
		        //     'content': "''",
		        //     'position': "absolute",
		        //     'inset': "0",
		        //     'z-index': "0",
		        //     // 'border-radius': "28px",
		        //     // 'box-shadow': "inset 0 20px -5px rgba(255, 255, 255, 0.7);",
		        //     // 'background-color': "rgba(255, 255, 255, 0.4)"
		        // },
	        	'::after': {
		            'content': "''",
		            'position': "absolute",
		            'inset': "0",
		            'z-index': "-1",
		            // 'border-radius': "28px",
		            'backdrop-filter': "blur(2px)",
		            'filter': "url(#glass-distortion)",
		            'isolation': "isolate",
		            '-webkit-backdrop-filter': "blur(2px)",
		            '-webkit-filter': 'url("#glass-distortion")'
		        }
			},
			
			'input': "background: transparent; margin-top: 2px; border: 1px solid rgb(118, 118, 118); padding-bottom: 3px; padding-top: 3.5px; padding-left: 4px; border-radius: 3px;",
			'select': "background: transparent; border: 1px solid rgb(118, 118, 118); border-radius: 3px; padding-right:20px;",
			
				'input[type=date]': "font-family:system-ui;padding:2px 2px;",
				'input[type=time]': "font-family:system-ui;padding:1px 2px;",
		
			'&.safari.safari': {
				'select': {
					'-webkit-appearance': "none",
					'appearance': "none",
					'font-size': "13.3333px",
					'padding': "3px",
					'padding-bottom': "4px",
					'padding-right': "16px",
					'background-image': 'url("data:image/svg+xml;charset=UTF-8,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23666\'/%3E%3C/svg%3E")',
					'background-repeat': 'no-repeat',
					'background-position': 'right 4px center',
					'background-size': '10px 6px',
					
				},		
				'input[type=date]': "padding: 4px; padding-top: 1px; padding-bottom: 2px;",
				'input[type=time]': "padding-bottom: 2px;",
				'input:not([type=checkbox])': {
					'-webkit-appearance': "none",
					'appearance': "none",
					'font-size': "13.3333px"
				},		
				'button': {
					'&:not(.selected)': "background-color: #eee; border: 1px solid #999;",
					'-webkit-appearance': "none",
					'appearance': "none",
					// 'box-shadow': "1px 1px 2px rgba(0,0,0,0.1)",
				},
				
				'#menubar button:not(.selected)': "background: none; border: none;"
			}
		}
	}]

]];