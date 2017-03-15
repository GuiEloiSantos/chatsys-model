var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var iframe = new Schema(
    {
        client_id: {type: Schema.Types.ObjectId, ref: 'client' },
        code: String,
        categories:{type: Array, default: []},
        custom_form: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);
