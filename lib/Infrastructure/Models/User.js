const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    agency_id: {
        type: String,
        default: '1524656223784UMWJZRDFPTfunnelbakeAgency'
    },
    firstname: String,
    lastname: String,
    email_id: { type: String, lowercase: true },
    password: {
        type: String,
    },
    password_token: String,
    token_expiry: Date,
    verified: {
        type: Boolean,
        default: false
    },
    domain: {
        domain_name: String,
        domain_token: String,
        verified: {
            type: Boolean,
            default: false
        },
        verified_date: {
            type: Date,
            default: null
        }
    },
    fcm_id: String,
    settings: {
        push_notification: { type: Boolean, default: false },
        report: {
            daily_report: {
                status: { type: Boolean, default: false },
                campaign_ids: [mongoose.Schema.Types.ObjectId]
            },
            weekly_report: {
                status: { type: Boolean, default: false },
                campaign_ids: [mongoose.Schema.Types.ObjectId]
            },
            on_open: {
                status: { type: Boolean, default: false },
                campaign_ids: [mongoose.Schema.Types.ObjectId]
            },
            on_reply: {
                status: { type: Boolean, default: false },
                campaign_ids: [mongoose.Schema.Types.ObjectId]
            }
        }
    },
    api_key: String,
    on_boarding: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
})

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
