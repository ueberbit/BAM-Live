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
	var mode = function (mode) {
		var show = null;
		if (mode == 'login') {
			renderLogin();
			show = $('#login');
		}
		$('.panel').addClass('hidden');
		show.removeClass('hidden');
	};
	var renderLogin = function () {
		// Retrieve player list.
		$.getJSON('api/players', function (data) {
			// Generate HTML.
			var html = ich.tplPlayers({players: data});
			// Attach player data to the li elements.
			$.each(data, function (idx, player) {
				$('li[data-id="' + player.id + '"]', html).data('player', player);
			});
			// Replace #login contents with generated HTML.
			$('#login').html(html);
		});
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
		mode: mode,
		renderLogin: renderLogin,
		set: set
	};
})();

$(function () {
	BAMLive.mode('login');
});
