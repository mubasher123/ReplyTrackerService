const _ = require('lodash');
const async = require('async');
const SMTPIncomingEmails = require('../SMTPTracker/IncomingEmails');
const SentMails = require('../../Infrastructure/DB/SentMails');
const Replies = require('../../Infrastructure/DB/Replies');
const log = require('../../Infrastructure/Logging/Log');
const serviceType = require('../Core/ServiceTypes');
const emailParser = require('mailparser').simpleParser;
const EmailReplyParser = require("email-reply-parser");

/**
 *
 * @param reply
 * @returns {boolean}
 */
const filterRepliesWithNoSubject = reply => {
    if (typeof reply !== "undefined") {
        return (typeof reply.parts[0].body.references !== 'undefined'
            && reply.parts[0].body.from[0].indexOf('DAEMON') === -1);
    } else {
        return false
    }
};

/**
 *
 * @param repliesWithMessageIds
 * @returns {Promise<any>}
 */
const processValidReplies = (repliesWithMessageIds) => {
    return new Promise(function (resolve, reject) {
        async.mapSeries(repliesWithMessageIds, async reply => {
            const sentMailRecord = await SentMails.getBySentMessageId(reply.messageId);
            if (sentMailRecord) {
                const sentMailItem = _.chain(sentMailRecord.sent).filter({ message_id: reply.messageId }).head().value();
                return prepareReply(sentMailRecord, sentMailItem, reply);
            } else {
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

/**
 *
 * @param sentMailRecord
 * @param sentMailItem
 * @param reply
 * @returns {{email_to: *, email_id: string, email_date: string, team_id: (team_id|{type}), campaignitem_id: *, sent_mail_id: *, user_id: string | user_id | {type}, allowed_team_members: Array, category: null, email_subject: string, team_lead: null, campaign_id: (campaign_id|{type}), email_from: (string|email_id|{lowercase, type}), recipient_id: (recipient_id|{type})}}
 */
const prepareReply = (sentMailRecord, sentMailItem, reply) => {
    return {
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
        email_id: reply.messageId,
        team_lead: null,
        allowed_team_members: [],
        category: null,
        isHtml: true,
        email_body: reply.html
    };
};

/**
 *
 * @param validReplies
 * @returns {*}
 */
const transformReplies = async (validReplies) => {
    let repliesToReturn = [];
    for (const reply of validReplies) {
        reply.from = reply.parts[0].body.from[0];
        reply.to = reply.parts[0].body.to[0];
        reply.subject = reply.parts[0].body.subject[0];
        reply.date = reply.parts[0].body.date[0];
        reply.messageId = reply.parts[0].body.references[0].trim().split(' ')[0].trim();
        const parsedMsg = await emailParser(reply.parts[2].body);
        const email =  new EmailReplyParser().read(parsedMsg.text);
        reply.html = email.getVisibleText().trim();
        repliesToReturn.push(reply);
    }
    return repliesToReturn;
};

/**
 *
 * @param validFunnelBakeReplies
 * @returns {Promise<any>}
 */
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

/**
 *  Class SMTPReplyService
 */
class SMTPReplyService {
    /**
     *
     * @param userId
     * @param service
     * @returns {Promise<Array>}
     */
    static async getReplies(userId, service) {
        try {
            let replies = [];
            switch (service) {
                case serviceType.SMTP:
                    replies = await SMTPIncomingEmails.getIncomingEmailsForUserSMTP(userId);
                    break;
                case serviceType.AMAZONSES:
                    replies = await SMTPIncomingEmails.getIncomingEmailsForUserAmazonSes(userId);
                    break;
                case serviceType.OFFICE365:
                    replies = await SMTPIncomingEmails.getIncomingEmailsForUserOFFICE365(userId);
                    break;
            }

            //filter out only replies from service
            const validReplies = _.filter(replies, filterRepliesWithNoSubject);
            const transformedReplies = await transformReplies(validReplies);
            const parsedFunnelBakeReplies = await processValidReplies(transformedReplies);
            const validFunnelBakeReplies = _.filter(parsedFunnelBakeReplies, x => {
                return (x !== false)
            });
            await addFunnelBakeRepliesToDb(validFunnelBakeReplies);
            return validFunnelBakeReplies;
        } catch (e) {
            log.error(e);
            return [];
        }
    }
}

module.exports = SMTPReplyService;
