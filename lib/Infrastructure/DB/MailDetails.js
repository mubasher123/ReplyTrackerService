const MailDetailsModel = require('../Models/MailDetails');
const log = require('../Logging/Log');
const mongoose = require('mongoose');

class MailDetails {
    static async getAll() {
        try {
            let allMailDetails = await MailDetailsModel.find({
                _id: mongoose.Types.ObjectId("5c507fdb80cf34f4f1ec4af2")
            });
            allMailDetails = JSON.parse(JSON.stringify(allMailDetails));
            return allMailDetails;
        } catch (e) {
            log.error(e);
            return false;
        }
    }

    static async getMailDetails() {
        try {
            let allMailDetails = await MailDetailsModel.find({});
            allMailDetails = JSON.parse(JSON.stringify(allMailDetails));
            return allMailDetails;
        } catch (e) {
            log.error(e);
            return false;
        }
    }

    static async getByUserId(userId) {
        try {
            let userMailDetails = await MailDetailsModel.findOne({
                user_id: mongoose.Types.ObjectId(userId)
            }).exec();
            if (userMailDetails) {
                return userMailDetails;
            }
            return false;
        } catch (e) {
            log.error(e);
            return false;
        }
    }
}

module.exports = MailDetails;