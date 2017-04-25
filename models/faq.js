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
        keywords:       {type: Array, default: []},
        price:          String,
        order:          {type: Number, default: 0},
        count:          {type: Number, default: 0}
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


    newFaq: function (company_id,title,content,keywords) {
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: faqs,
            title: title,
            content: content,
            keywords: keywords
        });
        return faq.save();
    },
    newAskVisitors: function (company_id,title,content,order) {
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: askVisitors,
            title: title,
            content: content,
            order: order
        });
        return faq.save();
    },
    newBasicInformation: function (company_id,title,content) {
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: basicInfo,
            title: title,
            content: content
        });
        return faq.save();
    },
    newProductInformation: function (company_id,title,content,price) {
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: productInfo,
            title: title,
            content: content,
            price: price
        });
        return faq.save();
    },
    newContinueExit: function (company_id,title,content) {
        var Faq = this.model('Faq');
        var faq = new Faq();
        faq.set({
            company_id: company_id,
            category_name: continueExit,
            title: title,
            content: content
        });
        return faq.save();
    },
    updateAny: function (id,company_id, title, content, keywords, price, order, count) {
        var Faq = this.model('Faq');
        Faq.findOne({_id: id}).exec().then(function (faq) {
            return faq.update({
                company_id: company_id,
                title: title,
                content: content,
                price: price,
                keywords: keywords,
                order: order,
                count: count
            });
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