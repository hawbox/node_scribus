var scribus = require('./lib/document.js');

var document = new scribus.ScribusDocument();

document.load('./test.sla').then(() => {
    console.dir(document.getPages());
});
