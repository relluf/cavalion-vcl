"use js";

[["ui/Form"], {}, [
    ["vcl/ui/Panel", ("left"), { align: "left", width: 325 }, [
        ["vcl/ui/Panel", ("left_content"), { align: "top", autoSize: "height" }, [
	        ["vcl/ui/Element", ("description"), {
	            content: [
	            	// "A view form consists of a panel aligned to the left ",
	            	// "and one aligned client. The client panel usually shows a menubar ",
	            	// "aligned to the top."
	            ].join("")
	        }]
        ]]
    ]],
    ["vcl/ui/Panel", ("menubar"), { align: "top", autoSize: "both" }],
    ["vcl/ui/Panel", ("client"), { align: "client" }, []]
]];