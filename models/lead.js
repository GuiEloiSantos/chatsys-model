var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lead = new Schema(
    {
        client_id: {type: Schema.Types.ObjectId, ref: 'client' },
        chat_id: {type: Schema.Types.ObjectId, ref: 'chat' },
        status: String,
        notes: String,
        name: String,
        email: String,
        phone: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);
