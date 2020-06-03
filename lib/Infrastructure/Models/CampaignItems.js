const mongoose = require('mongoose');

const CampaignItemsSchema = mongoose.Schema({
    campaign_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: [
            'draft',
            'awaited',
            'running',
            'completed',
            'paused',
            'stoped'
        ]
    },
    scheduled_at: {
        type: Date
    },
    xnoofdays:Number,
    item_type: {
        type: String,
        enum: [
            'initial',
            'reply',
            'open',
            'click',
            'noopen'
        ]
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    emailtemplate: {
        value: mongoose.Schema.Types.ObjectId,
        label: String
    },
    opened: [
        {
            recipient_id: {
                type: mongoose.Schema.Types.ObjectId
            },
            opened_at: {
                type: Date
            }
        }
    ],
    replied: [
        {
            recipient_id: {
                type: mongoose.Schema.Types.ObjectId
            },
            /* replied_at: {
                type: Date
            }, */
            //reply:String
            replies:[{
                strict:false,
                headers:{
                    Date:Date
                }
            }]
        }
    ],
    clicked: [
        {
            recipient_id: {
                type: mongoose.Schema.Types.ObjectId
            },
            link: {
                type: String
            },
            clicked_at: {
                type: Date
            }
        }
    ],
    hasChild:Boolean,
    childElem:[mongoose.Schema.Types.ObjectId]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false })

const CampaignItemModel = mongoose.model('campaignitems', CampaignItemsSchema)

module.exports = CampaignItemModel;