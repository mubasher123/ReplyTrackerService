require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const ReplyService = require('../lib/Services/Replies/SMTPReplyService');
const {expect} = require('chai');


describe('SMTP Reply Service', function() {
    after(async function () {
        await mongoose.disconnect()
    });
    it('It will add replieds to the DB', async function() {
        this.timeout(35000);
        const testUserId = "5a7c4f2b947d2e6237e99dd5";
        const mails = await ReplyService.getReplies(testUserId, 'amazonses');
        console.log(mails);
    });
});