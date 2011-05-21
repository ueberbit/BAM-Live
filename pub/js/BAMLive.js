BAMLive = (function () {
	var CONFIG = {};
	var dbg = function () {
		if (CONFIG.debug) {
			log.apply(log, arguments);
		}
	};
	var dumpConfig = function () {
		log(CONFIG);
	};
	var log = function () {
		if (console && console.log) {
			console.log.apply(console.log, arguments);
		}
	};
	var set = function (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				CONFIG[key] = options[key];
			}
		}
	};
	return {
		dbg: dbg,
		dumpConfig: dumpConfig,
		log: log,
		set: set
	};
})();
