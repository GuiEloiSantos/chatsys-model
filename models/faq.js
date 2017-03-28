var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var faq = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'client' },
        category_id: {type: Schema.Types.ObjectId, ref: 'category' },
        title: String,
        content: String,
        keywords: {type: Array, default: []},
        count:{type: Number, default: 0}
    },
    {
        timestamps: true,
        versionKey: false
    }
);


module.exports = mongoose.model('Faq', faq);