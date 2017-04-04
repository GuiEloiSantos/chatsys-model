var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productInfo     = "PRODUCT INFORMATION";
var faqs            = "FAQS";
var basicInfo       = "BASIC INFORMATION";
var askVisitors     = "ASK VISITORS";


var faq = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company'},
        category_name: String,
        title: String,
        content: String,
        keywords: {type: Array, default: []},
        price: String,
        order: {type: Number, default: 0},
        count: {type: Number, default: 0}
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

    /**
     * @param  {String} company_id ,category_id, title, content response from auth0 Api
     * @return {Promise}
     */
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