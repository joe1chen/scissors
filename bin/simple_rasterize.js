#!/usr/bin/env node

var fs = require('fs');
var spawn = require('child_process').spawn;

require('bufferjs/indexOf');

function debug () {
	console.error.apply(console, arguments);
}

function rasterizeImage (ins, page, dpi, format) {
  var device;
  if (format == 'png') {
    device = 'png16m';
  }
  else {
    device = 'jpeg';
  }

	var gs = spawn('gs', [
		'-q',
		'-sDEVICE=' + device,
	  '-sOutputFile=-',
	  '-r' + dpi,
	  '-dNOPAUSE', '-dBATCH',
	  '-dFirstPage=' + page, '-dLastPage=' + page,
	  '-f', '-']);

	ins.pipe(gs.stdin);

	gs.stderr.on('data', function (data) {
	  debug('gs encountered an error:\n', String(data));
	});

	gs.on('exit', function (code) {
		if (code) {
	  	debug('gs exited with failure code:', code);
	  }
	  debug('Finished writing image.');
	});

	return gs.stdout;
}

if (process.argv.length < 5) {
	debug('Invalid number of arguments.');
	process.exit(1);
}

var input = process.argv[2];
var format = process.argv[3];
var page = Number(process.argv[4]) || 1;
var dpi = Number(process.argv[5]) || 72;

var inputStream = input == '-' ? process.stdin : fs.createReadStream(input);
rasterizeImage(inputStream, page, dpi, format).pipe(process.stdout);
