const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const RepliesSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    team_id: mongoose.Schema.Types.ObjectId,
    campaignitem_id: mongoose.Schema.Types.ObjectId,
    campaign_id: mongoose.Schema.Types.ObjectId,
    sent_mail_id: mongoose.Schema.Types.ObjectId,
    recipient_id: mongoose.Schema.Types.ObjectId,
    email_subject: String,
    email_from: String,
    email_to: String,
    email_date: String,
    email_id: String,
    email_body: String,
    isHtml: Boolean,
    allowed_team_members: [mongoose.Schema.Types.ObjectId],
    category: String,
    team_lead: mongoose.Schema.Types.ObjectId

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false, usePushEach: true });

const RepliesModel = mongoose.model('replies', RepliesSchema);

module.exports = RepliesModel;