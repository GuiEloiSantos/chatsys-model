var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lead = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company' },
        chat_id: String,
        status: {type: String, default: "Pending"},
        notes: String,
        name: String,
        email: String,
        phone: String,
        converted: String,
        situation: String,
        rate: {type: Number, default: 0},
        custom_fields: {type: Array, default: []}
    },
    {
        timestamps: true,
        versionKey: false
    }
);





lead.static({
    newLead: function (company_id, chat_id, notes, name, email, phone, custom_fields) {
        var Lead = this.model('Lead');
        var lead= new Lead();
        lead.set({
            company_id: company_id,
            chat_id: chat_id,
            notes: notes,
            name: name,
            email: email,
            phone: phone,
            custom_fields: custom_fields
        });
        return lead.save();
    },
    getLeadByCompany: function (company_id) {
        var Lead = this.model('Lead');
        return Lead.find({'company_id':company_id});
    },
    modifyStatus: function (id,status) {
        var Lead = this.model('Lead');
        Lead.findOne({_id: id}).exec().then(function (lead) {
            return lead.update({
                status: status
            });
        });
    }
});


module.exports = mongoose.model('Lead', lead);