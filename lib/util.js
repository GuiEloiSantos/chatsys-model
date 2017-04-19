module.exports = {
    formatUrl: function (date) {
        var prefix = 'http://';
        if (date.substr(0, prefix.length) !== prefix) {
            date = prefix + date;
        }
        return date;
    }
};