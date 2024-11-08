"use js";

[["ui/Form"], {}, [
    ["vcl/ui/Panel", ("left"), { align: "left", width: 325 }, [
        ["vcl/ui/Panel", ("left_content"), { align: "top", autoSize: "height" }, [
	        ["vcl/ui/Element", ("description"), {
	        // 	onRender() {
	        // 		this.nextTick(() => {
		       // 		const left_content = this.ud("#left_content").getNode();
		       // 		// const has = left_content.hasAttribte
					    // if (left_content.scrollHeight > left_content.clientHeight) {
					    //     left_content.setAttribute("data-overflow-y", "true");
					    // } else {
					    //     left_content.removeAttribute("data-overflow-y");
					    // }
	        // 		});
	        // 	},
	            content: locale("App-description.default")
	        }]
        ]]
    ]],
    ["vcl/ui/Panel", ("menubar"), { align: "top", autoSize: "both" }],
    ["vcl/ui/Panel", ("client"), { align: "client" }, []]
]];