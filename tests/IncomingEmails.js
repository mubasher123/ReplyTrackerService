require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const IncomingEmails = require('../lib/Services/GmailTracker/IncomingEmails');
const {expect} = require('chai');


describe('Incoming Mail Service', function() {
  after(async function () {
    await mongoose.disconnect()
  });
  it('should get item by sent mail and recipient', async function() {
    this.timeout(35000);
    const testUserId = "5c408619240b05108daff52c";
    const mails = await IncomingEmails.getIncomingEmailsForUser(testUserId);
    console.log(mails);
  });
});