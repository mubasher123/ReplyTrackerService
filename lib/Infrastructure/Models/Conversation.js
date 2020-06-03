const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Conversation = mongoose.Schema({
        email_body: String,
        email_subject: String,
        type: { type: String, enum: ['note', 'email'] },
        recipient_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        team_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        error: String,
        message_id: String,
        thread_id: String,
        opened: Boolean
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, strict: false, versionKey: false }
);

const ConversationModel = mongoose.model('conversation', Conversation);

module.exports = ConversationModel;