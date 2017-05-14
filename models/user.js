var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema(
    {
        auth0_user_id: String,
        name: String,
        company_id: {type: Schema.Types.ObjectId, ref: 'company'},
        type: {type: String, default: 'admin'},
        status: {type: String, default: 'form'},
        permission: {type: Array, default: []},
        email_verified: Boolean,
        email: String,
        picture: String,
        phone: String,
        plans: { type: Array, default:[] },
        timezone: {type: String, default: 'America/Los_Angeles'},
        syst_admin: {type: Boolean, default: false}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

user.methods.isEmailVerified = function () {
    return this.get('email_verified');
};
user.methods.getAuth0UserId = function () {
    return this.get('auth0_user_id');
};

user.methods.getStatus = function () {
    return this.get('status');
};

user.methods.updateStatus = function (status) {
    this.set({status: status});
    return this.save();
};
user.methods.updatePicture = function (picture) {
    this.set({picture: picture});
    return this.save();
};
user.methods.updateStatusFaq = function () {
    return this.updateStatus("faqs");
};
user.methods.updateStatusComplete = function () {
    return this.updateStatus("complete");
};

user.methods.blockUser = function () {
  return this.updateStatus("block");
};

user.methods.updateEmailVerification = function (verified) {
    return this.update({email_verified: verified});
};

user.methods.updateBasic = function (name,phone,timezone) {
    this.set({phone: phone});
    this.set({name: name});
    this.set({timezone: timezone});
    return this.save();
};


user.static({

    /**
     * Get the user details by Auth0 Id
     *
     * @param  {Object} id from the slash command
     * @return {Promise}
     */
    getUserByAuth0Id: function (id) {
        var User = this.model('User');
        return User.findOne({auth0_user_id: id}).exec();
    },

    newUserChatSys: function (data, id, auth0) {
        var User = this.model('User');
        var user = new User();
        //for simple signup

        user.set({
            auth0_user_id: auth0.user_id,
            name: data.ContactName,
            timezone: data.Tzone,
            email_verified: true,
            phone: data.Phone,
            status: "complete",
            picture: auth0.picture,
            company_id: id,
            email: auth0.email
        });
        return user.save();
    },
    /**
     * Creates a new user in our database
     *
     * @param  {Object} data response from auth0 Api
     * @return {Promise}
     */
    newUser: function (data, id) {
        var User = this.model('User');
        var user = new User();
        var plans = [];
        //for simple signup
        var name = data.nickname;
        if (data.hasOwnProperty('user_metadata') && data.user_metadata.name) {
            name = data.user_metadata.name;
        }

        data.user_metadata.plancode1?plans.push(data.user_metadata.plancode1):plans.push("default");
        data.user_metadata.plancode2?plans.push(data.user_metadata.plancode2):"";
        data.user_metadata.plancode3?plans.push(data.user_metadata.plancode3):"";

        user.set({
            auth0_user_id: data.user_id,
            name: name,
            email_verified: data.email_verified,
            picture: data.picture,
            company_id: id,
            plans: plans,
            email: data.email
        });
        return user.save();
    }
});

module.exports = mongoose.model('User', user);