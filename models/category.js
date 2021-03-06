var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var category = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company' },
        name: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

category.static({

    /**
     * Creates a new user in our database
     *
     * @param name, id response from auth0 Api
     * @return {Promise}
     */
    newCategory: function(name, company_id){
        var Category = this.model('Category');
        var category = new Category();

        category.set({
            name: name,
            company_id: company_id
        });
        return category.save();
    },
    getCategoryByCompanyId: function (company_id) {
        Category = this.model('Category');
        return Category.find({'company_id':company_id});

    }
});

module.exports = mongoose.model('Category', category);