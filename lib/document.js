fs = require('fs');
xml2js = require('xml2js');
parser = new xml2js.Parser();
let Page = require('./page.js').Page;

class ScribusDocument {

    
    constructor(){
       
    }
    
    /**
     * 
     * @param {string} path Filepath to the scribus file
     */
    load(path) {
        return new Promise((resolve, reject) => {
            if(path){
                //Load existing document from file
                fs.readFile(path, (err, data) => {
                    parser.parseString(data, (err, result) => {
                        if(err) throw err;
                        this.data = result;
                        //console.dir(result.SCRIBUSUTF8NEW.DOCUMENT);
                        console.log('Done.');

                        //Generate all necessary JSON Objects and Arrays
                        this._generatePages();

                        resolve();
                    });
                });
            }else {
                //Create blank document
                reject();
            }
        })
    }

    getPages() {
        return this.pages;
    }

    //Save the current document to a file
    save() {
        
    }

    //Private functions

    //Generate an array of Page-Objects
    _generatePages() {
        this.pages = [];
        for(var i=0;i<this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGE.length;i++){
            this.pages.push(new Page(this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGE[i]['$']));
        }
    }

}

module.exports = {
    ScribusDocument: ScribusDocument
}