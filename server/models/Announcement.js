const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    recycler: {
        type: Schema.Types.ObjectId,
        ref: 'RecyclerProfile',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    recipientCount: {
        type: Number,
        required: true,
        default: 0
    },
    recipients: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['draft', 'sent', 'failed'],
        default: 'sent'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sentAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
