"vcl/ui/Button";

$("vcl/ui/Form", {
	tabIndex: 1, // make sure that it can receive keyboard events

    onReceiveParams: function(params) {
        var scope = this.getScope();
        if (params.canClose !== undefined) {
            scope.form_close.setEnabled(params.canClose === true);
            scope.form_close.setVisible(params.canClose === true);
        }
        return this.inherited(arguments);
    }
}, [
    $("vcl/Action", "form_close", {
        content: "Close",
        left: 96,
        top: 32
    }),
    $("vcl/Action", "url_state_push", {
        left: 96,
        top: 72
    }),
    $("vcl/Action", "url_state_pop", {
        left: 96,
        top: 112
    })
]);