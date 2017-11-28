var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lead = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company'},
        chat_id: {type: String, unique: true, index: true},
        status: {type: String, default: "Pending"},
        notes: String,
        name: String,
        email: String,
        phone: String,
        converted: String,
        situation: String,
        rate: {type: Number, default: 0},
        custom_fields: {type: Array, default: []},
        date: {type: Date},
        visitor_id: String,
        visitor_ip: String,
        refer_url: String,
        url: String,
        transcript: String,
        enrich: {type: Boolean, default: false},
        enrich_company: {type: Array, default: []},
        enrich_person: {type: Array, default: []}

    },
    {
        timestamps: true,
        versionKey: false
    }
);

lead.methods.SetEnrich = function (data, person, company) {
    this.set({enrich: data});
    this.set({enrich_person: person});
    this.set({enrich_company: company});
    return this.save();
};

lead.static({
    newLead: function (company_id, chat_id, notes, name, email, phone, date, custom_fields, refer_url, url) {
        var Lead = this.model('Lead');
        var lead = new Lead();
        var situation = '';
        if (!name && !email && !phone) {
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
            custom_fields: custom_fields,
            refer_url: refer_url,
            url: url
        });
        return lead.save();
    },
    getLeadByCompany: function (company_id, status) {
        var Lead = this.model('Lead');
        if(!status)
            return Lead.find({'company_id': company_id});
        else if(status == 'pending')
            return Lead.find({'company_id': company_id, status: "Pending"});
        else if(status == 'completed')
            return Lead.find({'company_id': company_id, status: "Completed"});

    },
    getLeadToAPI: function (company_id, start_date, end_date) {
        var Lead = this.model('Lead');
        var date_from = new Date(start_date);
        var date_to = new Date(end_date);
        return Lead.find({
            'company_id': company_id,
            'date': {
                $gte: date_from,
                $lt: date_to
            }
        });
    },
    getLeadByChatId: function (chat_id) {
        var Lead = this.model('Lead');
        return Lead.findOne({'chat_id': chat_id});
    },
    addNote: function(id, notes){
        var Lead = this.model('Lead');
        Lead.findOne({chat_id: id}).exec().then(function (lead) {
            return lead.update({
                notes: notes
            });
        });
    },
    modifyStatus: function (id, status) {
        var Lead = this.model('Lead');
        Lead.findOne({_id: id}).exec().then(function (lead) {
            return lead.update({
                status: status
            });
        });
    },
    setTranscript: function (id,transcript,refer_url, url) {
        var Lead = this.model('Chat');
        Lead.findOne({chat_id: id}).exec().then(function (lead) {
            return lead.update({
                transcript: transcript,
                refer_url: refer_url,
                url: url
            });
        });
    }
});


module.exports = mongoose.model('Lead', lead);