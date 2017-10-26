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
        this.set({identifier: identifier});
        this.set({ip: ip});
        this.set({website: website});
        this.set({location: location.join(' - ')});
        this.set({date: new Date()});
        return this.save();
    }
})
;
module.exports = mongoose.model('Visitor', visitor);