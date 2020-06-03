const MailDetailsDb = require('../../Infrastructure/DB/MailDetails');
const FileSystemCache = require('../../Infrastructure/Cache/FileSystem');
const AgencySettingsDb = require('../../Infrastructure/DB/AgencySettings');
const GMailFactory = require('../../Factories/GMailSyncFactory');
const AppHelper = require('../Core/AppHelper');
const userDb = require('../../Infrastructure/DB/Users');
const log = require('../../Infrastructure/Logging/Log');

class IncomingEmails {

	/**
	 *
	 * @returns {Promise<Object[]>}
	 */
	static async getIncomingEmailsForUser(userId) {
		try {
			const user = await userDb.getUser(userId);
			const agency = await AgencySettingsDb.getAgency(user.agency_id);
			const client = AppHelper.getDecryptedClient(agency);
			const mailDetails = await MailDetailsDb.getByUserId(userId);
			const GMailSyncFactory = new GMailFactory(client, mailDetails.gmail.access_creds);
			let historyId;
			historyId = await FileSystemCache.get(userId);
			// check if history id is present in cache
			if (!historyId) {
				const initialQuery = await GMailSyncFactory.queryMessages({
					query: 'newer_than:10d'
				});
				if (initialQuery !== null) {
					historyId = initialQuery.historyId;
					await FileSystemCache.set(userId, historyId.toString());
					return initialQuery.emails;
				} else {
					return [];
				}

			} else {
				const emailsSinceLastRun = await GMailSyncFactory.syncMessages({
					historyId: historyId
				});
				historyId = emailsSinceLastRun.historyId;
				await FileSystemCache.set(userId, historyId.toString());
				return emailsSinceLastRun.emails;
			}
		} catch (e) {
			log.error(e);
			return [];
		}

	}
}

module.exports = IncomingEmails;