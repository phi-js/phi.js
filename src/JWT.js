var JWT = {

    decode: function(token) {
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        var decoded = JWT.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    },

    isExpired: function(token) {
        var d = JWT.getExpirationDate(token);
        if (!d) {
            return false;
        }

        return !(d.valueOf() > new Date().valueOf());
    },

    getExpirationDate: function(token) {
        var decoded;
        decoded = JWT.decode(token);
        if (!decoded.exp) {
            return null;
        }
        var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds(decoded.exp);

        return d;
    },

    urlBase64Decode: function(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw 'Illegal base64url string!';
            }
        }

        return decodeURIComponent(escape(window.atob(output)));   // polifyll at https://github.com/davidchambers/Base64.js
    }

};

export default JWT