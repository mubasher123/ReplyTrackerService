const CryptoJS = require("crypto-js");

class AppHelper{

    /**
     *
     * @param cipherText
     * @param hashSecret
     * @returns {String}
     */
    static decrypt(cipherText, hashSecret = process.env.HASH_SECRET)
    {
        if (cipherText === undefined) return cipherText;
        let bytes = CryptoJS.AES.decrypt(cipherText.toString(), hashSecret);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    /**
     *
     * @param agency
     * @returns {{clientId: string, redirectUrl: string, clientSecret: string}}
     */
    static getDecryptedClient(agency) {
        return {
            clientId: AppHelper.decrypt(agency.gmail_oauth.client_id),
            clientSecret: AppHelper.decrypt(agency.gmail_oauth.client_secret),
            redirectUrl: AppHelper.decrypt(agency.gmail_oauth.redirect_uris)
        }
    };
}

module.exports = AppHelper;