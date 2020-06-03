const config = require("../../config");
const RabbitMQ = require('../Infrastructure/RabbitMQ/RabbitMQ');
const GMailReplyService = require("./Replies/ReplyService");
const SMTPReplyService = require("./Replies/SMTPReplyService");
const log = require('../Infrastructure/Logging/Log');
const serviceType = require('../Services/Core/ServiceTypes');
class ReplyJobProcessor {
    /**
     *
     * @returns {Promise<void>}
     */
    static async process() {
        const queueConfigs = config.rabbitmq.consumer;
        const queueName = queueConfigs.queueName;
        const exchangeName = queueConfigs.exchangeName;
        const exchangeType = queueConfigs.exchangeType;
        const routingKey = queueConfigs.routingKey;
        const queueOptions = queueConfigs.queueOptions;

        const channel = await RabbitMQ.getChannel(exchangeName, exchangeType);
        await channel.assertQueue(queueName, queueOptions);
        await channel.bindQueue(queueName, exchangeName, routingKey, {});
        await channel.prefetch(1);
        channel.consume(queueName, async function (msg) {
            try {
                const message = JSON.parse(msg.content.toString());
                log.info(message, "Msg Received from server");
                console.log(message, "Msg Received from server");
                SMTPReplyService.getReplies(message.user_id, serviceType.SMTP);
                SMTPReplyService.getReplies(message.user_id, serviceType.AMAZONSES);
                SMTPReplyService.getReplies(message.user_id, serviceType.OFFICE365);
                GMailReplyService.getReplies(message.user_id);
                await channel.ack(msg);
            } catch (e) {
                console.log(e)
                log.error(e);
            }

        });
    }
}

module.exports = ReplyJobProcessor;

