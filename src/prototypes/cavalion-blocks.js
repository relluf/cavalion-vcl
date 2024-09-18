"use B";

/*- [["cavalion-blocks"]]

	The following vars can be set to influence the default behaviour:

	- vars.uri
	- vars.specializer
	- vars.onLoad
	
*/
["vcl/ui/Panel", {
	align: "client",
	onLoad() {
		this.override({
			visibleChanged() {
				const tabs = this.qs("#tabs");
				if(tabs && this.isVisible()) {
					tabs.updateChildren();
				}
				return this.inherited(arguments);
			}
		});
	},
	onNodeCreated() {
		var uri = this.vars("uri") || js.sf("%s<%s>", this.getSpecializer(), this.vars("specializer") || this._name);
		var prefix = this.vars(["App.openform.prefix"]) || "";
		
		uri = prefix + uri;
		
		require("B").instantiate(uri, { owner: this }).then(_ => {
				const onLoad = this.vars("onLoad");
				_.setParent(this); // TODO why can't this be done in property decl? => vars.parent
				if(onLoad) {
					onLoad.apply(this, [_]);
				}
				this.emit("container-ready", [_]);
			});
	}
}];