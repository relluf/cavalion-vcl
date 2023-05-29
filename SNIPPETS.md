# `2023/05/06` Snippet

	const dumpControls = (parent) => parent.getControls().reduce((r, c) => {
		r[js.nameOf(c)] = dumpControls(c);
		return r;	
	}, Object.create(parent, { hashCode: { value: () => ";-)" } }));


* [Control.js](src/Control.js) - require("vcl/Control").dump

