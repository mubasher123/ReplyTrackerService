require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const MailDetails = require('../lib/Infrastructure/DB/MailDetails');
const {expect} = require('chai');


describe('MailDetails DB Service', function() {
  after(async function () {
    await mongoose.disconnect()
  });
  it('should get item by sent mail and recipient', async function() {
    this.timeout(5000);
    const testUserId = "5c3dab2c7a03d903fbc2ed3d";
    const mailDetails = await MailDetails.getByUserId(testUserId);
    console.log(mailDetails);
  });

});