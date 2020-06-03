const MailDetailsDb = require('../../Infrastructure/DB/MailDetails');
const SMTPFactory = require('../../Factories/SMTPFactory');
const FileSystemCache = require('../../Infrastructure/Cache/FileSystem');
const log = require('../../Infrastructure/Logging/Log');

class IncomingEmails {

    /**
     *
     * @param userId
     * @returns {Promise<Array>}
     */
    static async getIncomingEmailsForUserSMTP(userId) {
        try {
            const mailDetails = await MailDetailsDb.getByUserId(userId);
            if (typeof mailDetails.custom === 'undefined') {
                throw (`SMTP Details Are Not Available For User: ${userId}`);
            }
            const filename = `${userId}_SMTP`;
            let lastUID;
            lastUID = await FileSystemCache.get(filename);
            const messages = await SMTPFactory.queryMessages(mailDetails.custom.imap_creds, lastUID);
            lastUID = messages.lastUID;
            await FileSystemCache.set(filename, lastUID.toString());
            return messages.emails;
        } catch (e) {
            switch (e) {
                case 'No Emails Are Available To Track':
                    log.info({ userId: userId }, 'No Emails Are Available To Track For Custom SMTP Service');
                    break;
                case 'Could not connect to imap':
                    log.error({ userId: userId }, 'Could not establish connection with imap For Custom SMTP Service');
                    break;
                default:
                    log.error(e);
            }
            return [];
        }

    }

    /**
     *
     * @param userId
     * @returns {Promise<*>}
     */
    static async getIncomingEmailsForUserAmazonSes(userId) {
        try {
            const mailDetails = await MailDetailsDb.getByUserId(userId);
            if (typeof mailDetails.amazonses === 'undefined') {
                throw (`Amazon SES Details Are Not Available For User: ${userId}`);
            }
            const filename = `${userId}_SES`;
            let lastUID;
            lastUID = await FileSystemCache.get(filename);
            const messages = await SMTPFactory.queryMessages(mailDetails.amazonses.imap_creds, lastUID);
            lastUID = messages.lastUID;
            await FileSystemCache.set(filename, lastUID.toString());
            return messages.emails;
        } catch (e) {
            switch (e) {
                case 'No Emails Are Available To Track':
                    log.info({ userId: userId }, 'No Emails Are Available To Track For Custom Amazon SES Service');
                    break;
                case 'Could not connect to imap':
                    log.error({ userId: userId }, 'Could not establish connection with imap For Amazon SES Service');
                    break;
                default:
                    log.error(e);
            }
            return [];
        }
    }

    /**
     *
     * @param userId
     * @return {Promise<Array|*>}
     */
    static async getIncomingEmailsForUserOFFICE365(userId) {
        try {
            const mailDetails = await MailDetailsDb.getByUserId(userId);
            if (typeof mailDetails.custom === 'undefined') {
                throw (`OFFICE365 Details Are Not Available For User: ${userId}`);
            }
            const filename = `${userId}_OFFICE365`;
            let lastUID;
            lastUID = await FileSystemCache.get(filename);
            const messages = await SMTPFactory.queryMessages(mailDetails.office365.imap_creds, lastUID);
            lastUID = messages.lastUID;
            await FileSystemCache.set(filename, lastUID.toString());
            return messages.emails;
        } catch (e) {
            switch (e) {
                case 'No Emails Are Available To Track':
                    log.info({ userId: userId }, 'No Emails Are Available To Track For OFFICE365 Service');
                    break;
                case 'Could not connect to imap':
                    log.error({ userId: userId }, 'Could not establish connection with imap For OFFICE365 Service');
                    break;
                default:
                    log.error(e);
            }
            return [];
        }

    }
}

module.exports = IncomingEmails;
