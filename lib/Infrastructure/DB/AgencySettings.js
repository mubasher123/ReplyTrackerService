const AgencySettingsModel = require('../Models/AgencySettings');
const log = require('../Logging/Log');

class AgencySettings {
    static async getAgency(agencyId) {
        try {
            let agency = await AgencySettingsModel.findOne({
                agency_id: agencyId
            });
            agency = JSON.parse(JSON.stringify(agency));
            return agency;
        } catch (e) {
            log.error(e);
        }
    }

}

module.exports = AgencySettings;