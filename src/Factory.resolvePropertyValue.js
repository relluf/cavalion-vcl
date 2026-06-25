define(function(require) {

	var Type = require("js/Type");

	return function resolvePropertyValue(property, component, value, node) {
		// if(typeof value === "function" && property._type !== Type.EVENT && !property.isReference()) {
		// 	value = value.call(component, component, property, node);
		// }
		return value;
	};
});
