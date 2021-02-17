"use B";

["vcl/ui/Panel", {
	align: "client",
	onLoad() {
		var uri = this.vars("uri") || js.sf("%s<%s>", this.getSpecializer(), this.vars("specializer") || this._name);
		require("B").instantiate(uri, { owner: this }).then(_ => {
				_.setParent(this); // TODO why can't this be in property decl?
			});
	}
}];