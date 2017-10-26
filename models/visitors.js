let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let visitor = new Schema(
    {
        identifier: String,
        ip: String,
        website: String,
        location: String,
        date: {type: Date}
    },
    {
        timestamps: true,
        versionKey: false
    }
);
visitor.static({
    addNew: (ip, identifier, website, location) => {
        let Visitor = this.model('Visitor');
        let visitor = new Visitor();
        visitor.set({identifier: identifier});
        visitor.set({ip: ip});
        visitor.set({website: website});
        visitor.set({location: location.join(' - ')});
        visitor.set({date: new Date()});
        return visitor.save();
    }
})
;
module.exports = mongoose.model('Visitor', visitor);