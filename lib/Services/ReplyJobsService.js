const async = require("async");
const log = require("../Infrastructure/Logging/Log");
const Producer = require("../Infrastructure/RabbitMQ/Producer");
const MailDetailsService = require("./Core/MailDetailsService");

class ReplyJobsService {

    static async publishJobs() {
        const allMailDetails = await MailDetailsService.getMailDetails();

        return new Promise(function (resolve, reject) {
            async.mapSeries(allMailDetails, async mailDetails => {
                try {
                    const message = { user_id: mailDetails.user_id };
                    log.info(message, "Publishing message for service");
                    return await Producer.sendMessage(message);
                } catch (e) {
                    log.error(e);
                    return false;
                }

            }, function (err, result) {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });

    }
}

module.exports = ReplyJobsService;