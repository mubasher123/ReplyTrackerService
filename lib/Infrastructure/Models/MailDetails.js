const mongoose = require('mongoose');

const MailDetailSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    token: {
        type: Number
    },
    custom: {
        verified: Boolean,
        smtp_creds: {
            service: {
                type: String
            },
            host: {
                type: String
            },
            secure: {
                type: Boolean
            },
            port: {
                type: Number
            },
            require_tls: {
                type: Boolean
            },
            username: {
                type: String
            },
            password: {
                type: String
            },
            passwordhash: {
                type: String
            }
        },
        imap_creds: {
            host: {
                type: String
            },
            port: {
                type: Number
            },
            username: {
                type: String
            },
            password: {
                type: String
            },
            tls: {
                type: Boolean
            },
            passwordhash: {
                type: String
            }
        }
    },
    amazonses: {
        access_key: String,
        secret_key: String,
        region: String,
        imap_creds: {
            host: String,
            username: String,
            passwordhash: String,
            port: Number,
            tls: Boolean
        }
    },
    office365: {
        smtp_creds: {
            service: {
                type: String
            },
            host: {
                type: String,
                default: 'smtp.office365.com'
            },
            port: {
                type: Number,
                default: 587
            },
            require_tls: {
                type: Boolean,
                default: true
            },
            username: {
                type: String
            },
            passwordhash: {
                type: String
            }
        },
        imap_creds: {
            host: {
                type: String,
                default: "outlook.office365.com"
            },
            port: {
                type: Number,
                default: 993
            },
            username: {
                type: String
            },
            tls: {
                type: Boolean,
                default: true
            },
            passwordhash: {
                type: String
            }
        }
    },
    gmail: {
        sendAsEmails: { type: [String], default: [] },
        username: String,
        access_creds: {
            access_token: {
                type: String
            },
            refresh_token: {
                type: String
            },
            expiry_date: {
                type: String //string not Date
            },
            token_type: {
                type: String
            }
        }
    },
    sendgrid: {
        api_key: String,
        email_id: String
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false });


const MailDetailsModel = mongoose.model('maildetails', MailDetailSchema);

module.exports = MailDetailsModel;
