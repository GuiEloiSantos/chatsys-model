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
        permission_valid: {type: Boolean, default: true},
        historic:        [{
            target : String,
            changes : String,
            user: String,
            date: {type: Date}
        }],
        plan: {
            name: String,
            value: {type: Number, default: 0},
            currency: String,
            type: {type: String, default: 'normal'},
            status: String,
            lead_limit: {type: Number, default: 0},
            lead_actual: {type: Number, default: 0},
            chat_limit: {type: Number, default: 0},
            chat_actual: {type: Number, default: 0},
            lead_price: {type: Number, default: 15},
            chat_price: {type: Number, default: 5},
            expiry_date: {type: Date}
        },
        settings: {
            lci_chat: {type: Number, default: 9999990},
            status: {type: String, default: 'active'},
            custom_hours: {
                active: {type: Boolean, default: false},
                start_time: String,
                end_time: String
            },
            webhooks: {
                onLead: String,
                onChat: String
            },
            weekends: {type: Boolean, default: true},
            days: {type: Array, default: []},
            switcher_code: String,
            gtm_code: String,
            ga_code: {type: Boolean, default: false},
            api_key: String,
            custom_form: String,
            custom_iframe_code: String,
            custom_iframe_window: String,
            custom_iframe_window_name: String,
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
company.methods.updateIframeSettings = function (custom_form, custom_iframe_code, custom_iframe_window, custom_iframe_window_name, user) {
    user = user?user:"System";
    var content = "Custom form: "+custom_form+" Custom iFrame code: "+custom_iframe_code+" Custom iFrame Window: "+custom_iframe_window+" Custom iFrame Window Name: "+custom_iframe_window_name;

    var historic = this.historic;
    var hist = {target:"iFrame Settings", changes:content,user:user,date:new Date()};
    historic.push(hist);

    this.set({historic: historic});

    this.set({'settings.custom_form': custom_form});
    this.set({'settings.custom_iframe_code': custom_iframe_code});
    this.set({'settings.custom_iframe_window': custom_iframe_window});
    this.set({'settings.custom_iframe_window_name': custom_iframe_window_name});
    return this.save();
};

company.methods.updatePlanDetails = function (name, value, currency, type, status, lead_limit, chat_limit, lead_price, subscription_id, lci_chat) {
    this.set({'plan.name': name});
    this.set({'plan.value': value});
    this.set({'plan.currency': currency});
    this.set({'plan.type': type});
    this.set({'plan.status': status});
    this.set({'plan.lead_limit': lead_limit});
    this.set({'plan.chat_limit': chat_limit});
    this.set({'plan.lead_price': lead_price});
    this.set({'settings.lci_chat': lci_chat});
    this.set({'zoho.subscription_id': subscription_id});
    return this.save();
};

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
company.methods.replacePermission = function (permission) {
    this.set('permission', permission);
    return this.save();
};
company.methods.updateIndustry = function (industry) {
    this.set({industry: industry});
    return this.save();
};
company.methods.activeGTM = function (user) {


    user = user?user:"System";
    var content = "Activated Tag Manager";

    var historic = this.historic;
    var hist = {target:"Google Tag Manager", changes:content,user:user,date:new Date()};
    historic.push(hist);

    this.set({historic: historic});

    var data = "dataLayer.push({'eventCategory': 'Lead','eventAction': 'Captured','eventLabel': 'Chat Lead','event': 'chat-lead'});";
    this.set({"settings.gtm_code": data});
    return this.save();
};
company.methods.clearGTM = function (user) {
    user = user?user:"System";
    var content = "Deactivated Tag Manager";

    var historic = this.historic;
    var hist = {target:"Google Tag Manager", changes:content,user:user,date:new Date()};
    historic.push(hist);
    this.set({historic: historic});

    var data = "";
    this.set({"settings.gtm_code": data});
    return this.save();
};
company.methods.setGA = function (bool, user) {
    user = user?user:"System";
    var content = bool?"Activated Google Analytics":"Deactivated Google Analytics";

    var historic = this.historic;
    var hist = {target:"Google Analytics", changes:content,user:user,date:new Date()};
    historic.push(hist);
    this.set({historic: historic});


    this.set({"settings.ga_code": bool});
    return this.save();
};
company.methods.saveHooks = function (onLead, onChat, user) {
    user = user?user:"System";
    var content = "On Chat: "+onChat+" On Lead: "+onLead;

    var historic = this.historic;
    var hist = {target:"Web Hook", changes:content,user:user,date:new Date()};
    historic.push(hist);
    this.set({historic: historic});

    this.set({"settings.webhooks.onLead": onLead});
    this.set({"settings.webhooks.onChat": onChat});
    return this.save();
};
company.methods.changeStatus = function (data, user) {
    user = user?user:"System";
    var content = data=="active"?"Turned ON":"Turned OFF";

    var historic = this.historic;
    var hist = {target:"Chat Status", changes:content,user:user,date:new Date()};
    historic.push(hist);

    this.set({historic: historic});


    this.set({"settings.status": data});
    return this.save();
};
company.methods.generateApiKey = function (key, user) {
    user = user?user:"System";
    var content = "Generate you an API Key";

    var historic = this.historic;
    var hist = {target:"API Key", changes:content,user:user,date:new Date()};
    historic.push(hist);

    this.set({historic: historic});
    this.set({"settings.api_key": key});
    this.save();
    return key;
};
company.methods.updateChat = function (chat_actual) {
    this.set({"plan.chat_actual": chat_actual});
    return this.save();
};
company.methods.updateLead = function (lead_actual) {
    this.set({"plan.lead_actual": lead_actual});
    return this.save();
};
company.methods.updateZoho = function (customer_id, subscription_id) {
    this.set({"zoho.customer_id": subscription_id});
    this.set({"zoho.subscription_id": customer_id});
    return this.save();
};

company.methods.updateBasic = function (name, phone, timezone, industry, main_url, email, user) {
    user = user?user:"System";
    var content = "Name: "+name+" Phone: "+phone+" Timezone: "+timezone+" Industry: "+industry+" Email: "+email;

    var historic = this.historic;
    var hist = {target:"Basic Company Information", changes:content,user:user,date:new Date()};
    historic.push(hist);

    this.set({historic: historic});
    this.set({name: name});
    this.set({phone: phone});
    this.set({email: email});
    this.set({timezone: timezone});
    this.set({industry: industry});
    this.set({main_url: util.formatUrl(main_url)});
    return this.save();
};
company.methods.updateSettings = function (cust_h, start_time, end_time, weekends, switcher_code, user) {
    user = user?user:"System";
    var content = "";
    weekends?content+="Weekends On ":content+="Weekends OFF  ";
    cust_h?content+="Custom hours from "+start_time+" to "+end_time+" ":content+="Custom hours OFF  ";
    var historic = this.historic;
    var hist = {target:"Chat settings", changes:content,user:user,date:new Date()};
    historic.push(hist);

    this.set({historic: historic});
    this.set({"settings.weekends": weekends});
    this.set({"settings.custom_hours.active": cust_h});
    this.set({"settings.switcher_code": switcher_code});
    this.set({"settings.custom_hours.start_time": start_time});
    this.set({"settings.custom_hours.end_time": end_time});
    return this.save();
};
company.methods.updatePlan = function (name, value, currency, type, status, lead_limit, chat_limit, lead_price, chat_price, expiry_date) {
    this.set({"plan.name": name});
    this.set({"plan.value": value});
    this.set({"plan.currency": currency});
    this.set({"plan.type": type});
    this.set({"plan.status": status});
    this.set({"plan.lead_limit": lead_limit});
    this.set({"plan.chat_limit": chat_limit});
    this.set({"plan.lead_price": lead_price});
    this.set({"plan.chat_price": chat_price});
    this.set({"plan.expiry_date": expiry_date});
    return this.save();
};
company.static({
    getCompanyApi: function (user, api_key) {
        var Company = this.model('Company');
        return Company.findOne({'email': user, 'settings.api_key': api_key}).exec();
    },
    getCompanyChatSys: function (chat_sys_id) {
        var Company = this.model('Company');
        return Company.findOne({'settings.chat_sys_id': chat_sys_id}).exec();
    },
    getCompanyByCustomerId: function (customer_id) {
        var Company = this.model('Company');
        return Company.findOne({"zoho.customer_id": customer_id}).exec();
    },
    getCompanyLiveChatId: function (lci_chat) {
        var Company = this.model('Company');
        return Company.findOne({'settings.lci_chat': lci_chat}).exec();
    },
    newCompanyFromChatSys: function (data) {
        var Company = this.model('Company');
        var company = new Company();
        var status, custom_hours;
        if (data.Active == 1) {
            status = 'active';
        } else {
            status = 'inactive';
        }
        custom_hours = (data.SetHours == 1);
        var leadList = [];

        var expiry_date;
        if (data.contract_expiry_date) {
            var expiry = data.contract_expiry_date.split('-');
            expiry_date = new Date(expiry[0], expiry[1] - 1, expiry[2]);
        } else {
            expiry_date = new Date();
        }

        var user = "System";
        var content = "Company was created";

        var historic = [];
        var hist = {target:"Company Created", changes:content,user:user,date:new Date()};
        historic.push(hist);

        //for simple signup
        company.set({
            historic: historic,
            name: data.Name,
            email: data.SupportEmail,
            phone: data.Phone,
            timezone: data.Tzone,
            'lead_email': leadList,
            "plan.name": data.plan_name,
            "plan.value": data.amount,
            "plan.type": "paid",
            "plan.status": data.status,
            "plan.lead_limit": data.PPL_Credit > 1 ? data.PPL_Credit : -1,
            "plan.chat_limit": data.ppc_limit > 1 ? data.ppc_limit : -1,
            "plan.lead_price": data.ppl_client > 1 ? data.ppl_client : 0,
            "plan.chat_price": data.ppc_client > 1 ? data.ppc_client : 0,
            "plan.expiry_date": expiry_date,
            "plan.currency": data.currency_code,
            "settings.lci_chat": data.Groupid,
            "settings.status": status,
            "settings.custom_hours.active": custom_hours,
            "settings.custom_hours.start_time": data.StartHour,
            "settings.custom_hours.end_time": data.EndHour,
            "settings.weekends": (data.Weekend == 0),
            "settings.switcher_code": data.CustomCode,
            "settings.gtm_code": data.conversion_code,
            "settings.api_key": data.apikey,
            "settings.custom_form": data.CustomIframe,
            "settings.chat_sys_id": data.id,
            "main_url": util.formatUrl(data.Website),
            "status_cake.id": data.status_cake_id,
            "status_cake.status": (data.status_website == 1),
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
        var user = "System";
        var content = "Company was created";

        var historic = [];
        var hist = {target:"Company Created", changes:content,user:user,date:new Date()};
        historic.push(hist);


        company.set({
            historic: historic,
            name: name,
            main_url: util.formatUrl(data.user_metadata.url)
        });
        return company.save();
    }
});


module.exports = mongoose.model('Company', company);