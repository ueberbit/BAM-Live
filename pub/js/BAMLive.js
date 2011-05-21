BAMLive = (function () {
	var CONFIG = {};
	var set = function (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				CONFIG[key] = options[key];
			}
		}
	};
	return {
		set: set
	};
})();
