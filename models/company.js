var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var company = new Schema(
    {
        name: String,
        lead_email: {type: Array, default: []},
        permission: {type: Array, default: []},
        email: String,
        industry: String,
        phone: String,
        timezone: {type: String, default: 'America/Los_Angeles'},
        plan: {
            name: String,
            value: {type: Number, default: 0},
            customer_id: String,
            subscription_id: String,
            type: {type: String, default: 'normal'},
            status: String,
            lead_limit: {type: Number, default: 0},
            chat_limit: {type: Number, default: 0}
        },
        settings: {
            lci_chat: {type: Number, default: 0},
            status: {type: String, default: 'active'},
            custom_hours: {
                active: {type: Boolean, default: false},
                start_date: {type: Date},
                end_date: {type: Date}
            },
            weekends: {type: Boolean, default: true},
            days: {type: Array, default: []},
            switcher_code: String,
            gtm_code: String,
            api_key: String
        },
        main_url: String,
        website: {
            urls: {type: Array, default: []},
            status_cake_id: {type: Array, default: []},
            status: {type: String, default: 'off'}
        },
        zoho: {
            customer_id: String,
            subscription_id: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
company.methods.addLeadEmail = function (leadEmail) {
    var LeadEmail = this.get('lead_email');
    LeadEmail.push(leadEmail);
    this.set('lead_email', LeadEmail);
    return this.save();
};
company.methods.replaceList = function (leadList) {
    this.set('lead_email', leadList);
    return this.save();
};
company.methods.updateIndustry = function (industry) {
    this.set({industry: industry});

    return this.save();
};
company.methods.updateBasic = function (name,phone,timezone,industry,main_url) {
    this.set({ name:name});
    this.set({ phone:phone});
    this.set({ timezone:timezone});
    this.set({ industry:industry});
    this.set({ main_url:main_url});
    return this.save();
};
company.static({
    newCompany: function (data) {
        var Company = this.model('Company');
        var company = new Company();
        //for simple signup
        var name = data.company;
        if (data.hasOwnProperty('user_metadata') && data.user_metadata.name) {
            name = data.user_metadata.company;
        }
        company.set({
            name: name,
            main_url: data.user_metadata.url
        });
        return company.save();
    }
});

module.exports = mongoose.model('Company', company);