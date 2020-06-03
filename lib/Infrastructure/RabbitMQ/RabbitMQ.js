const rabbit = require('amqplib');
const async = require('async');
const server = process.env.RABBITMQ_CONN_URL; //'amqp://ivjivzmg:AAr2QkgMk9-O5-pW8-wNH2hmKxBkiTTR@sidewinder.rmq.cloudamqp.com/ivjivzmg';
const _channel = {};
let _conn = null;

/**
 *
 * @param {Channel} channel
 * @param {String} exchangeName
 * @param {String} exchangeType
 * @returns {Promise<void>}
 */
const assertExchange = async (channel, exchangeName, exchangeType) => {
    try {
        await channel.checkExchange(exchangeName);
    } catch (e) {
        await channel.assertExchange(exchangeName, exchangeType);
    }
};

class RabbitMQ {

    /**
     *
     * @param exchangeName
     * @param exchangeType
     * @returns {Promise<Channel>}
     */
    static async getChannel(exchangeName, exchangeType) {
        if (typeof _channel[exchangeName] != 'undefined') {
            return _channel[exchangeName];
        } else {
            return new Promise(function (resolve, reject) {
                rabbit.connect(server).then(function (conn) {
                    _conn = conn;
                    return conn.createChannel();
                }).then(function (channel) {
                    _channel[exchangeName] = channel;
                    resolve(channel) ;
                });
            });

        }

    }

    static async closeConnection(){
        console.log("close connection");
        if(_conn !== null){
            await _conn.close();
        }
    }
}


module.exports = RabbitMQ;