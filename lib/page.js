class Page {

    constructor(attrs){
        //All page attributes
        this.attrs = {};
        this.attrs.width = attrs.PAGEWIDTH || 612.2; 
        this.attrs.height = attrs.PAGEHEIGHT || 858.89;
        this.attrs.x = attrs.PAGEXPOS || 100;
        this.attrs.y = attrs.PAGEYPOS || 20;
        this.attrs.border = {
            left: attrs.BORDERLEFT || 40,
            right: attrs.BORDERRIGHT || 40,
            top: attrs.BORDERTOP || 40,
            bottom: attrs.BORDERBOTTOM || 40,
        }

        //All objects on the page
        this.objects = [];
    }
}

module.exports = {
    Page: Page
}