const _ = require('lodash');
const getUrls = require('get-urls');
const url = require('url');

class ReplyHelper {

    static getTrackUrlFromString(reply) {
        try {
            let urls;
            if (reply.isHtml) {
                urls = getUrls(reply.textHtml, { extractFromQueryString: true });
            } else {
                urls = getUrls(reply.textPlain, { extractFromQueryString: true });
            }

            const openLinks = _.filter(Array.from(urls),
                x => {
                    return ((x.indexOf('track-open') !== -1))
                });

            if (openLinks.length) {
                return openLinks[0];
            } else {
                const unsubscribeLinks = _.filter(Array.from(urls), x => {
                    return (x.indexOf('unsubscribe') !== -1) && (x.indexOf('%2Funsubscribe%2F') === -1)
                });
                if (unsubscribeLinks.length) {
                    return unsubscribeLinks[0];
                }

            }
        } catch (e) {
            return false;
        }

    }

    static parseIds(trackOpenLink) {
        const matchRegex = new RegExp('(\\w{24})', 'g');
        const parsedOpenLink = url.parse(trackOpenLink);
        return parsedOpenLink.path.match(matchRegex);
    }
}

module.exports = ReplyHelper;