require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const GMailFactory = require('../lib/Factories/GMailSyncFactory');
const MailDetailsDb = require('../lib/Infrastructure/DB/MailDetails');
const AgencySettingsDb = require('../lib/Infrastructure/DB/AgencySettings');
const AppHelper = require('../lib/Services/Core/AppHelper');

const {expect} = require('chai');


describe('Incoming Mail Service', function() {
    after(async function () {
        await mongoose.disconnect()
    });
    it('should get item by sent mail and recipient', async function() {
        this.timeout(35000);
        const userId = "5c3dac527a03d903fbc2ed41";
        const messageID = "168af99f73e992d4";
        const agency = await AgencySettingsDb.getAgency();
        const client = AppHelper.getDecryptedClient(agency);
        const mailDetails = await MailDetailsDb.getByUserId(userId);
        const GMailSyncFactory = new GMailFactory(client, mailDetails.gmail.access_creds);

        await GMailSyncFactory.getMessageById(messageID);
    });
});