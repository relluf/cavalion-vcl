$("vcl/ui/Panel", {
	align: "client",
	onLoad() {
		B.instantiate(js.sf("%s<%s>", this.getSpecializer(), this.vars("specializer") || ""), 
			{ owner: this }).then(_ => {
				_.setParent(this); // TODO why can't this be in property decl?
			});
	}
});