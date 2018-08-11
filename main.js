var scribus = require('./lib/document.js');

var document = new scribus.ScribusDocument();

document.load('./test.sla').then(() => {
    console.dir(document.attrs);
    //document.save('./test-neu.sla');
});