"use B";

/*- [["cavalion-blocks"]]

	The following vars can be set to influence the default behaviour:

	- vars.uri
	- vars.specializer
	- vars.onLoad
	
*/
["vcl/ui/Panel", {
	align: "client",
	onNodeCreated() {
		var uri = this.vars("uri") || js.sf("%s<%s>", this.getSpecializer(), this.vars("specializer") || this._name);
		require("B").instantiate(uri, { owner: this }).then(_ => {
				const onLoad = this.vars("onLoad");
				_.setParent(this); // TODO why can't this be in property decl?
				if(onLoad) {
					onLoad.apply(this, [_]);
				}
				this.emit("container-ready", [_]);
			});
	}
}];