let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let visitor = new Schema(
    {
        visitor_id: {type: String, unique: true, index: true},
        code: {type: String, index: true},
        ip: String,
        website: String,
        location: String,
        date: {type: Date},
        company_id: {type: Schema.Types.ObjectId, ref: 'company', index: true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);
visitor.static({
    addNew: function (ip, code, website, location, company_id) {
        let Visitor = this.model('Visitor');
        let visitor = new Visitor();
        let date = new Date();
        visitor.set({visitor_id: code + company_id + date.getDate() + date.getMonth() + date.getFullYear()});
        visitor.set({code: code});
        visitor.set({ip: ip});
        visitor.set({website: website});
        visitor.set({company_id: company_id});
        visitor.set({location: location.join(' - ')});
        visitor.set({date: date});
        return visitor.save(function (err) {
            if (err && err.code === 11000) {
                return Promise.resolve(err);
            }
        });
    }
});
module.exports = mongoose.model('Visitor', visitor);