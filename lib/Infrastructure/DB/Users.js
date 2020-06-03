const UsersModel = require('../Models/User');
const log = require('../../Infrastructure/Logging/Log');
const mongoose = require('mongoose');


class Users {
    /**
     *
     * @param userId
     * @returns {Promise<{}>}
     */
    static async getUser(userId) {
        try {
            let user = await UsersModel.findOne({
                _id: mongoose.Types.ObjectId(userId)
            });
            user = JSON.parse(JSON.stringify(user));
            return user;
        } catch (e) {
            log.error(e);
            return {};
        }
    }
}

module.exports = Users;