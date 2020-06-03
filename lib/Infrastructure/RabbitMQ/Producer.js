const config = require("../../../config");
const RabbitMQ = require('./RabbitMQ');


class Producer {

    static async sendMessage(message){
        try {
            const publisherConfig = config["rabbitmq"].publisher;
            const msg = new Buffer(JSON.stringify(message));
            const channel = await RabbitMQ.getChannel(publisherConfig.exchangeName, publisherConfig.exchangeType);
            const publishResult = await channel.publish(publisherConfig.exchangeName, publisherConfig.routingKey, msg, {persistent: true});
            console.log(publishResult);
        }catch (e) {
            throw e;
        }

    };
}


module.exports = Producer;
