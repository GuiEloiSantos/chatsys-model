var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chat = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company_id' },
        chat_id: {type: String, unique:true},
        status: { type: String, default:"Chat"},
        date: {type: Date}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

chat.static({
    newChat: function (company_id, chat_id, status) {
        var Chat = this.model('Chat');
        var chat = new Chat();

        var date = new Date();
        chat.set({
            company_id: company_id,
            chat_id: chat_id,
            status: status,
            date: date
        });
        return chat.save();
    },
    getChatByCompany: function (company_id) {
        var Chat = this.model('Chat');
        return Chat.find({'company_id':company_id});
    },
    modifyStatus: function (id,status) {
        var Chat = this.model('Chat');
        Chat.findOne({_id: id}).exec().then(function (chat) {
            return chat.update({
                status: status
            });
        });
    }
});



module.exports = mongoose.model('Chat', chat);