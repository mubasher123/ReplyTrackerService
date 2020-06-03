const MailDetailsDb = require('../../Infrastructure/DB/MailDetails');

class MailDetailsService {

    static async getMailDetails(){
        return await MailDetailsDb.getMailDetails();
    }
}

module.exports = MailDetailsService;