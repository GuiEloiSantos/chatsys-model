var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema(
    {
        auth0_user_id: String,
        name: String,
        company_id:  {type: Schema.Types.ObjectId, ref: 'company' },
        type: String,
        permission: {type: Array, default: []},
        email_verified: Boolean,
        email: String,
        phone: String,
        timezone: {type: String, default: 'America/Los_Angeles'},
        syst_admin: {type: Boolean, default: false}
    },
    {
        timestamps: true,
        versionKey: false
    }
);