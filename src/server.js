/**
 * Module dependencies.
 */

var url = require('url');
var connect = require('../lib/connect');
var restler = require('../lib/restler');

var CONFIG = require('../config.js').config;

var listeners = [];

var broadcast = function (message) {
	for (var i in listeners) {
		if (!listeners.hasOwnProperty(i)) {
			continue;
		}
		var listener = listeners[i];
		var json = JSON.stringify(message) + "\n\n";
		listener.res.write(json);
	}
};

function app(app) {
	app.get('/api/:method', function (req, res, next) {
		var query = url.parse(req.url).query || '';
		restler.get(CONFIG.core + '/api/' + req.params.method + '?' + query, { parser: null }).on('complete', function(data, _res) {
			res.writeHead(_res.statusCode, _res.headers);
			res.end(data);
		}).on('error', function () {});
	});

	app.post('/api/:method', function (req, res, next) {
		var data = req.body || '';
		restler.post(CONFIG.core + '/api/' + req.params.method, { data: data, parser: null }).on('complete', function(data, _res) {
			res.writeHead(_res.statusCode, _res.headers);
			res.end(data);
		}).on('error', function () {});
	});

	app.get('/events/stream', function (req, res, next) {
		listeners.push({
			joined: new Date(),
			stream: true,
			req: req,
			res: res
		});
	});

	app.post('/events', function (req, res, next) {
		res.writeHead(200);
		res.end();
		broadcast({
			type: 'ping',
			timestamp: (new Date()).getTime() / 1000
		});
	});

	app.get('/js/config.js', function (req, res, next) {
		res.writeHead(200);
		res.end("BAMLive.set(" + JSON.stringify({
			debug: CONFIG.debug
		}) + ");");
	});
};

connect.createServer(
	connect.logger(function (req, res, format) {
		var colors = { 404: 33, 500: 31 }
		  , color = colors[res.statusCode] || 32;
		return format('\033[90m:method :url \033[0m\033[' + color + 'm:status\033[0m');
    }),
	connect.static(__dirname + '/../pub', { maxAge: 0 }),
	connect.cookieParser(),
	connect.bodyParser(),
	connect.router(app),
	connect.errorHandler({ showStack: true, showMessage: true, dumpExceptions: true })
).listen(CONFIG.port);
