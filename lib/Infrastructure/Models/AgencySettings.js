const mongoose = require('mongoose');

const AgencySetting = mongoose.Schema({
    agency_id: String,
    domain_name: String,
    layout_settings: {
        logo_filename: String,
        favicon_url: String,
        intro_image: String,
        intro_header: String,
        intro_description: String,
        theme: {
            theme_name: String,
            theme_color: String
        },
        title:String,
        description:String,
        product_name:String,
        facebook_url:String,
        twitter_url:String
    },
    maildetails: {
        maildetails_verified:{
            type:Boolean,
            default:false
        },
        admin_transporter: {
            service: String,
            host: String,
            port: Number,
            secure: Boolean,
            requireTLS: Boolean,
            auth: {
                user: String,
                pass: String
            },
            tls: {
                rejectUnauthorized: Boolean
            }
        },
        setpassword_subject: String,
        forgotpass_subject: String,
        formated_from_addr: String,
        send_coupon_subject: String,
        mail_footer:[String],
    },
    gmail_oauth: {
        client_id: String,
        client_secret: String,
        redirect_uris: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
});

const SettingModel = mongoose.model('agency-settings', AgencySetting);

module.exports = SettingModel;

