var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chat = new Schema(
    {
        client_id: {type: Schema.Types.ObjectId, ref: 'client' },
        chat_id: String,
        date: {type: Date}
    },
    {
        timestamps: true,
        versionKey: false
    }
);



module.exports = mongoose.model('Chat', chat);