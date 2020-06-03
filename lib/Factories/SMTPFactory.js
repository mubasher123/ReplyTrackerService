const AppHelper = require('../Services/Core/AppHelper');
const imaps = require('imap-simple');
const log = require('../Infrastructure/Logging/Log');

const DELAY_TIME = 24 * 3600 * 2000;
const INBOX = 'INBOX';
const AUTH_TIMEOUT = 6000;

/**
 *
 * @param credentials
 * @returns {{imap: {password: (String|*), port: number, authTimeout: number, host: *, tls: boolean, user: *}}}
 */
const getImapConfig = (credentials) => {
    credentials.passwordhash = AppHelper.decrypt(credentials.passwordhash);
    return {
        imap: {
            user: credentials.username,
            password: credentials.passwordhash,
            host: credentials.host,
            port: credentials.port,
            tls: credentials.tls,
            authTimeout: AUTH_TIMEOUT
        }
    };
};

/**
 *
 * @returns {Date}
 */
const getTwoDaysAgoDate = () => {
    let twoDaysAgo = new Date();
    twoDaysAgo.setTime(Date.now() - DELAY_TIME);
    twoDaysAgo = twoDaysAgo.toISOString();
    return twoDaysAgo;
};

/**
 *
 * @param credentials
 * @returns {Promise<void>}
 */
const getSimpleImapConnection = async (credentials) => {
    const Config = getImapConfig(credentials);
    let connection = null;
    try {
        connection = await imaps.connect(Config);
        await connection.openBox(INBOX);
    } catch (e) {
        log.error(e, credentials);
    }
    return connection;
};

/**
 *
 * @param lastUID
 * @returns {string[]}
 */
const getSearchCriteria = (lastUID) => {
    let searchCriteria = ['All'];
    if (lastUID) {
        searchCriteria.push(['UID', `${lastUID}:*`]);
    } else {
        const twoDaysAgo = getTwoDaysAgoDate();
        searchCriteria.push(['SINCE', twoDaysAgo]);
    }
    return searchCriteria;
};

/**
 *
 * @returns {{struct: boolean, bodies: string, markSeen: boolean}}
 */
const getFetchOptions = () => {
    return {
        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE IN-REPLY-TO REFERENCES MESSAGE-ID)', 'TEXT', ''],
        markSeen: false,
        struct: true
    };
};

/**
 *
 * @param messages
 * @returns {*}
 */
const getLastUIDFromMessages = (messages) => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage.attributes.uid;
};

class SMTPFactory {
    /**
     *
     * @param credentials
     * @param lastUID
     * @returns {Promise<{emails: *, lastUID: *}>}
     */
    static async queryMessages(credentials, lastUID) {
        const connection = await getSimpleImapConnection(credentials);
        if (connection) {
            const searchCriteria = getSearchCriteria(lastUID);
            const fetchOptions = getFetchOptions();
            const messages = await connection.search(searchCriteria, fetchOptions);
            if (messages.length <= 0) {
                throw ('No Emails Are Available To Track');
            }
            const lastUId = getLastUIDFromMessages(messages);
            return {
                emails: messages,
                lastUID: lastUId
            };
        }
        throw ('Could not connect to imap');
    }
}

module.exports = SMTPFactory;