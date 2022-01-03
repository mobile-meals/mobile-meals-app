module.exports = {
    slugifyText:function(text) {
        return text.toLowerCase()
             .replace(/ /g, '-')
             .replace(/[^\w-]+/g, '');
    },
    determinePageDialog: function(){
        if (typeof window === "undefined") {
            console.log("Oops, `window` is not defined")
        }
        return window.innerWidth <= 390 ? 'page': 'dialog';
    }
}