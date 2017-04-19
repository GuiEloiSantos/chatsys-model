var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lead = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company' },
        chat_id: {type:String, unique:true},
        status: {type: String, default: "Pending"},
        notes: String,
        name: String,
        email: String,
        phone: String,
        converted: String,
        situation: String,
        rate: {type: Number, default: 0},
        custom_fields: {type: Array, default: []},
        date: {type: Date}
    },
    {
        timestamps: true,
        versionKey: false
    }
);





lead.static({
    newLead: function (company_id, chat_id, notes, name, email, phone, date, custom_fields) {
        var Lead = this.model('Lead');
        var lead= new Lead();
        var situation = '';
        if(!name && !email && !phone){
            situation = 'SEE TRANSCRIPT';
        }
        lead.set({
            company_id: company_id,
            chat_id: chat_id,
            notes: notes,
            name: name,
            email: email,
            phone: phone,
            date: date,
            situation: situation,
            custom_fields: custom_fields
        });
        return lead.save();
    },
    getLeadByCompany: function (company_id) {
        var Lead = this.model('Lead');
        return Lead.find({'company_id':company_id});
    },
    getLeadByChatId: function (chat_id) {
        var Lead = this.model('Lead');
        return Lead.findOne({'chat_id':chat_id});
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