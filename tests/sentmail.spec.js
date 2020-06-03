require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const SentMails = require('../lib/Infrastructure/DB/SentMails');
const {expect} = require('chai');


describe('SentMail DB Service', function() {
  after(async function () {
    await mongoose.disconnect()
  });
  it('should get item by sent mail and recipient', async function() {
    this.timeout(5000);
    const campaignItemID = "5c3f2b107a03d903fbc2ed7b";
    const recipientId = "5c3e04b47a03d903fbc2ed5d";
    const sentMail = await SentMails.getIDByCampaignItemAndRecipient(campaignItemID, recipientId);
    console.log(sentMail);
  });

});