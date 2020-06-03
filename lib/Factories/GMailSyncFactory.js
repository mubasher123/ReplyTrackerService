const _ = require("lodash");
const { google } = require('googleapis');
const gmailApiParser = require('gmail-api-parse-message');
const sortBy = require('sort-by');
const log = require('../Infrastructure/Logging/Log');
const async = require("async");


/**
 *
 * @param capital
 * @returns {string}
 */
const getSubjectFieldName = (capital) => {
    let subject = 'subject';
    if (capital) {
        subject = 'Subject';
    }
    return subject;
};

/**
 *
 * @param capital
 * @returns {string}
 */
const getFromFieldName = (capital) => {
    let from = 'from';
    if (capital) {
        from = 'From';
    }
    return from;
};

/**
 *
 * @param capital
 * @returns {string}
 */
const getToFieldName = (capital) => {
    let to = 'to';
    if (capital) {
        to = 'To';
    }
    return to;
};

const getRefrenceFieldName = () => {
    return "References";
};

const getMessageIdFieldName = () => {
    return "Message-ID";
};

/**
 *
 * @param auth
 * @returns {Promise<gmail_v1.Schema$Profile>}
 */
const getCurrentHistoryId = async (auth) => {
    const gmail = google.gmail('v1');
    return await gmail.users.getProfile({
        auth: auth,
        userId: 'me'
    });
};

/**
 *
 * @param emails
 * @returns {*}
 */
const getLastEmail = (emails) => {
    return emails.sort(sortBy('-id'))[0];

};

/**
 *
 * @param message
 * @param auth
 * @returns {*}
 */
const getHistoryId = async (message, auth) => {
    const parsedMessages = await getMessages({ format: 'list' }, [message], auth);
    return parsedMessages[0].historyId;
};

/**
 *
 * @param headers
 * @param name
 * @returns {string}
 */
const getHeader = (headers, name) => {
    let header = '';
    headers.map(function (entry) {
        if (entry.name === name) {
            header = entry.value;
        }
    });
    return header;
};

/**
 *
 * @param options
 * @param messageIds
 * @param auth
 * @param capital
 * @returns {Promise<[any, any, any, any, any, any, any, any, any, any]>}
 */
