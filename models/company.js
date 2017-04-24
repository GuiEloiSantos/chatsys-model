var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('../lib/util');
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
            currency: String,
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
            api_key: String,
            custom_form: String,
            chat_sys_id: String
        },
        main_url: String,
        status_cake: {
            id: String,
            status: {type: Boolean, default: false}
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
    this.set({ main_url:util.formatUrl(main_url)});
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
        return Company.findOne({'settings.lci_chat':lci_chat}).exec();
    },
    newCompanyFromChatSys: function(data){
        var Company = this.model('Company');
        var company = new Company();
        var status, custom_hours;
        if(data.Active == 1){
            status = 'active';
        }else{
            status = 'inactive';
        }
        custom_hours = (data.SetHours == 1);
        //for simple signup
        company.set({
            name: data.Name,
            email: data.Email,
            phone: data.Phone,
            timezone: data.Tzone,
            "plan.name": data.plan_name,
            "plan.value": data.amount,
            "plan.type": "paid",
            "plan.status": data.status,
            "plan.lead_limit": data.PPL_Credit,
            "plan.chat_limit": data.ppc_limit,
            "plan.currency": data.currency_code,
            "settings.lci_chat": data.Groupid,
            "settings.status":status,
            "settings.custom_hours.active":custom_hours,
            "settings.custom_hours.start_time": data.StartHour,
            "settings.custom_hours.end_time": data.EndHour,
            "settings.weekends":(data.Weekend==0),
            "settings.switcher_code":data.CustomCode,
            "settings.gtm_code":data.conversion_code,
            "settings.api_key":data.api_key,
            "settings.custom_form":data.CustomIframe,
            "settings.chat_sys_id":data.id,
            "main_url":data.Website,
            "status_cake.id":data.status_cake_id,
            "status_cake.status":data.status_website,
            "zoho.customer_id": data.zoho_id,
            "zoho.subscription_id": data.zoho_refid

        });
        return company.save();
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
            main_url: util.formatUrl(data.user_metadata.url)
        });
        return company.save();
    }
});



module.exports = mongoose.model('Company', company);