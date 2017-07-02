var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plan = new Schema(
    {
        name: String,
        sale_name: String,
        code: {type: String, unique: true, index: true},
        description: String,
        addOns: {type: Array, default: []},
        price: {type: Number, default: 99},
        lead_limit: {type: Number, default: 0},
        chat_limit: {type: Number, default: 0},
        lead_price: {type: Number, default: 15},
        chat_price: {type: Number, default: 5}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

plan.methods.update = function (name,sale_name, code, description, addOns, price, lead_limit, chat_limit, lead_price, chat_price) {
    this.set({
        name: name,
        code: code,
        description: description,
        addOns: addOns,
        price: price,
        lead_limit: lead_limit,
        chat_limit: chat_limit,
        lead_price: lead_price,
        chat_price: chat_price
    });
    return this.save();
};

plan.static({

    newPlan: function (name,sale_name, code, description, addOns, price, lead_limit, chat_limit, lead_price, chat_price) {
        var Category = this.model('Category');
        var category = new Category();
        plan.set({
            name: name,
            sale_name: sale_name,
            code: code,
            description: description,
            addOns: addOns,
            price: price,
            lead_limit: lead_limit,
            chat_limit: chat_limit,
            lead_price: lead_price,
            chat_price: chat_price
        });
        return plan.save();
    }
});
module.exports = mongoose.model('Plan', plan);