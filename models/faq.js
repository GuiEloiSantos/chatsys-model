var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productInfo     = "PRODUCT INFORMATION";
var faqs            = "FAQS";
var basicInfo       = "BASIC INFORMATION";
var askVisitors     = "ASK VISITORS";
var continueExit     = "CONTINUE AND EXIT STATEMENT";


var faq = new Schema(
    {
        company_id:     {type: Schema.Types.ObjectId, ref: 'company'},
        category_name:  String,
        title:          String,
        content:        String,
        status:         {type: String, default: "Approved"},
        keywords:       {type: Array, default: []},
        price:          String,
        order:          {type: Number, default: 0},
        count:          {type: Number, default: 0},
        historic:        [{
            title : String,
            content : String,
            status: String,
            user: String,
            date: {type: Date}
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

faq.methods.replaceKeywords = function (keywords) {
    this.set('keywords', keywords);
    return this.save();
};
faq.methods.updateCount = function (count) {
    this.set({count: count});
    return this.save();
};
faq.static({
    newFaq: function (company_id,title,content,keywords, status, user) {
        status = status?status:"Approved";
        user = user?user:"System";
        var historic = [];
        var hist = {title:title, content:content,status:status,user:user,date:new Date()};
        historic.push(hist);

        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: faqs,
            title: title,
            content: content,
            keywords: keywords,
            status: status,
            historic:historic
        });
        return faq.save();
    },
    newAskVisitors: function (company_id,title,content,order, status, user) {
        status = status?status:"Approved";
        user = user?user:"System";
        var historic = [];
        var hist = {title:title, content:content,status:status,user:user,date:new Date()};
        historic.push(hist);
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: askVisitors,
            title: title,
            content: content,
            order: order,
            status: status,
            historic:historic
        });
        return faq.save();
    },
    // To change in case we need
    newBasicInformation: function (company_id,title,content, status, user) {
        status = status?status:"Approved";
        user = user?user:"System";
        var historic = [];
        var hist = {title:title, content:content,status:status,user:user,date:new Date()};
        historic.push(hist);
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: basicInfo,
            title: title,
            content: content,
            status: status,
            historic:historic
        });
        return faq.save();
    },
    // To change in case we need
    newProductInformation: function (company_id,title,content,price, status, user) {
        status = status?status:"Approved";
        user = user?user:"System";
        var historic = [];
        var hist = {title:title, content:content,status:status,user:user,date:new Date()};
        historic.push(hist);
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: productInfo,
            title: title,
            content: content,
            price: price,
            status: status,
            historic:historic
        });
        return faq.save();
    },
    newContinueExit: function (company_id,title,content, status, user) {
        status = status?status:"Approved";
        user = user?user:"System";
        var historic = [];
        var hist = {title:title, content:content,status:status,user:user,date:new Date()};
        historic.push(hist);
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: continueExit,
            title: title,
            content: content,
            status: status,
            historic:historic
        });
        return faq.save();
    },
    updateAny: function (id, title, content, keywords, price, order, count, status, user) {
        status = status?status:"Approved";
        user = user?user:"System";


        var Faq = this.model('Faq');
        Faq.findOne({_id: id}).exec().then(function (faq) {
            var historic = faq.get('historic');
            var hist = {title:title, content:content,status:status,user:user,date:new Date()};
            historic.push(hist);
            return faq.update({
                title: title,
                content: content,
                price: price,
                keywords: keywords,
                order: order,
                count: count,
                status: status,
                historic:historic
            });
        });


    },
    updateOrder: function (id, order) {

        var Faq = this.model('Faq');
        Faq.findOne({_id: id}).exec().then(function (faq) {
            return faq.update({ order: order });
        });
    },
    updateStatusFaq: function (id, status) {
        var Faq = this.model('Faq');
        Faq.findOne({_id: id}).exec().then(function (faq) {
            return faq.update({ status: status });
        });
    },
    getProductInfo:function (company_id) {
        var Faq = this.model('Faq');
        return Faq.getFaqByCompanyAndCategory(company_id, productInfo);
    },
    getFaqs:function (company_id) {
        var Faq = this.model('Faq');
        return Faq.getFaqByCompanyAndCategory(company_id, faqs);
    },
    getBasicInfo:function (company_id) {
        var Faq = this.model('Faq');
        return Faq.getFaqByCompanyAndCategory(company_id, basicInfo);
    },
    getAskVisitors:function (company_id) {
        var Faq = this.model('Faq');
        return Faq.getFaqByCompanyAndCategory(company_id, askVisitors);
    },
    getContinueExit:function (company_id) {
        var Faq = this.model('Faq');
        return Faq.getFaqByCompanyAndCategory(company_id, continueExit);
    },

    getFaqByCompanyAndCategory: function (company_id, category_name) {
        var Faq = this.model('Faq');
        return Faq.find({'company_id':company_id, 'category_name':category_name});
    },
    getFaqByCompany: function (company_id) {
        var Faq = this.model('Faq');
        return Faq.find({ 'company_id':company_id});
    },
    findFaqById: function (id) {
        var Faq = this.model('Faq');
        return Faq.findOne({_id: id});
    }
});

module.exports = mongoose.model('Faq', faq);