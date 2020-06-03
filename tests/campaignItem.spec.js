require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const CampaignItems = require('../lib/Infrastructure/DB/CampaignItems');
const {expect} = require('chai');


describe('CampaignItems Db Service', function() {

  after(async function () {
    await mongoose.disconnect()
  });
  it('should get item by sent mail and recipient', async function() {
    this.timeout(5000);
    const campaignItemID = "5c50b7bf88fe425529d630bc";
    const campaignItem = await CampaignItems.getByCampaignItemId(campaignItemID);
    console.log(campaignItem);
  });

});