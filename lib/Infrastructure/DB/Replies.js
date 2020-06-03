const ReplyModel = require("../Models/ReplyModel");

class Replies {

    static async addReply(replyObject) {
        return await ReplyModel.findOneAndUpdate({ email_id: replyObject.email_id }, replyObject, { upsert: true }).exec();
    }
}

module.exports = Replies;