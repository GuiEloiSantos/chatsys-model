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
            lead_actual: {type: Number, default: 0},
            chat_limit: {type: Number, default: 0},
            chat_actual: {type: Number, default: 0}
        },
        settings: {
            lci_chat: {type: Number, default: 0},
            status: {type: String, default: 'active'},
            custom_hours: {
                active: {type: Boolean, default: false},
                start_time: String,
                end_time: String
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


company.methods.activeGTM = function () {
    var data = "dataLayer.push({'eventCategory': 'Lead','eventAction': 'Captured','eventLabel': 'Chat Lead','event': 'chat-lead'});";
    this.set({"settings.gtm_code": data });
    return this.save();
};

company.methods.clearGTM = function () {
    var data = "";
    this.set({"settings.gtm_code": data });
    return this.save();
};

company.methods.generateApiKey = function (key) {
    this.set({"settings.api_key": key });
    this.save();
    return key;
};


company.methods.updateBasic = function (name,phone,timezone,industry,main_url) {
    this.set({ name:name});
    this.set({ phone:phone});
    this.set({ timezone:timezone});
    this.set({ industry:industry});
    this.set({ main_url:main_url});
    return this.save();
};
company.methods.updateSettings = function (cust_h,start_time,end_time,weekends,switcher_code) {
    this.set({ "settings.weekends":weekends});
    this.set({ "settings.custom_hours.active":cust_h});
    this.set({ "settings.switcher_code":switcher_code});
    this.set({ "settings.custom_hours.start_time":start_time});
    this.set({ "settings.custom_hours.end_time":end_time});
    return this.save();
};
company.static({
    getCompanyLiveChatId: function (lci_chat) {
        var Company = this.model('Company');
        return Company.find({'settings.lci_chat':lci_chat});
    },
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