const getMessages = async (options, messageIds, auth, capital = false) => {
    const gmail = google.gmail('v1');
    let gmailApiFormat;
    switch (options.format) {
        case 'list':
            gmailApiFormat = 'metadata';
            break;
        case 'metadata':
            gmailApiFormat = 'metadata';
            break;
        case 'raw':
            gmailApiFormat = 'raw';
            break;
        case 'full':
            gmailApiFormat = 'full';
            break;
        default:
            gmailApiFormat = 'full';
    }
    return new Promise(function (resolve, reject) {
        async.mapLimit(messageIds, 3, async (messageId) => {
            try {
                const response = await gmail.users.messages.get({
                    auth: auth,
                    userId: 'me',
                    id: messageId.id,
                    format: gmailApiFormat
                });
                const message = {};
                const subject = getSubjectFieldName(capital);
                const from = getFromFieldName(capital);
                const to = getToFieldName(capital);
                const reference = getRefrenceFieldName();
                const messageIdHeader = getMessageIdFieldName();
                message.id = response.data.id;
                message.historyId = response.data.historyId;
                //message.raw = response.data.raw;
                if (response.data.payload) {
                    const payloadHeaders = response.data.payload.headers;
                    message.subject = getHeader(payloadHeaders, subject);
                    message.from = getHeader(payloadHeaders, from);
                    message.to = getHeader(payloadHeaders, to);
                    message.date = getHeader(payloadHeaders, 'Date');
                    message.refrence = getHeader(payloadHeaders, reference);
                    message.replyTo = getHeader(payloadHeaders, 'In-Reply-To');
                    message.message_id = getHeader(payloadHeaders, messageIdHeader);
                    const parsedMessage = gmailApiParser(response.data);
                    if (typeof parsedMessage.textHtml !== "undefined") {
                        message.textHtml = parsedMessage.textHtml;
                        message.isHtml = true;
                    } else {
                        message.isHtml = false;
                    }
                    if (typeof parsedMessage.textPlain !== "undefined") {
                        message.textPlain = parsedMessage.textPlain;
                    }


                }
                return message;
            } catch (e) {
                log.error(e);
            }
        }, function (err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    });

};

/**
 *
 * @param query
 * @param auth
 * @returns {Promise<*>}
 */
const fullSyncListMessages = async (query, auth) => {
    const messages = [];
    const initialMessagesList = await listMessagesInitial(query, auth);
    if (initialMessagesList == null) {
        return null;
    }
    return await listMessagesPage(query, initialMessagesList, messages, auth);
};

/**
 *
 * @param query
 * @param auth
 * @returns {Promise<*>}
 */
const listMessagesInitial = async (query, auth) => {
    const gmail = google.gmail('v1');
    try {
        const initialMessageList = await gmail.users.messages.list({
            auth: auth,
            userId: 'me',
            q: query
        });
        if (initialMessageList.data.resultSizeEstimate > 0) {
            return initialMessageList.data;
        } else {
            log.error('No Initial Email Found');
            return null;
        }
    } catch (e) {
        log.error(e);
        return null;
    }
};

/**
 *
 * @param query
 * @param initialMessagesList
 * @param messages
 * @param auth
 * @returns {Promise<null>}
 */
const listMessagesPage = async (query, initialMessagesList, messages, auth) => {
    if (initialMessagesList.messages == null) {
        return null;
    }
    messages = messages.concat(initialMessagesList.messages);

    const nextPageToken = initialMessagesList.nextPageToken;
    if (nextPageToken) {
        const gmail = google.gmail('v1');
        try {
            const response = await gmail.users.messages.list({
                auth: auth,
                userId: 'me',
                pageToken: nextPageToken,
                q: query
            });
            return await listMessagesPage(query, response.data, messages, auth);
        } catch (e) {
            log.error(e);
            return null;
        }
    } else {
        log.info('New messages retrieved: ' + messages.length);
        if (messages.length > 0) {
            return messages;
        }
        return null;
    }

};

/**
 *
 * @param historyId
 * @param auth
 * @returns {Promise<void>}
 */
const partialSyncListMessages = async (historyId, auth) => {
    const messages = [];
    const partialInitialMessageList = await partialSyncListMessagesInitial(historyId, auth);
    if (typeof partialInitialMessageList.data.history === "undefined") {
        return {
            messages: [],
            historyId: partialInitialMessageList.data.historyId
        };
    }
    return await partialSyncListMessagesPage(partialInitialMessageList.data, messages, auth);
};

/**
 *
 * @param resp
 * @param messages
 * @param auth
 * @returns {Promise<*>}
 */
const partialSyncListMessagesPage = async (resp, messages, auth) => {
    const newMessages = [];
    if (resp.history == null) {
        return {
            messages: messages,
            historyId: resp.historyId
        }
    }
    resp.history.forEach(function (item) {
        newMessages.push(item.messages[0]);
    });
    messages = messages.concat(newMessages);

    const nextPageToken = resp.nextPageToken;
    if (nextPageToken) {
        const gmail = google.gmail('v1');
        try {
            const response = await gmail.users.history.list({
                auth: auth,
                userId: 'me',
                pageToken: nextPageToken,
                startHistoryId: resp.historyId
            });
            return await partialSyncListMessagesPage(response, messages, auth);
        } catch (e) {
            log.error(e);
        }
    } else {
        return {
            messages: newMessages,
            historyId: resp.historyId
        }
    }

};

/**
 *
 * @param historyId
 * @param auth
 * @returns {Promise<void>}
 */
const partialSyncListMessagesInitial = async (historyId, auth) => {
    const gmail = google.gmail('v1');
    let response = {};
    try {
        response = await gmail.users.history.list({
            auth: auth,
            userId: 'me',
            startHistoryId: historyId,
            historyTypes: 'messageAdded'
        });
        if (response.code === 404) {
            const currentHistoryId = await getCurrentHistoryId(auth);
            response = {
                messages: [],
                historyId: currentHistoryId
            };
        }
        return response;
    } catch (e) {
        log.error(e);
        if (e.code === 404) {
            const currentHistoryId = await getCurrentHistoryId(auth);
            response = {
                messages: [],
                historyId: currentHistoryId
            };
        }
        return response;
    }
};

class GMailSyncFactory {
    /**
     *
     * @param client
     * @param authTokens
     */
    constructor(client, authTokens) {
        const GMailClient = new google.auth.OAuth2(client.clientId, client.clientSecret, client.redirectUrl);
        GMailClient.credentials = authTokens;

        GMailClient.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
                // store the refresh_token in my database!
                this.oAuth2Client.credentials.refresh_token = tokens.refresh_token;
            }
            this.oAuth2Client.credentials.access_token = tokens.access_token;
        });
        this.oAuth2Client = GMailClient;
    }

    async getMessageById(messageId) {
        const gmail = google.gmail('v1');
        const response = await gmail.users.messages.get({
            auth: this.oAuth2Client,
            userId: 'me',
            id: messageId,
            format: "full"
        });


        if (response.status === 200) {
            const payloadHeaders = response.data.payload.headers;
            const messageID = _.chain(payloadHeaders).filter(header => {
                return (header.name === "Message-Id")
            }).map(header => {
                return header.value
            }).head().value();
        }

    }

    /**
     *
     * @param options
     * @returns {Promise<Object|boolean>}
     */
    async queryMessages(options) {
        const response = {};
        const messages = await fullSyncListMessages(options.query, this.oAuth2Client);
        if (messages == null) {
            return null;
        }
        if (options.format === 'list') {
            response.emails = messages;
            const lastEmail = getLastEmail(messages);
            response.historyId = await getHistoryId(lastEmail, this.oAuth2Client);
            return response;
        } else {
            try {
                const emails = await getMessages(options, messages, this.oAuth2Client, true);
                response.emails = emails;
                const lastEmail = getLastEmail(emails);
                response.historyId = lastEmail.historyId;
                return response;
            } catch (e) {
                log.error(e);
                return null;
            }

        }
    }

    /**
     *
     * @param options
     * @returns {Promise<Object>}
     */
    async syncMessages(options) {
        let response = {};
        const messages = await partialSyncListMessages(options.historyId, this.oAuth2Client);
        if (messages.messages.length === 0) {
            response.historyId = messages.historyId;
            response.emails = [];
            return response;
        }
        if (options.format === 'list') {
            response.emails = messages.messages;
            response.historyId = await getHistoryId(messages.messages[messages.messages.length - 1], this.oAuth2Client);
            return response;
        } else {
            const newEmails = await getMessages(options, messages.messages, this.oAuth2Client, true);
            response.emails = newEmails;
            if (newEmails[newEmails.length - 1])
                response.historyId = newEmails[newEmails.length - 1].historyId;
            else {
                response.historyId = messages.historyId;
            }
            return response;
        }
    }
}

module.exports = GMailSyncFactory;