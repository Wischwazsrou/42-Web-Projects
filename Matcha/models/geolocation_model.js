var NodeGeocoder = require("node-geocoder");

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyAMCrKl1Jn1z6vCZz-SymgBVkfPp_rsLx8',
    formatter: null
};

var geocoder = NodeGeocoder(options);

module.exports = {
    getLocation: function (address, callback) {
        var error = false;
        if (address == ""){
            error = true;
            callback(null , error);
        }
        geocoder.geocode(address, function (err, response) {
            if (!err) {
                if (response.length === 0) {
                    error = true;
                }
                callback(null, error);
            }
        });
    },
    getLocationByLatlng: function (lat, lng, callback) {
        geocoder.reverse({lat: lat, lon: lng}, function (err, res) {
            if (!err)
                callback(null, res);
        });
    }
};