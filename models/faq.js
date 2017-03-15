var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var faq = new Schema(
    {
        client_id: {type: Schema.Types.ObjectId, ref: 'client' },
        category_id: {type: Schema.Types.ObjectId, ref: 'category' },
        title: String,
        content: String,
        count:{type: Number, default: 0}
    },
    {
        timestamps: true,
        versionKey: false
    }
);
