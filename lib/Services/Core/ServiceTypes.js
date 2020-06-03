const smtp = "smtp";
const amazonSes = "amazonses";
const office365 = "office365";

class ServiceType {
    /**
     *
     * @returns {string}
     * @constructor
     */
    static get SMTP() {
        return smtp;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get AMAZONSES() {
        return amazonSes;
    }

    /**
     *
     * @return {string}
     * @constructor
     */
    static get OFFICE365() {
        return office365;
    }
}

module.exports = ServiceType;
