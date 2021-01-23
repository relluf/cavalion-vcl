"vcl/ui/Button";

["vcl/ui/Form", {
	tabIndex: 1, // make sure that it can receive keyboard events

    onReceiveParams: function(params) { // euh
        var scope = this.getScope();
        if (params.canClose !== undefined) {
            scope.form_close.setEnabled(params.canClose === true);
            scope.form_close.setVisible(params.canClose === true);
        }
        return this.inherited(arguments);
    }
}, [
    ["vcl/Action", "form_close", { content: "Close" }],
    ["vcl/Action", "url_state_push", {}],
    ["vcl/Action", "url_state_pop", {}]
]];