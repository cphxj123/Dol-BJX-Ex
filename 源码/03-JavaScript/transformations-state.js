const Transformations = (() => {
	"use strict";

	const defaults = {
		demon: {
			colour: { h: 275, s: 100, l: 30 },
		},
		/* 北极星模组 */
		dragon: {
			colour: { h: 10, s: 100, l: 30},
		},
		/* 北极星 */
	};

	/* Keeping this around for structural reasons. */
	function init() {
		return 0;
	}

	return Object.seal(
		Object.defineProperties(
			{
				init,
			},
			{
				defaults: {
					get() {
						return defaults;
					},
				},
			}
		)
	);
})();

Object.defineProperty(window, "Transformations", {
	get: () => Transformations,
});
