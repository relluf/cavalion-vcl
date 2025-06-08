"use vcl/ui/Popup, vcl/ui/List";

// (function animateZoom() {
// 	let zoom = 1;

// 	const targetZoom = 1.25;
// 	const step = 0.01;
// 	const delay = 10; // ms between frames
	
// 	function stepZoom() {
// 		if (zoom < targetZoom) {
// 			zoom += step;
// 			document.documentElement.style.zoom = Math.min(targetZoom, zoom);
// 			requestAnimationFrame(stepZoom);
// 		}
// 	}
	
// 	requestAnimationFrame(stepZoom);
// })();

["vcl/Application", { }, [

    ["vcl/ui/Panel", ("window"), { 
    	align: "client", classes: "animated",
		onLoad() { 
			this.setParentNode(document.body); 
			
			req("vcl/ui/Popup").prototype.setParent = function(value) {
				return this.inherited(arguments);
			},
			req("vcl/ui/Popup").prototype._parent = this;
			
			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
			  this.addClass("safari");
			}			
		}
    }],
    ["vcl/Action", ("reload-app"), {
    	hotkey: "Shift+MetaCtrl+R|Cmd+Alt+R",
    	on(evt) { evt.preventDefault(); document.location.reload(); }
    }]

]];