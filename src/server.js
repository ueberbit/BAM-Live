/**
 * Module dependencies.
 */

var connect = require('../lib/connect/lib/connect.js');

function app(app) {
	app.get('/foo', function (req, res, next) {
		var body = 'Hello World';
	 	res.setHeader('Content-Length', body.length);
  		res.end(body);
	});

	app.get('/user/:id', function (req, res, next) {
		// populates req.params.id
	});

	app.put('/user/:id', function (req, res, next) {
		// populates req.params.id
	});
};

connect.createServer(
	connect.logger(function (req, res, format) {
		var colors = { 404: 33, 500: 31 }
		  , color = colors[res.statusCode] || 32;
		return format('\033[90m:method :url \033[0m\033[' + color + 'm:status\033[0m');
    }),
	connect.bodyParser(),
	connect.router(app),
	connect.errorHandler({ showStack: true, showMessage: true, dumpExceptions: true })
).listen(3000);