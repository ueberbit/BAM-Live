BAMLive = (function () {
	var CONFIG = {};
	var AJAXDEFAULTS = {
		cache: false,
		data: {},
		dataType: 'json'
	};
	var ajax = function (url, opts) {
		var useopts = $.extend({}, opts);
		$.each(AJAXDEFAULTS, function (key, val) {
			if (!useopts.hasOwnProperty(key)) {
				useopts[key] = val;
			}
		});
		var signparams = [useopts.data];
		if (useopts.credentials) {
			signparams.push(useopts.credentials);
		}
		useopts.data = sign.apply(sign, signparams);
		$.ajax('api/' + url, useopts);
	};
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
		ajax('players', {
			success: function (data) {
				// Generate HTML.
				var html = ich.tplPlayers({players: data});
				// Attach player data to the li elements.
				$.each(data, function (idx, player) {
					$('li[data-id="' + player.id + '"]', html).data('player', player);
				});
				// Replace #login contents with generated HTML.
				$('#login').html(html);
			}
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
		var creds = { user: user, pass: pass };
		ajax('ping', {
			credentials: creds,
			success: function () {
				if ($.jStorage.set('credentials', creds)) {
					dbg('Stored new credentials:', [user, pass]);
					mode('login');
				}
			}
		});
	};
	var sign = function (orig_data, cred_override) {
		var creds = cred_override || $.jStorage.get('credentials');
		var data = $.extend({}, orig_data);
		data.user = creds.user;
		data.timestamp = Math.floor(new Date().getTime() / 1000);
		data.salt = Math.floor(Math.random() * 1000000);
		var keys = [];
		$.each(data, function (key, val) {
			keys.push(key);
		});
		keys.sort();
		var parts = [];
		$.each(keys, function (idx, key) {
			parts.push(key + '=' + encodeURIComponent(data[key]).replace(/%20/, '+'));
		});
		var hashstr = parts.join('&') + '#' + creds.pass;
		var hash = $.sha256(hashstr);
		data.hash = hash;
		dbg('Signed', data, 'using hashstring', hashstr);
		return data;
	};
	return {
		dbg: dbg,
		dumpConfig: dumpConfig,
		haveCredentials: haveCredentials,
		log: log,
		mode: mode,
		renderLogin: renderLogin,
		set: set,
		setCredentials: setCredentials,
		sign: sign
	};
})();

$(function () {
	$('#associate form').submit(function (ev) {
		BAMLive.setCredentials($('#deviceUser').val(), $('#devicePass').val());
		return false;
	});
	BAMLive.mode(BAMLive.haveCredentials() ? 'login' : 'associate');
});
