const _ = require("lodash");
const mongoose = require('mongoose');
const SentMailsModel = require('../Models/SentMails');
const log = require('../Logging/Log');
const ConversationModel = require('../Models/Conversation');
const ReplyModel = require('../Models/ReplyModel');


class SentMails {
	static async getIDByCampaignItemAndRecipient(campaignItemId, recipientId) {
		try {
			const sentItem = await SentMailsModel.findOne({
				'campaignitem_id': mongoose.Types.ObjectId(campaignItemId),
				'sent.recipient_id': mongoose.Types.ObjectId(recipientId)
			}).exec();
			if (sentItem) {
				const recipient = _.chain(sentItem.sent).filter({ recipient_id: mongoose.Types.ObjectId(recipientId) }).value();
				return recipient[0];
			}
			return false;
		} catch (e) {
			log.error(e);
			return false;
		}
	}

	static async getByCampaignItemAndRecipient(campaignItemId, recipientId) {
		try {
			const sentItem = await SentMailsModel.findOne({
				'campaignitem_id': mongoose.Types.ObjectId(campaignItemId),
				'sent.recipient_id': mongoose.Types.ObjectId(recipientId)
			}).exec();
			if (sentItem) {
				return sentItem;
			}
			return false;
		} catch (e) {
			log.error(e);
			return false;
		}
	}

	static async getBySentMessageId(sentMessageId) {
		try {
			const sentItem = await SentMailsModel.findOne({
				'sent.message_id': sentMessageId
			});
			if (sentItem) {
				return sentItem;
			}
			const sentItemFromConversations = await ConversationModel.findOne({
				'message_id': sentMessageId
			});
			if (sentItemFromConversations) {
				return sentItemFromConversations;
			}
			return false;
		} catch (e) {
			log.error(e);
			return false;
		}
	}

	static async getReplyByMessageId(messageId)
	{
		try {
			const reply = await ReplyModel.findOne({
				'email_id': messageId
			});
			if (reply) {
				return reply;
			}
			return false;
		} catch (e) {
			log.error(e);
			return false;
		}
	}
}

module.exports = SentMails;