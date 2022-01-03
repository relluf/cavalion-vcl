"use js";

[["ui/Form"], {
    css: {
    	// TODO refactor to be 'singleton' (iykwim)
    	'#menubar': {
		    '&.loading': "background: url(/shared/vcl/images/loading.gif) no-repeat 50% 50%;",
		    '&.nested-in-tabs': {
		    	'': "padding: 2px; border: none;",
		    	'.{Button}': "padding:2px 5px;"
		    },
	    	'padding': "4px",
	    	'overflow': "hidden",
			'border-bottom': "1px solid #f0f0f0",
			'.disabled.disabled.disabled.disabled.disabled': "color:silver;cursor:default;",
			'.right': "float: right;",
			'.{Button}': {
				outline: "none",
				'&:not(.right)': "margin-right: 8px;",
				'background': "none",
				'background-color': "transparent",
				'border': "none",
				'text-shadow': "none",
				'&.link': {
					'color': "blue",
					'text-decoration': "underline"
				},
				'box-shadow': "none",
				cursor: "pointer",
				padding: "2px 4px 2px 4px",
				'&.disabled': {
					color: "silver",
					cursor: "default"
				},
				'&:hover': "background-color: #f0f0f0;",
				'&.pressed': "background-color: #f0f0f0;color:rgb(56, 121, 217);",
				'&:not(.disabled):active': {
				    color: "rgb(56, 121, 217)",
				    'background-color': "#f0f0f0"
				},
				'&.selected': "background-color: rgb(56, 121, 217); color: white;"
			},
			'.{Tab}': {
				cursor: "pointer",
				padding: "2px 4px 2px 4px",
				display: "inline-block", 
				'margin-right': "8px",
				'border-radius': "3px",
				'&.selected': "background-color: rgb(56, 121, 217); color: white;",
				'&:not(.disabled):active': {
				    color: "rgb(56, 121, 217)",
				    'background-color': "#f0f0f0"
				}
			},
		    
			'.submit.submit.submit': {
				'&:not(:active)': "background-color:limegreen;color:white;", 
				'&:active': "color:green;" 
			},
			'.cancel.cancel.cancel': {
				'&:not(:active)': "background-color:red;color:#f0f0f0;",
				'&:active': "color:red;" 
			}
    	},
    	'#left': {
        	'#left_content': {
            	'padding': "8px",
            	'padding-left': "16px",
            	'min-height': "96px",
        	},
			'#menubar': {
				'position': "static",
				'padding': "8px 0 10px 0",
				'.{./Button}': {
					'cursor': "pointer",
					'outline': "none",
					'padding': "2px", 
					'background': "none",
					'border': "none",
					'background-color': "transparent",
					'color': "blue",
					'text-shadow': "none",
					'text-decoration': "underline",
					'box-shadow': "none",
					'margin-top': "2px",
					'&.disabled': {
						'color': "silver",
						'cursor': "default"
					},
					'&:not(.disabled):active': {
					    'color': "rgb(56, 121, 217)",
					    'background-color': "#f0f0f0"
					}
				}
			}
    	},
    	'#description': "color: gray;"
    }
}, [
    ["vcl/ui/Panel", ("left"), { align: "left", width: 325 }, [
        ["vcl/ui/Panel", ("left_content"), { align: "top", autoSize: "height" }, [
	        ["vcl/ui/Element", ("description"), {
	            content: [
	            	"A view form consists of a panel aligned to the left ",
	            	"and one aligned client. The client panel usually shows a menubar ",
	            	"aligned to the top."
	            ].join("")
	        }]
        ]]
    ]],
    ["vcl/ui/Panel", ("menubar"), { align: "top", autoSize: "both" }],
    ["vcl/ui/Panel", ("client"), { align: "client" }, []]
]];