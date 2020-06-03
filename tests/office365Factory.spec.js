require('dotenv').config();
var CryptoJS = require('crypto-js');
const smtpFactory = require('../lib/Factories/SMTPFactory');
const {expect} = require('chai');
var ciphertext = CryptoJS.AES.encrypt(process.env.OFFICE365_PASSWORD, process.env.HASH_SECRET);

const credentials = {
    username: 'hithesh.puh@outlook.com',
    passwordhash: 'hithesh@',
    host: 'outlook.office365.com',
    port: 993,
    tls: true,
    authTimeout: 6000
};

describe('SMTP Reply Service', function () {
    it('It will add replieds to the DB', async function () {
        this.timeout(35000);
        try {
            const mails = await smtpFactory.queryMessages(credentials, false);
            console.log(mails);
        } catch (e) {
            console.log(e);
        }
    });
});
