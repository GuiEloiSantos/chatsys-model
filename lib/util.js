module.exports = {
    formatUrl: function (date) {
        var prefix = 'http://';
        var prefixHttps = 'https://';
        if ( ( date.substr(0, prefix.length) !== prefix ) && ( date.substr(0, prefixHttps.length) !== prefixHttps )) {
            date = prefixHttps + date;
        }
        return date;
    }
};