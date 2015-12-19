var fs = require('fs');
var scissors = require('..');

var pdf = scissors(__dirname + '/test.pdf');
var page = pdf.pages(2);

// Streams
page.pdfStream().pipe(fs.createWriteStream(__dirname + '/test-page.pdf'));
page.pngStream(300).pipe(fs.createWriteStream(__dirname + '/test-page.png'));

// All content
pdf.contentStream().on('data', function (item) {
  if (item.type == 'string') {
    console.log(item.string);
  } else if (item.type == 'image') {
    console.log(item);
  }
});

// Output page 1 at 300 dpi in jpg format using simple rasterize.
page.imageStream(300, 'jpg', 1, true).pipe(fs.createWriteStream(__dirname + '/test-page.jpg'));