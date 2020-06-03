module.exports = {
    rabbitmq: {
        publisher: {
            exchangeName: "replies",
            exchangeType: "direct",
            routingKey: ""
        },
        consumer: {
            queueName: 'replies.q',
            exchangeName: 'replies',
            exchangeType: 'direct',
            routingKey: '',
            queueOptions: { durable: true }
        }
    }

};