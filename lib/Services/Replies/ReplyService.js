const _ = require('lodash');
const async = require("async");
const SentMails = require('../../Infrastructure/DB/SentMails');
const IncomingEmails = require('../GmailTracker/IncomingEmails');
const Replies = require("../../Infrastructure/DB/Replies");
const EmailReplyParser = require("email-reply-parser");

/**
 *
 * @param sentMailRecord
 * @param sentMailItem
 * @param {Object} reply
 * @returns {Object}
 */
const prepareReply = (sentMailRecord, sentMailItem, reply) => {

    const funnelBakeReply = {
        user_id: sentMailRecord.user_id,
        team_id: sentMailRecord.team_id,
        campaign_id: (sentMailRecord.campaign_id) ? sentMailRecord.campaign_id : null,
        campaignitem_id: (sentMailRecord.campaignitem_id) ? sentMailRecord.campaignitem_id : null,
        sent_mail_id: (sentMailItem) ? sentMailItem._id : null,
        recipient_id: (sentMailItem) ? sentMailItem.recipient_id : sentMailRecord.recipient_id,
        email_subject: reply.subject,
        email_from: reply.from,
        email_date: reply.date,
        email_to: reply.to,
        email_id: reply.message_id,
        team_lead: null,
        allowed_team_members: [],
        category: null,
    };

    if (typeof reply.textPlain !== 'undefined') {
        funnelBakeReply["isHtml"] = false;
        const email =  new EmailReplyParser().read(reply.textPlain);
        funnelBakeReply["email_body"] = email.getVisibleText().trim();
    } else {
        funnelBakeReply["isHtml"] = true;
        funnelBakeReply["email_body"] = reply.textHtml;
    }

    return funnelBakeReply;

};

/**
 *
 * @param previousReplyFromDb
 * @param reply
 */
const prepareReplyForThread = (previousReplyFromDb, reply) => {
    const funnelBakeReply = {
        user_id: previousReplyFromDb.user_id,
        team_id: previousReplyFromDb.team_id,
        campaign_id: (previousReplyFromDb.campaign_id) ? previousReplyFromDb.campaign_id : null,
        campaignitem_id: (previousReplyFromDb.campaignitem_id) ? previousReplyFromDb.campaignitem_id : null,
        sent_mail_id: null,
        recipient_id: previousReplyFromDb.recipient_id,
        email_subject: reply.subject,
        email_from: reply.from,
        email_date: reply.date,
        email_to: reply.to,
        email_id: reply.message_id,
        team_lead: null,
        allowed_team_members: [],
        category: null,
    };

    if (typeof reply.textPlain !== 'undefined') {
        funnelBakeReply["isHtml"] = false;
        const email =  new EmailReplyParser().read(reply.textPlain);
        funnelBakeReply["email_body"] = email.getVisibleText().trim();
    } else {
        funnelBakeReply["isHtml"] = true;
        funnelBakeReply["email_body"] = reply.textHtml;
    }

    return funnelBakeReply;
};

const processValidReplies = (validReplies) => {
    return new Promise(function (resolve, reject) {
        async.mapSeries(validReplies, async reply => {
            const reference = reply.refrence.split(" ");
            const sentMailRecord = await SentMails.getBySentMessageId(reference[0]);
            if (sentMailRecord) {
                const sentMailItem = _.chain(sentMailRecord.sent).filter({ message_id: reference[0] }).head().value();
                return prepareReply(sentMailRecord, sentMailItem, reply);
            } else {
                if (typeof reply.replyTo !== "undefined") {
                    const previousReplyFromDb = await SentMails.getReplyByMessageId(reply.replyTo);
                    if (previousReplyFromDb) {
                        return prepareReplyForThread(previousReplyFromDb, reply);
                    }
                }
                return false;
            }
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });

};

const addFunnelBakeRepliesToDb = (validFunnelBakeReplies) => {
    return new Promise(function (resolve, reject) {
        async.mapSeries(validFunnelBakeReplies, async reply => {
            return await Replies.addReply(reply);
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const filterRepliesWithNoSubject = reply => {
    if (typeof reply !== "undefined") {
        return ((reply.refrence !== '' && reply.from.indexOf('daemon') === -1) ||
            (typeof reply.replyTo !== "undefined" && reply.replyTo !== '' && reply.from.indexOf('daemon') === -1)
        );
    } else {
        return false
    }
};

class ReplyService {

    static async getReplies(userId) {

        const replies = await IncomingEmails.getIncomingEmailsForUser(userId);

        //filter out only replies from service
        const validReplies = _.filter(replies, filterRepliesWithNoSubject);
        const parsedFunnelBakeReplies = await processValidReplies(validReplies);
        const validFunnelBakeReplies = _.filter(parsedFunnelBakeReplies, x => {
            return (x !== false)
        });
        return await addFunnelBakeRepliesToDb(validFunnelBakeReplies);
    }
}

module.exports = ReplyService;