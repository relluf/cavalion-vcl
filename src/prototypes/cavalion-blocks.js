"use B";

["vcl/ui/Panel", {
	align: "client",
	onLoad() {
		require("B").instantiate(js.sf("%s<%s>", this.getSpecializer(), this.vars("specializer") || this._name), 
			{ owner: this }).then(_ => {
				_.setParent(this); // TODO why can't this be in property decl?
			});
	}
}];