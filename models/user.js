var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema(
    {
        auth0_user_id: String,
        name: String,
        company_id: {type: Schema.Types.ObjectId, ref: 'company'},
        type: String,
        permission: {type: Array, default: []},
        email_verified: Boolean,
        email: String,
        picture: String,
        phone: String,
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

user.methods.updateStatus = function (status) {
    return this.update({status: status});
};
user.methods.updateStatusFaq = function () {
    return this.updateStatus("faqs");
};
user.methods.updateStatusComplete = function () {
    return this.updateStatus("complete");
};

user.methods.updateEmailVerification = function (verified) {
    return this.update({email_verified: verified});
};


user.static({

    /**
     * Get the user details by Auth0 Id
     *
     * @param  {Object} data from the slash command
     * @return {Promise}
     */
    getUserByAuth0Id: function (id) {
        var User = this.model('User');
        return User.findOne({auth0_user_id: id}).exec();
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
        //for simple signup
        var name = data.nickname;
        if (data.hasOwnProperty('user_metadata') && data.user_metadata.name) {
            name = data.user_metadata.name;
        }
        user.set({
            auth0_user_id: data.user_id,
            name: name,
            email_verified: data.email_verified,
            picture: data.picture,
            company_id: id,
            email: data.email
        });
        return user.save();
    }
});

module.exports = mongoose.model('User', user);