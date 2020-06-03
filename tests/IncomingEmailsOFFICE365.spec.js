require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const IncomingEmails = require('../lib/Services/SMTPTracker/IncomingEmails');
const {expect} = require('chai');


describe('Incoming Mail SMTP Service', function() {
    after(async function () {
        await mongoose.disconnect()
    });
    it('should get item by sent mail and recipient', async function() {
        this.timeout(35000);
        const testUserId = "5c3dac527a03d903fbc2ed41";
        const mails = await IncomingEmails.getIncomingEmailsForUserOFFICE365(testUserId);
        console.log(mails);
    });
});