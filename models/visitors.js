let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let visitor = new Schema(
    {
        code: {type: String, index: true},
        ip: String,
        website: String,
        location: String,
        date: {type: Date},
        company_id: {type: Schema.Types.ObjectId, ref: 'company'}
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
        visitor.set({code: code});
        visitor.set({ip: ip});
        visitor.set({website: website});
        visitor.set({company_id: company_id});
        visitor.set({location: location.join(' - ')});
        visitor.set({date: new Date()});
        return visitor.save();
    }
});
module.exports = mongoose.model('Visitor', visitor);