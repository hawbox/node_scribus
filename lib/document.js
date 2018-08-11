fs = require('fs');
xml2js = require('xml2js');
parser = new xml2js.Parser();
let Page = require('./page.js').Page;

class ScribusDocument {

    
    constructor(){
        this.currentFilePath = ""; //Necessary to save the file to it's current path without specifying it again
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
                    if(err) reject(err);

                    parser.parseString(data, (err, result) => {
                        if(err) reject(err);

                        this.data = result;
                        this.currentFilePath = path;
                        this.attrs = result.SCRIBUSUTF8NEW.DOCUMENT[0]['$'];

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

    addPage(page){
        this.pages.push(page);
    }

    /**
     * 
     * @param {array} pages 
     * @param {number} index Page number where the pages will be inserted
     */
    addPages(pages, index){
        for(var i=0;i<pages.length;i++){
            if(index){
                this.addPage(pages[i], index+i);
            }else{
                this.addPage(pages[i]);
            }
        }
    }

    getXml(){
        this._updateData();
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(this.data);
        return xml;
    }

    //Save the current document to a file
    save(path) {
        fs.writeFile(path || this.currentFilePath, this.getXml(), 'utf8');
    }

    //Private functions

    //Generate an array of Page-Objects
    _generatePages() {
        this.pages = [];
        for(var i=0;i<this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGE.length;i++){
            var newPage = new Page(this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGE[i]['$']);
            for(var ii=0;ii<this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGEOBJECT.length;ii++){
                if(this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGEOBJECT[ii]['$'].OwnPage==newPage.attrs.num){
                    newPage.addObject(this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGEOBJECT[ii]['$']);
                }
            }
            this.pages.push(newPage);
        }
    }

    //Update the original data-object
    _updateData() {
        this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGE = [];
        this.pages.forEach(page => {
            this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGE.push({ $: page.attrs });
            page.getObjects().forEach(object => {
                this.data.SCRIBUSUTF8NEW.DOCUMENT[0].PAGEOBJECT.push({ $: object.attrs });
            });
        });
    }

}

module.exports = {
    ScribusDocument: ScribusDocument
}