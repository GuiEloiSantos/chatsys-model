module.exports = {
    formatUrl: function (url) {
        if (url.match("~^(?:f|ht)tps?://~i")) {
            url = "http://" . url;
        }
        return url;
    }
};