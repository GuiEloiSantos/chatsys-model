var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var category = new Schema(
    {
        client_id: {type: Schema.Types.ObjectId, ref: 'client' },
        name: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);



module.exports = mongoose.model('Category', category);