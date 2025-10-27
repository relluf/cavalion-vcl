define(function(require) {

    var Splitter = require("js/defineClass");
    var Panel = require("./Panel");
    var DocumentHook = require("../../util/DocumentHook");

    return (Splitter = Splitter(require, {
        inherits: Panel,
        prototype: {
            "@css": {
                "background-color": "#e0e0e0",
                "&.vertical": {
                    width: "4px",
                    cursor: "ew-resize"
                },
                "&.horizontal": {
                    height: "4px",
                    cursor: "ns-resize"
                }
            },

            _hook: null,
            _orientation: null,
            _orientationClass: null,

            loaded: function() {
                this.setOrientation(this.getOrientation());
                return this.inherited(arguments);
            },

            getOrientation: function() {
                return this._orientation || ((this._align === "top" || this._align === "bottom") ? "horizontal" : "vertical");
            },
            setOrientation: function(value) {
                if(this._orientation !== value) {
                    this._orientation = value;
                }
                var orient = this.getOrientation();
                if(this._orientationClass !== orient) {
                    if(this._orientationClass) this.removeClass(this._orientationClass);
                    this._orientationClass = orient;
                    if(orient) this.addClass(orient);
                }
            },
            setAlign: function(value) {
                var r = this.inherited(arguments);
                if(this._orientation === null) {
                    this.setOrientation(null);
                }
                return r;
            },

            mousedown: function(evt) {
                evt.preventDefault();

                var ctrl = this.getPreviousSibling();
                if(!ctrl) return;

                var orient = this.getOrientation();
                var start = { x: evt.clientX, y: evt.clientY };
                var size = { w: ctrl.getWidth ? ctrl.getWidth() : 0,
                             h: ctrl.getHeight ? ctrl.getHeight() : 0 };
                var hook = new DocumentHook();
                this._hook = hook;
                var me = this;

                hook.override({
                    mousemove: function(e) {
                        var dx = e.clientX - start.x;
                        var dy = e.clientY - start.y;
                        if(orient === "vertical") {
                            if(me._align === "right") dx = -dx;
                            ctrl.setWidth && ctrl.setWidth(size.w + dx);
                        } else {
                            if(me._align === "bottom") dy = -dy;
                            ctrl.setHeight && ctrl.setHeight(size.h + dy);
                        }
                    },
                    mouseup: function(e) {
                        this.release();
                        me._hook = null;
                    },
                    keyup: function(e) {
                        if(e.keyCode === 27) {
                            this.release();
                            me._hook = null;
                        }
                    }
                }, true);

                hook.activate();
            },

            onmousedown: function(evt) {
                this.mousedown(evt);
                return this.inherited(arguments);
            }
        },
        properties: {
            "orientation": {
                get: Function,
                set: Function,
                type: ["horizontal", "vertical"]
            }
        }
    }));
});

