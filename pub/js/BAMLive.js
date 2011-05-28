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
	var haveCredentials = function () {
		return $.jStorage.get('credentials');
	};
	var log = function () {
		if (console && console.log) {
			console.log.apply(console.log, arguments);
		}
	};
	var mode = function (mode) {
		var show = null;
		if (mode == 'associate') {
			show = $('#associate');
		} else if (mode == 'login') {
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
	var setCredentials = function (user, pass) {
		// TODO: Check credentials before saving them.
		$.jStorage.set('credentials', { user: user, pass: pass });
	};
	return {
		dbg: dbg,
		dumpConfig: dumpConfig,
		haveCredentials: haveCredentials,
		log: log,
		mode: mode,
		renderLogin: renderLogin,
		set: set,
		setCredentials: setCredentials
	};
})();

$(function () {
	$('#associate form').submit(function (ev) {
		BAMLive.setCredentials($('#deviceUser').val(), $('#devicePass').val());
		return false;
	});
	BAMLive.mode(BAMLive.haveCredentials() ? 'login' : 'associate');
});
