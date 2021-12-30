module.exports = {
    slugifyText:function(text) {
        return text.toLowerCase()
             .replace(/ /g, '-')
             .replace(/[^\w-]+/g, '');
    }
}