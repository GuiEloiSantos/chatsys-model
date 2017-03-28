var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var faq = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company'},
        category_id: {type: Schema.Types.ObjectId, ref: 'category'},
        title: String,
        content: String,
        keywords: {type: Array, default: []},
        count: {type: Number, default: 0}
    },
    {
        timestamps: true,
        versionKey: false
    }
);


faq.static({

    /**
     * Creates a new user in our database
     *
     * @param  {String} company_id ,category_id, title, content response from auth0 Api
     * @return {Promise}
     */
    newFaq: function (company_id, category_id, title, content) {
        var Faq = this.model('Faq');
        var faq = new Faq();
        //for simple signup
        faq.set({
            company_id: company_id,
            category_id: category_id,
            title: title,
            content: content
        });
        return category.save();
    }
});

module.exports = mongoose.model('Faq', faq);