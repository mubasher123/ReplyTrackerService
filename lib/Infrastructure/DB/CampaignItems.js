const mongoose = require('mongoose');
const CampaignItemsModel = require('../Models/CampaignItems');
const log = require('../Logging/Log');


class CampaignItems {
	static async getByCampaignItemId(campaignItemId) {
		try {
			const campaignItem = await CampaignItemsModel.findOne({
				_id: mongoose.Types.ObjectId(campaignItemId)
			}).exec();
			if (campaignItem) {
				return JSON.parse(JSON.stringify(campaignItem));
			}
			return false;
		} catch (e) {
			log.error(e);
			return false;
		}
	}
}

module.exports = CampaignItems;