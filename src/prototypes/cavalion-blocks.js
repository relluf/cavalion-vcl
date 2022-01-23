"use B";

["vcl/ui/Panel", {
	align: "client",
	onNodeCreated() {
		var uri = this.vars("uri") || js.sf("%s<%s>", this.getSpecializer(), this.vars("specializer") || this._name);
		var onLoad = this.vars("onLoad");
		require("B").instantiate(uri, { owner: this }).then(_ => {
				_.setParent(this); // TODO why can't this be in property decl?
				if(onLoad) {
					onLoad.apply(this, [_]);
				}
			});
	}
}];